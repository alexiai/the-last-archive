/* Exercise the shipped controller through real browser input, not movement calls.
   World access below only places independent physical fixtures and reads results. */
const assert = require("node:assert/strict"),
  pptr = require("puppeteer-core"),
  fs = require("node:fs"),
  path = require("node:path");

(async () => {
  const browser = await pptr.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      ...(process.env.TEST_PROXY_TLS === "1"
        ? ["--ignore-certificate-errors"]
        : []),
    ],
  });
  let checks = 0;
  const diagnostics = [],
    base = process.env.SCENEPLAY_URL || "http://localhost:8098/sceneplay/";
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewport({
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    await page.goto(base + "?test=1");
    await page.waitForSelector("#new-game", { timeout: 90000 });
    await page.evaluate(() => {
      localStorage.setItem("lastarchive.casework.v1", "previous-edition-kept");
      localStorage.setItem(
        "lastarchive.sceneplay.v1",
        JSON.stringify({
          edition: "sceneplay-1",
          version: 1,
          started: true,
          introSeen: true,
          position: "room",
          phone: true,
          sound: false,
        }),
      );
    });
    await page.reload();
    await page.waitForSelector("#resume-game", { timeout: 90000 });
    await page.click("#resume-game");
    await page.waitForSelector(".walk-pad");
    const client = await page.createCDPSession();
    let touchActive = false;

    async function point(selector) {
      return page.$eval(selector, (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    }
    async function touch(type, points) {
      if (!touchActive && !points.length) return;
      await client.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: points.map((p) => ({ radiusX: 7, radiusY: 7, ...p })),
      });
      touchActive = points.length > 0;
    }
    async function settle(ms = 160) {
      await page.evaluate(
        (ms) =>
          new Promise((resolve) =>
            setTimeout(() => requestAnimationFrame(resolve), ms),
          ),
        ms,
      );
    }
    async function position() {
      return page.evaluate(() => ({
        x: sceneplayView.camera.position.x,
        y: sceneplayView.camera.position.y,
        z: sceneplayView.camera.position.z,
        yaw: sceneplayView.lookOffset.yaw,
        lookX: sceneplayView.targetLook.x - sceneplayView.camera.position.x,
        lookZ: sceneplayView.targetLook.z - sceneplayView.camera.position.z,
        now: performance.now(),
      }));
    }
    async function renderDiagnostic(routePage) {
      return routePage.evaluate(
        () =>
          new Promise((resolve) => {
            const start = performance.now(),
              times = [];
            function tick(now) {
              times.push(now);
              if (now - start < 1000) return requestAnimationFrame(tick);
              const info = sceneplayView.renderer.info;
              resolve({
                width: innerWidth,
                height: innerHeight,
                softwareRenderer: sceneplayView.software,
                frames: times.length,
                elapsedMs: now - start,
                framesPerSecond: ((times.length - 1) * 1000) / (now - times[0]),
                drawCalls: info.render.calls,
                triangles: info.render.triangles,
              });
            }
            requestAnimationFrame(tick);
          }),
      );
    }
    const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
    async function fixture(x, z, dx = 0, dz = 1) {
      await touch("touchEnd", []);
      await page.evaluate(
        ({ x, z, dx, dz }) => {
          const w = sceneplayView;
          w.move("room", true);
          w.camera.position.set(x, 1.64, z);
          w.targetLook.set(x + dx, 1.64, z + dz);
          w.lookOffset = { yaw: 0, pitch: 0 };
          w.camera.lookAt(w.targetLook);
          if (!w.canStand(x, z))
            throw new Error(`Invalid physical fixture: ${x}, ${z}`);
        },
        { x, z, dx, dz },
      );
      await settle(40);
    }
    async function hold(direction, ms = 500) {
      const p = await point(`[data-walk="${direction}"]`),
        before = await position();
      await page.evaluate((direction) => {
        const probe = { frames: [], direction },
          snapshot = () => ({
            now: performance.now(),
            x: sceneplayView.camera.position.x,
            z: sceneplayView.camera.position.z,
          });
        probe.listen = (ev) => {
          if (ev.target.closest?.("[data-walk]")?.dataset.walk !== direction)
            return;
          probe[ev.type] = snapshot();
        };
        for (const event of ["pointerdown", "pointerup"])
          window.addEventListener(event, probe.listen, event === "pointerdown");
        probe.active = true;
        const frame = (now) => {
          if (!probe.active) return;
          probe.frames.push(now);
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        window.__controllerProbe = probe;
      }, direction);
      await touch("touchStart", [{ id: 1, ...p }]);
      await settle(ms);
      await touch("touchEnd", []);
      const after = await position(),
        timing = await page.evaluate(() => {
          const probe = window.__controllerProbe;
          probe.active = false;
          for (const event of ["pointerdown", "pointerup"])
            window.removeEventListener(
              event,
              probe.listen,
              event === "pointerdown",
            );
          const frames = probe.frames.filter(
            (t) => t >= probe.pointerdown?.now && t <= probe.pointerup?.now,
          );
          return {
            down: probe.pointerdown,
            up: probe.pointerup,
            heldFrames: frames.length,
            framesPerSecond:
              frames.length > 1
                ? ((frames.length - 1) * 1000) / (frames.at(-1) - frames[0])
                : null,
            drawCalls: sceneplayView.renderer.info.render.calls,
            triangles: sceneplayView.renderer.info.render.triangles,
          };
        });
      assert.ok(
        timing.down && timing.up,
        "both native pointer lifecycle events were delivered",
      );
      const result = {
        before,
        after,
        timing,
        roundTripSeconds: (after.now - before.now) / 1000,
        seconds: (timing.up.now - timing.down.now) / 1000,
        metres: distance(timing.down, timing.up),
      };
      console.log(
        JSON.stringify({ held: direction, requestedMs: ms, ...result }),
      );
      return result;
    }
    async function padLayout(width, height) {
      await page.setViewport({ width, height, isMobile: true, hasTouch: true });
      await settle(100);
      const layout = await page.evaluate(() => {
        const r = document.querySelector(".walk-pad").getBoundingClientRect();
        return {
          pad: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
          buttons: [...document.querySelectorAll(".walk-pad [data-walk]")].map(
            (el) => {
              const b = el.getBoundingClientRect();
              return {
                direction: el.dataset.walk,
                label: el.getAttribute("aria-label"),
                width: b.width,
                height: b.height,
                topmost: el.contains(
                  document.elementFromPoint(
                    b.left + b.width / 2,
                    b.top + b.height / 2,
                  ),
                ),
              };
            },
          ),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.deepEqual(layout.buttons.map((b) => b.direction).sort(), [
        "backward",
        "forward",
        "left",
        "right",
      ]);
      assert.ok(
        layout.buttons.every(
          (b) => b.width >= 44 && b.height >= 44 && b.label && b.topmost,
        ),
        "every direction has a named, unobscured 44px touch target",
      );
      assert.ok(
        layout.pad.left >= 8 &&
          layout.pad.right < width / 2 &&
          layout.pad.top > height / 2 &&
          layout.pad.bottom <= height - 8 &&
          !layout.overflow,
        "the pad stays in the lower-left corner without horizontal overflow",
      );
      checks += 3;
      if (process.env.CAPTURE_DIR) {
        fs.mkdirSync(process.env.CAPTURE_DIR, { recursive: true });
        await page.screenshot({
          path: path.join(process.env.CAPTURE_DIR, `controller-${width}.png`),
        });
      }
    }

    await padLayout(390, 844);
    // The west aisle is clear for more than four metres, independently of
    // controller internals. This catches elapsed-time and held-input failures.
    await fixture(-2.8, -2.4);
    const forward = await hold("forward", 800);
    assert.ok(forward.after.z > forward.before.z + 1.6);
    assert.ok(Math.abs(forward.after.x - forward.before.x) < 0.12);
    assert.ok(Math.abs(forward.after.y - forward.before.y) < 0.03);
    const speed = forward.metres / forward.seconds;
    diagnostics.push({
      direction: "forward",
      ...forward,
      metresPerSecond: speed,
    });
    assert.ok(
      speed >= 2.5,
      `clear-aisle movement is too slow: ${speed.toFixed(2)}m/s`,
    );
    checks += 4;
    const released = await position();
    await settle(280);
    assert.ok(
      distance(released, await position()) < 0.025,
      "release stops movement",
    );
    checks++;

    await fixture(-2.8, 0.4);
    const backward = await hold("backward", 500);
    assert.ok(backward.after.z < backward.before.z - 0.8);
    assert.ok(Math.abs(backward.after.x - backward.before.x) < 0.12);
    checks += 2;
    await fixture(-2.5, -1.8);
    const left = await hold("left", 350);
    assert.ok(left.after.x > left.before.x + 0.6);
    assert.ok(Math.abs(left.after.z - left.before.z) < 0.12);
    checks += 2;
    await fixture(-0.7, -1.8);
    const right = await hold("right", 350);
    assert.ok(right.after.x < right.before.x - 0.6);
    assert.ok(Math.abs(right.after.z - right.before.z) < 0.12);
    checks += 2;
    await fixture(-2.8, 1.65, 1, 0);
    const turned = await hold("forward", 300);
    assert.ok(turned.after.x > turned.before.x + 0.5);
    assert.ok(Math.abs(turned.after.z - turned.before.z) < 0.12);
    checks += 2;

    // A low table must block feet even though it is below the camera eye line.
    await fixture(0, 1.7, 0, -1);
    const table = await hold("forward", 900);
    assert.ok(table.after.z > 0.55 && table.after.z < 1.45);
    assert.ok(Math.abs(table.after.x) < 0.12);
    checks += 2;
    await fixture(-2.8, -0.1, -1, 0);
    const wall = await hold("forward", 900);
    assert.ok(wall.after.x >= -3.3 && wall.after.x < -2.85);
    checks++;

    await fixture(-2.8, -2.4);
    const up = await point('[data-walk="forward"]');
    await touch("touchStart", [{ id: 1, ...up }]);
    await settle(120);
    await touch("touchCancel", []);
    const cancelled = await position();
    await settle(260);
    assert.ok(
      distance(cancelled, await position()) < 0.025,
      "touch cancellation stops movement",
    );
    checks++;
    await touch("touchStart", [{ id: 1, ...up }]);
    await settle(120);
    await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    const blurred = await position();
    await settle(260);
    assert.ok(
      distance(blurred, await position()) < 0.025,
      "window blur clears held input",
    );
    await touch("touchEnd", []);
    checks++;

    // A physical held key retains its original direction when focus changes.
    await fixture(-2.8, -2.4);
    const keyedStart = await position();
    await page.focus('[data-walk="forward"]');
    await page.keyboard.down("Space");
    await settle(100);
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement?.dataset.walk),
      "left",
    );
    await page.keyboard.up("Space");
    const keyedEnd = await position();
    assert.ok(keyedEnd.z > keyedStart.z + 0.15);
    await settle(250);
    assert.ok(
      distance(keyedEnd, await position()) < 0.025,
      "releasing Space clears its original held direction after Tab moves focus",
    );
    assert.deepEqual(await page.evaluate(() => sceneplayView.walkInput), {
      forward: 0,
      side: 0,
    });
    checks += 4;

    // Two actual touch identifiers: one holds the pad, one turns the view.
    await fixture(-2.8, -2.4);
    const beforeLook = await position(),
      view = { id: 2, x: 240, y: 390 };
    await touch("touchStart", [{ id: 1, ...up }]);
    await touch("touchStart", [{ id: 1, ...up }, view]);
    await touch("touchMove", [
      { id: 1, ...up },
      { ...view, x: 300 },
    ]);
    await settle(160);
    const duringLook = await position();
    await touch("touchEnd", []);
    assert.ok(Math.abs(duringLook.yaw - beforeLook.yaw) > 0.1);
    assert.ok(
      distance(beforeLook, duringLook) > 0.2,
      "walking continues during second-finger look",
    );
    checks += 2;

    // Opening a modal with a second finger must not leave the first held.
    await fixture(-2.8, -2.4);
    const pause = await point("#pause");
    await touch("touchStart", [{ id: 1, ...up }]);
    await touch("touchStart", [
      { id: 1, ...up },
      { id: 2, ...pause },
    ]);
    await touch("touchEnd", [{ id: 2, ...pause }]);
    await page.waitForSelector("#close-settings");
    await touch("touchEnd", []);
    const paused = await position();
    await settle(250);
    assert.ok(distance(paused, await position()) < 0.025);
    assert.equal(await page.$(".walk-pad"), null);
    await page.click("#close-settings");
    const resumed = await position();
    await settle(250);
    assert.ok(
      distance(resumed, await position()) < 0.025,
      "return from pause has no stuck movement",
    );
    checks += 3;

    await fixture(-2.8, -2.4, 0.3, 1);
    await hold("forward", 250);
    const retained = await position();
    await page.click("#pocket-phone");
    assert.equal(await page.$(".walk-pad"), null);
    await page.click("#phone-home");
    await page.click('[data-app="notes"]');
    await page.click("#put-phone-away");
    assert.ok(
      distance(retained, await position()) < 0.025,
      "putting away a carried tool preserves free position",
    );
    await page.reload();
    await page.waitForSelector("#resume-game", { timeout: 90000 });
    await page.click("#resume-game");
    await page.waitForSelector(".walk-pad");
    const restored = await position();
    assert.ok(
      distance(retained, restored) < 0.04,
      "reload restores the actual walked position",
    );
    assert.ok(
      Math.abs(retained.lookX - restored.lookX) < 0.02 &&
        Math.abs(retained.lookZ - restored.lookZ) < 0.02 &&
        Math.abs(retained.yaw - restored.yaw) < 0.02,
      "reload restores the walked heading",
    );
    checks += 4;

    // A second finger can choose a floor destination while the first walks.
    // Record the actual floor action at native pointerup, before its handler.
    // Walk into the west boundary so the actual held state remains active but
    // rendering/CDP latency cannot move the selected floor out from under it.
    await fixture(-3.15, -0.1, 1, 0);
    await page.evaluate(() => {
      sceneplayView.lookOffset.pitch = -0.4;
    });
    await settle(80);
    const heldPad = await point('[data-walk="backward"]');
    await touch("touchStart", [{ id: 1, ...heldPad }]);
    await settle(160);
    const heldFloor = await page.evaluate(() => {
      window.__heldFloorAction = null;
      const capture = (ev) => {
        if (ev.target.id !== "world" || ev.isPrimary) return;
        window.__heldFloorAction = sceneplayView.hit(
          ev.clientX,
          ev.clientY,
        )?.userData.action;
        window.removeEventListener("pointerup", capture, true);
      };
      window.addEventListener("pointerup", capture, true);
      for (const yf of [0.52, 0.6, 0.68, 0.76, 0.84])
        for (const xf of [0.4, 0.5, 0.6, 0.7]) {
          const x = xf * innerWidth,
            y = yf * innerHeight;
          if (
            document.elementFromPoint(x, y)?.id === "world" &&
            sceneplayView.hit(x, y)?.userData.action?.startsWith("walk:")
          )
            return { x, y };
        }
    });
    assert.ok(
      heldFloor,
      "a floor destination remains visible during held walking",
    );
    await touch("touchStart", [
      { id: 1, ...heldPad },
      { id: 2, ...heldFloor },
    ]);
    await touch("touchEnd", [{ id: 2, ...heldFloor }]);
    await touch("touchEnd", []);
    const heldAction = await page.evaluate(() => window.__heldFloorAction);
    assert.ok(
      heldAction?.startsWith("walk:"),
      "the secondary native floor touch chooses an actual route",
    );
    await page.waitForFunction(() => !sceneplayView.walk, { timeout: 30000 });
    const destination = await position(),
      destinationSave = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1")),
      );
    assert.equal(destinationSave.position, heldAction.slice(5));
    assert.equal(
      destinationSave.freePose,
      null,
      "an old manual pose cannot overwrite a newly chosen destination",
    );
    await page.reload();
    await page.waitForSelector("#resume-game", { timeout: 90000 });
    await page.click("#resume-game");
    await page.waitForSelector(".walk-pad");
    assert.ok(
      distance(destination, await position()) < 0.04,
      "reload resumes at the chosen destination after cancelling held input",
    );
    checks += 5;

    // Direct floor pointing remains an alternative to the held controller.
    await page.evaluate(() => sceneplayView.move("threshold", true));
    await settle(80);
    const floor = await page.evaluate(() => {
      for (const xf of [0.2, 0.35, 0.5, 0.65, 0.8])
        for (const yf of [0.58, 0.68, 0.75, 0.82]) {
          const x = xf * innerWidth,
            y = yf * innerHeight,
            hit = sceneplayView.hit(x, y);
          if (
            hit?.userData.action?.startsWith("walk:") &&
            hit.userData.action !== `walk:${sceneplayView.place}` &&
            document.elementFromPoint(x, y)?.id === "world"
          )
            return { x, y, place: hit.userData.action.slice(5) };
        }
    });
    assert.ok(floor, "a visible, unobscured part of the floor can be tapped");
    await touch("touchStart", [{ id: 1, x: floor.x, y: floor.y }]);
    await touch("touchEnd", []);
    await page.waitForFunction(() => !sceneplayView.walk, { timeout: 30000 });
    assert.equal(await page.evaluate(() => sceneplayView.place), floor.place);
    checks += 2;

    async function measureRoute(routePage, menuWaitMs = 0) {
      await routePage.evaluate(() => sceneplayView.move("room", true));
      // The fixture changes the camera directly. Let that view actually render
      // before opening a menu, rather than timing its deferred first paint.
      await routePage.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      await routePage.click("#move-assist");
      if (menuWaitMs)
        await routePage.evaluate(
          (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
          menuWaitMs,
        );
      const start = await routePage.evaluate(() => {
        window.__routeTiming = { ms: null, firstFrame: null };
        const click = (ev) => {
          if (ev.target.closest?.('[data-place="window"]') == null) return;
          window.removeEventListener("click", click, true);
          const inputAt = performance.now();
          const frame = () => {
            if (!window.__routeTiming.firstFrame) {
              window.__routeTiming.firstFrame = {
                now: performance.now(),
                walkStart: sceneplayView.walk?.start,
                duration: sceneplayView.walk?.duration,
              };
            }
            if (sceneplayView.walk) return requestAnimationFrame(frame);
            window.__routeTiming.ms = performance.now() - inputAt;
          };
          setTimeout(() => requestAnimationFrame(frame), 0);
        };
        window.addEventListener("click", click, true);
        return performance.now();
      });
      await routePage.click('[data-place="window"]');
      await routePage.waitForFunction(() => window.__routeTiming.ms !== null, {
        timeout: 30000,
      });
      return routePage.evaluate(
        (start) => ({
          actualMs: window.__routeTiming.ms,
          roundTripMs: performance.now() - start,
          firstFrame: window.__routeTiming.firstFrame,
          arrival: {
            x: sceneplayView.camera.position.x,
            z: sceneplayView.camera.position.z,
            place: sceneplayView.place,
          },
        }),
        start,
      );
    }
    const currentTiming = await measureRoute(page),
      routeMs = currentTiming.actualMs;
    diagnostics.push({ route: "room-to-window", currentTiming });
    assert.ok(
      currentTiming.arrival.place === "window" &&
        Math.hypot(
          currentTiming.arrival.x + 2.45,
          currentTiming.arrival.z + 0.1,
        ) < 0.04,
      "timed travel actually arrives at the requested window viewpoint",
    );
    assert.ok(
      currentTiming.firstFrame.walkStart <= currentTiming.firstFrame.now,
      "a newly chosen route starts immediately instead of inheriting paused-menu time",
    );
    assert.ok(
      routeMs < 1600,
      `short room route is still too slow: ${Math.round(routeMs)}ms`,
    );
    const currentRender = await renderDiagnostic(page);
    diagnostics.push({
      route: "room-to-window",
      currentMs: routeMs,
      currentTiming,
      currentRender,
    });
    const delayedTiming = await measureRoute(page, 1000);
    diagnostics.push({
      route: "room-to-window",
      menuWaitMs: 1000,
      delayedTiming,
    });
    assert.ok(
      delayedTiming.actualMs < 1600,
      "deliberating in the navigation menu does not delay a newly chosen walk",
    );
    assert.ok(
      delayedTiming.actualMs - routeMs < 500,
      "navigation time stays independent of time spent paused in its menu",
    );
    assert.ok(
      delayedTiming.firstFrame.walkStart <= delayedTiming.firstFrame.now,
      "menu deliberation cannot schedule the new walk in the future",
    );
    checks += 6;
    if (process.env.BASELINE_SCENEPLAY_URL) {
      // Keep only one WebGL scene rendering for each comparable measurement.
      await page.evaluate(() => sceneplayView.stop());
      const baseline = await browser.newPage();
      await baseline.setViewport({
        width: 390,
        height: 844,
        isMobile: true,
        hasTouch: true,
      });
      await baseline.goto(process.env.BASELINE_SCENEPLAY_URL + "?test=1");
      await baseline.waitForSelector("#new-game", { timeout: 90000 });
      await baseline.evaluate(() =>
        localStorage.setItem(
          "lastarchive.sceneplay.v1",
          JSON.stringify({
            edition: "sceneplay-1",
            version: 1,
            started: true,
            introSeen: true,
            position: "room",
            phone: true,
            sound: false,
          }),
        ),
      );
      await baseline.reload();
      await baseline.waitForSelector("#resume-game", { timeout: 90000 });
      await baseline.click("#resume-game");
      const previousTiming = await measureRoute(baseline),
        baselineMs = previousTiming.actualMs;
      assert.ok(
        routeMs < baselineMs * 0.7,
        "the same route is materially faster than the previous packaged game",
      );
      diagnostics.push({
        route: "room-to-window",
        previousMs: baselineMs,
        currentMs: routeMs,
        speedup: baselineMs / routeMs,
        currentTiming,
        previousTiming,
        currentRender,
        previousRender: await renderDiagnostic(baseline),
      });
      checks++;
      await baseline.close();
      await page.bringToFront();
      await page.evaluate(() => sceneplayView.start());
    }

    await padLayout(844, 390);
    await page.click("#pocket-phone");
    assert.equal(await page.$(".walk-pad"), null);
    await page.click('[data-app="notes"]');
    await page.click("#put-phone-away");
    assert.ok(await page.$(".walk-pad"));
    checks += 2;

    const performanceSample = await renderDiagnostic(page);
    diagnostics.push({ renderDiagnostic: performanceSample });
    assert.deepEqual(errors, []);
    assert.equal(
      await page.evaluate(() =>
        localStorage.getItem("lastarchive.casework.v1"),
      ),
      "previous-edition-kept",
    );
    checks += 2;
    console.log(
      JSON.stringify({ controllerDiagnostics: diagnostics }, null, 2),
    );
    console.log(
      `${checks} real touch-controller, movement speed, collision, release/cancel/modal and mobile-layout checks passed. FPS is a local renderer diagnostic, not physical iPhone Safari certification.`,
    );
  } catch (error) {
    console.log(
      JSON.stringify({ controllerDiagnostics: diagnostics }, null, 2),
    );
    throw error;
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
