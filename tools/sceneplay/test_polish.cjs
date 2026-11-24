const assert = require("node:assert/strict"),
  pptr = require("puppeteer-core"),
  path = require("node:path"),
  fs = require("node:fs");
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
  const base = process.env.SCENEPLAY_URL || "http://localhost:8098/sceneplay/";
  try {
    for (const [width, height] of [
      [1280, 800],
      [390, 844],
      [844, 390],
    ]) {
      const c = await b.createBrowserContext(),
        p = await c.newPage(),
        errors = [];
      await p.setViewport({ width, height, deviceScaleFactor: 1 });
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(base + "?test=1");
      await p.waitForSelector("#new-game", { timeout: 90000 });
      await p.click("#new-game");
      await p.waitForFunction(
        () => document.querySelector("#intro-film")?.currentTime > 3.25,
        { timeout: 45000 },
      );
      await p.$eval("#intro-film", (v) => v.pause());
      await p.waitForFunction(
        () =>
          !document.querySelector("#intro-film").seeking &&
          !document.querySelector(".subtitle").hidden,
      );
      assert.equal(
        await p.$eval("#intro-film", (v) => getComputedStyle(v).objectFit),
        "contain",
      );
      checks++;
      assert.ok(
        await p.$eval(
          "#skip-intro",
          (el) => el.getBoundingClientRect().height >= 44,
        ),
      );
      checks++;
      assert.ok(
        await p.$eval(
          ".cinema .subtitle",
          (el) => el.getBoundingClientRect().bottom <= innerHeight + 2,
        ),
      );
      checks++;
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      checks++;
      if (process.env.CAPTURE_DIR) {
        fs.mkdirSync(process.env.CAPTURE_DIR, { recursive: true });
        await p.screenshot({
          path: path.join(
            process.env.CAPTURE_DIR,
            `polish-cinema-${width}.png`,
          ),
        });
      }
      await p.click("#skip-intro");
      await p.click('[data-dialogue-choice="0"]');
      if (width === 1280) {
        const motion = await p.evaluate(() => {
          const w = sceneplayView;
          w.stop();
          const snapshot = (t) => {
            w.cinematic(t);
            return {
              door: w.entry.rotation.y,
              head: w.head.rotation.toArray().slice(0, 3),
              mouth: w.rig.mouth.scale.y,
              camera: w.camera.position.toArray(),
            };
          };
          const a = snapshot(26);
          snapshot(5);
          const b = snapshot(26);
          snapshot(40);
          const d = snapshot(26);
          const silent = snapshot(2).mouth;
          const clip = w.motionData.clips["intro-0"],
            peak = clip.values.indexOf(Math.max(...clip.values));
          const voiced = snapshot(3 + peak / w.motionData.sampleRate).mouth;
          return { a, b, d, silent, voiced };
        });
        assert.deepEqual(motion.a, motion.b);
        assert.deepEqual(motion.a, motion.d);
        checks++;
        assert.ok(motion.voiced > motion.silent * 2);
        checks++;
      }
      await p.evaluate(() => {
        const s = JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1"));
        s.phone = true;
        s.position = "room";
        localStorage.setItem("lastarchive.sceneplay.v1", JSON.stringify(s));
      });
      await p.reload();
      await p.waitForSelector("#resume-game", { timeout: 90000 });
      await p.click("#resume-game");
      await p.click("#pocket-phone");
      await p.click('[data-app="messages"]');
      await p.click('[data-thread="adrian"]');
      assert.equal(await p.$$eval(".message", (els) => els.length), 3);
      checks++;
      await p.click("#phone-home");
      await p.click('[data-app="notes"]');
      assert.equal(await p.$$eval("[data-note]", (els) => els.length), 4);
      checks++;
      await p.click("[data-note]");
      assert.ok(await p.$(".personal-note"));
      checks++;
      await p.click("#put-phone-away");
      await p.reload();
      await p.waitForSelector("#resume-game", { timeout: 90000 });
      await p.click("#resume-game");
      await p.click("#pocket-phone");
      assert.ok(await p.$(".personal-note"));
      checks++;
      if (process.env.CAPTURE_DIR)
        await p.screenshot({
          path: path.join(process.env.CAPTURE_DIR, `polish-note-${width}.png`),
        });
      await p.click("#phone-home");
      await p.click('[data-app="voice"]');
      await p.click("#phone-recording");
      await p.waitForFunction(
        () =>
          Number(
            document
              .querySelector("#recording-ink-mask rect")
              ?.getAttribute("width"),
          ) > 0,
        { timeout: 30000 },
      );
      checks++;
      await p.click("#phone-recording-stop");
      await p.waitForFunction(
        () =>
          Number(
            document
              .querySelector("#recording-ink-mask rect")
              .getAttribute("width"),
          ) === 0,
      );
      checks++;
      await p.click("#put-phone-away");
      await p.click("#notebook");
      await p.type("#private-notes", "The original stays linked.");
      assert.equal(
        await p.$eval("#private-notes", (el) => el === document.activeElement),
        true,
      );
      checks++;
      if (process.env.CAPTURE_DIR)
        await p.screenshot({
          path: path.join(
            process.env.CAPTURE_DIR,
            `polish-notebook-${width}.png`,
          ),
        });
      await p.click("#close-notebook");
      assert.ok(await p.$("#pause"));
      assert.deepEqual(errors, []);
      checks++;
      console.log("Polish flow verified", width, height);
      await c.close();
    }
  } finally {
    await b.close();
  }
  console.log(
    `${checks} cinematic framing, deterministic character/door poses, speech, retained phone notes, waveform and physical UI checks passed.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
