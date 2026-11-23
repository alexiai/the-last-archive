/* Authored-route regression through the actual 3D canvas and visible controls. */
const assert = require("node:assert/strict"),
  pptr = require("puppeteer-core");
(async () => {
  const b = await pptr.launch({
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
  try {
    for (const width of [1365, 390]) {
      console.log("Rendered route viewport", width);
      const context = await b.createBrowserContext(),
        p = await context.newPage();
      await p.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      const base =
        process.env.SCENEPLAY_URL || "http://localhost:8098/sceneplay/";
      await p.goto(base + "?test=1");
      await p.waitForSelector("#new-game", { timeout: 90000 });
      assert.equal(await p.$("#casebook"), null);
      checks++;
      await p.evaluate(() =>
        localStorage.setItem(
          "lastarchive.casework.v1",
          "previous-casework-kept",
        ),
      );
      await p.click("#new-game");
      await p.click("#skip-intro");
      await p.click('[data-dialogue-choice="0"]');
      await p.waitForSelector("#pause");
      await p.waitForFunction(() => !sceneplayView.walk, { timeout: 30000 });
      checks++;
      const ground = await p.evaluate(() => {
        for (const x of [0.2, 0.35, 0.5, 0.65, 0.8])
          for (const y of [0.58, 0.68, 0.75]) {
            const px = x * innerWidth,
              py = y * innerHeight,
              h = sceneplayView.hit(px, py);
            if (
              h?.userData.action?.startsWith("walk:") &&
              h.userData.action !== `walk:${sceneplayView.place}` &&
              document.elementFromPoint(px, py)?.id === "world"
            )
              return { x: px, y: py, target: h.userData.action.slice(5) };
          }
      });
      assert.ok(
        ground,
        "the visible floor provides an in-world movement target",
      );
      await p.mouse.click(ground.x, ground.y);
      await p.waitForFunction(() => !sceneplayView.walk, { timeout: 90000 });
      assert.equal(await p.evaluate(() => sceneplayView.place), ground.target);
      checks++;
      async function move(id) {
        if (!(await p.$("#move-assist"))) {
          await p.screenshot({
            path: require("node:path").join(
              process.env.CAPTURE_DIR || require("node:os").tmpdir(),
              "sceneplay-navigation-failure.png",
            ),
          });
          console.log(
            "Navigation screen",
            await p.$eval("#ui", (el) => el.firstElementChild?.className),
          );
        }
        await p.click("#move-assist");
        await p.click(`[data-place="${id}"]`);
        await p.waitForFunction(() => !window.sceneplayView.walk, {
          timeout: 90000,
        });
      }
      async function tapObject(id) {
        let coords;
        for (let turn = 0; turn < 20; turn++) {
          coords = await p.evaluate((id) => {
            const w = window.sceneplayView,
              o = w.targets.find((t) => t.userData.action === id),
              v = o.position.clone().project(w.camera);
            const x = ((v.x + 1) * innerWidth) / 2,
              y = ((1 - v.y) * innerHeight) / 2;
            return {
              x,
              y,
              z: v.z,
              width: innerWidth,
              height: innerHeight,
              hit: w.hit(x, y)?.userData?.action,
            };
          }, id);
          if (
            coords.z < 1 &&
            coords.x > 25 &&
            coords.x < coords.width - 25 &&
            coords.y > 180 &&
            coords.y < coords.height - 150
          )
            break;
          if (coords.z >= 1 || coords.x > coords.width - 25)
            await p.click("#look-right");
          else if (coords.x < 25) await p.click("#look-left");
          else
            await p.keyboard.press(
              coords.y > coords.height - 150 ? "ArrowDown" : "ArrowUp",
            );
          await p.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              ),
          );
        }
        assert.ok(
          coords.x > 0 &&
            coords.x < coords.width &&
            coords.y > 0 &&
            coords.y < coords.height,
          "look controls bring the object into view",
        );
        assert.equal(
          coords.hit,
          id,
          `physical ${id} is reachable in the rendered scene`,
        );
        checks++;
        await p.mouse.click(coords.x, coords.y);
      }

      async function inspect(id, place = id) {
        await move(place);
        await tapObject(id);
        try {
          await p.waitForSelector("#keep-view:not([disabled])", {
            timeout: 45000,
          });
        } catch (error) {
          await p.screenshot({
            path: require("node:path").join(
              process.env.CAPTURE_DIR || require("node:os").tmpdir(),
              "sceneplay-inspect-failure.png",
            ),
          });
          console.log(
            "Inspection diagnostics",
            await p.evaluate(() => ({
              walk: !!sceneplayView.walk,
              animating: sceneplayView.animating,
              place: sceneplayView.place,
              screen:
                document.querySelector("#ui").firstElementChild?.className,
              keep: document.querySelector("#keep-view")?.disabled,
            })),
            errors,
          );
          throw error;
        }
        if (id === "shelf") {
          const original = await p.evaluate(() =>
            sceneplayView.camera.position.toArray(),
          );
          await p.click("#lean-closer");
          await p.evaluate(
            () =>
              new Promise((r) =>
                requestAnimationFrame(() => requestAnimationFrame(r)),
              ),
          );
          assert.notDeepEqual(
            await p.evaluate(() => sceneplayView.camera.position.toArray()),
            original,
          );
          checks++;
        }
        await p.click("#keep-view");
        await p.click("#step-back");
        await p.waitForFunction(() => !window.sceneplayView.walk, {
          timeout: 90000,
        });
      }
      await inspect("shelf");
      console.log("Shelf examined");
      await inspect("sofa", "room");
      console.log("Room comparison view examined");
      await move("phone");
      await tapObject("phone");
      await p.waitForSelector("#take-phone:not([disabled])", {
        timeout: 90000,
      });
      await p.click("#take-phone");
      assert.ok(await p.$(".phone-device"));
      checks++;
      await p.click('[data-app="messages"]');
      if (!(await p.$('[data-thread="elena"]'))) {
        await p.screenshot({
          path: require("node:path").join(
            process.env.CAPTURE_DIR || require("node:os").tmpdir(),
            "sceneplay-phone-debug.png",
          ),
        });
        console.log(
          "Phone route",
          await p.$eval(".phone-screen header", (el) => el.textContent),
        );
      }
      await p.click('[data-thread="elena"]');
      assert.ok(await p.$(".message"));
      await p.click("#phone-home");
      await p.click('[data-app="voice"]');
      await p.click("#phone-recording");
      await p.click("#phone-recording-stop");
      checks++;
      await p.click("#phone-home");
      await p.click('[data-app="photos"]');
      await p.click('[data-photo="before"]');
      await p.click("#photo-description");
      await p.click("#describe-sofa");
      await p.click("#close-photo-meta");
      await p.click("#close-photo");
      checks++;
      await p.click("#phone-home");
      await p.click('[data-app="messages"]');
      await p.click('[data-thread="mara"]');
      await p.click("#message-attachment");
      await p.waitForFunction(
        () =>
          document.querySelector("#source-photo").complete &&
          document.querySelector("#source-photo").naturalWidth > 0,
      );
      // A wrong image location must not grant the source detail. Then mark the actual
      // visible object projected from the canonical model (authored-route, not blind).
      const old = await p.evaluate(
        () =>
          JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1"))
            .observations,
      );
      const image = await p.$(".photo-stage"),
        r = await image.boundingBox();
      await p.mouse.click(r.x + r.width * 0.1, r.y + r.height * 0.1);
      assert.deepEqual(
        await p.evaluate(
          () =>
            JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1"))
              .observations,
        ),
        old,
      );
      checks++;
      const region = await p.evaluate(
        async () => await (await fetch("assets/photos/regions.json")).json(),
      );
      const point = await p.$eval(
        ".photo-stage",
        (el, target) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width * target[0],
            y: r.top + r.height * target[1],
          };
        },
        region.queued.shelf,
      );
      await p.mouse.click(point.x, point.y);
      checks++;
      await p.click("#photo-description");
      await p.click("#describe-sofa");
      await p.click("#close-photo-meta");
      await p.click("#photo-info");
      await p.click("#keep-metadata");
      await p.click("#close-photo");
      await p.click("#put-phone-away");
      const saved = await p.evaluate(() =>
        JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1")),
      );
      assert.ok(
        [
          "scene-gap",
          "scene-sofa",
          "queued-shelf",
          "queued-sofa",
          "queued-time",
        ].every((v) => saved.observations.includes(v)),
      );
      assert.equal(saved.finding, false);
      checks++;
      await p.click("#notebook");
      await p.type("#private-notes", "Keep this question through a reload.");
      await p.click("#close-notebook");
      await p.reload();
      await p.waitForSelector("#resume-game", { timeout: 90000 });
      await p.click("#resume-game");
      await p.waitForSelector("#pause");
      await p.click("#notebook");
      assert.equal(
        await p.$eval("#private-notes", (e) => e.value),
        "Keep this question through a reload.",
      );
      await p.click('[data-observation="queued-shelf"]');
      assert.ok(await p.$("#source-photo"));
      await p.click("#close-photo");
      await p.click("#close-notebook");
      checks++;
      await move("landing");
      await tapObject("officer");
      await p.click('[data-dialogue-choice="2"]');
      await p.click('[data-dialogue-choice="0"]');
      await p.click('[data-dialogue-choice="0"]');
      await p.click('[data-dialogue-choice="1"]');
      await p.click('[data-dialogue-choice="1"]');
      await p.click('[data-dialogue-choice="1"]');
      assert.equal(
        await p.evaluate(
          () =>
            JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1"))
              .finding,
        ),
        true,
      );
      checks++;
      await p.click('[data-dialogue-choice="0"]');
      await p.click('[data-dialogue-choice="0"]');
      assert.ok(await p.$(".prologue-end"));
      checks++;
      assert.equal(
        await p.evaluate(() => localStorage.getItem("lastarchive.casework.v1")),
        "previous-casework-kept",
      );
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.deepEqual(errors, []);
      checks++;
      if (process.env.CAPTURE_DIR)
        await p.screenshot({
          path: process.env.CAPTURE_DIR + `/sceneplay-route-${width}.png`,
        });
      await context.close();
    }
    console.log(
      `${checks} rendered-world interaction, phone, original-source deduction, dialogue, reload and desktop/mobile checks passed. Authored solution; no blind playtime claim.`,
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
