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
    const p = await b.newPage();
    await p.setViewport({ width: 1280, height: 800 });
    const base = process.env.SCENEPLAY_URL || "http://localhost:8099/",
      remote = [],
      bad = [];
    p.on("request", (r) => {
      if (
        r.url().startsWith("http") &&
        !r.url().startsWith(new URL(base).origin)
      )
        remote.push(r.url());
    });
    p.on("response", (r) => {
      if (r.status() >= 400 && !r.url().endsWith("/favicon.ico"))
        bad.push(r.status() + " " + r.url());
    });
    await p.goto(base + "?test=1");
    await p.waitForSelector("#new-game", { timeout: 90000 });
    await p.click("#new-game");
    await p.waitForFunction(
      () => document.querySelector("#intro-film")?.currentTime > 0.3,
      { timeout: 30000 },
    );
    assert.ok(
      await p.$eval("#intro-film", (v) => v.duration > 43.9 && v.playsInline),
    );
    checks++;
    await p.click("#intro-transcript");
    assert.equal(await p.$eval("#intro-film", (v) => v.paused), true);
    assert.ok(await p.$(".cinema .panel"));
    await p.click("#close-film-transcript");
    await p.click("#film-play");
    await p.waitForFunction(
      () => !document.querySelector("#intro-film").paused,
    );
    checks++;
    await p.click("#intro-sound");
    assert.equal(await p.$eval("#intro-film", (v) => v.muted), true);
    await p.$eval("#intro-film", (v) => {
      v.currentTime = v.duration - 0.35;
    });
    await p.waitForSelector('[data-dialogue-choice="0"]', { timeout: 30000 });
    await p.click('[data-dialogue-choice="0"]');
    assert.ok(await p.$("#pause"));
    checks++;
    await p.evaluate(() =>
      Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(Error("Offline installation did not complete")),
            60000,
          ),
        ),
      ]),
    );
    await p.waitForFunction(() => navigator.serviceWorker.controller, {
      timeout: 60000,
    });
    const allowed = await p.evaluate(
      async () => await (await fetch("offline-manifest.json")).json(),
    );
    assert.ok(allowed.files.includes("./game.js"));
    assert.ok(allowed.files.includes("./assets/models/apartment.glb"));
    assert.ok(allowed.files.includes("./assets/films/arrival.mp4"));
    assert.ok(
      allowed.files.every(
        (f) => !/[.]blend|onnx|private|tools\/|test_/.test(f),
      ),
    );
    checks++;
    const saved = await p.evaluate(() =>
      localStorage.getItem("lastarchive.sceneplay.v1"),
    );
    await p.setOfflineMode(true);
    await p.reload();
    await p.waitForSelector("#resume-game", { timeout: 90000 });
    await p.click("#resume-game");
    assert.equal(
      await p.evaluate(() => localStorage.getItem("lastarchive.sceneplay.v1")),
      saved,
    );
    await p.click("#pause");
    await p.click("#replay-intro");
    await p.waitForFunction(
      () => document.querySelector("#intro-film")?.currentTime > 0.2,
      { timeout: 30000 },
    );
    checks++;
    const range = await p.evaluate(async () => {
      const r = await fetch("assets/films/arrival.mp4", {
        headers: { Range: "bytes=0-1023" },
      });
      return {
        status: r.status,
        bytes: (await r.arrayBuffer()).byteLength,
        header: r.headers.get("Content-Range"),
      };
    });
    assert.equal(range.status, 206);
    assert.equal(range.bytes, 1024);
    assert.ok(range.header.startsWith("bytes 0-1023/"));
    checks++;
    assert.deepEqual(remote, []);
    assert.deepEqual(bad, []);
    checks++;
    console.log(
      `${checks} real cinematic playback/natural ending/transcript, local-only requests, save, cached world and offline-video checks passed.`,
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
