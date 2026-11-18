/* Exercise the actual earlier production worker against the combined artifact. */
const fs = require("node:fs"),
  path = require("node:path"),
  http = require("node:http"),
  assert = require("node:assert/strict"),
  { execFileSync } = require("node:child_process"),
  pptr = require("puppeteer-core");
(async () => {
  const build = process.env.COMBINED_BUILD;
  if (!build) throw Error("Supply COMBINED_BUILD.");
  const old = execFileSync("git", ["show", "origin/main:sw.js"], {
      encoding: "utf8",
    }),
    next = fs.readFileSync(path.join(build, "sw.js"), "utf8"),
    stable = fs.readFileSync(path.join(build, "index.html"), "utf8");
  let upgraded = false;
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".glb": "model/gltf-binary",
  };
  const server = http.createServer((req, res) => {
    const name = new URL(req.url, "http://test").pathname;
    res.setHeader("Cache-Control", "no-store");
    if (name === "/sw.js") {
      res.setHeader("Content-Type", "text/javascript");
      return res.end(upgraded ? next : old);
    }
    if (name === "/driver.html")
      return res.end("<!doctype html><title>Isolation fixture</title>");
    const file = path.resolve(
      build,
      "." + (name.endsWith("/") ? name + "index.html" : name),
    );
    if (!file.startsWith(path.resolve(build) + path.sep))
      return res.writeHead(403).end();
    fs.readFile(file, (e, bytes) => {
      if (e) return res.writeHead(404).end();
      res.setHeader(
        "Content-Type",
        types[path.extname(file)] || "application/octet-stream",
      );
      res.end(bytes);
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = "http://127.0.0.1:" + server.address().port;
  const b = await pptr.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  try {
    const p = await b.newPage();
    await p.goto(base + "/driver.html");
    await p.evaluate(async (stable) => {
      await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const scope = location.origin + "/",
        prefix = "lastarchive-" + encodeURIComponent(scope) + "-";
      await (
        await caches.open(prefix + "test-production")
      ).put(
        scope + "index.html",
        new Response(stable, { headers: { "Content-Type": "text/html" } }),
      );
      await (
        await caches.open(prefix + "metadata")
      ).put(
        scope + "__offline_status__",
        new Response(
          JSON.stringify({
            version: "test-production",
            files: 1,
            bytes: stable.length,
          }),
        ),
      );
      localStorage.setItem("lastarchive.fieldwork.v1", "production-save-kept");
    }, stable);
    await p.waitForFunction(() => navigator.serviceWorker.controller);
    let block = true;
    await p.setRequestInterception(true);
    p.on("request", (r) =>
      block && r.resourceType() === "script" ? r.abort() : r.continue(),
    );
    await p.goto(base + "/preview/");
    assert.ok(
      await p.$("#masthead"),
      "old root-worker navigation conflict reproduced",
    );
    block = false;
    await p.goto(base + "/editions/casework-preview/");
    await p.waitForSelector("#begin");
    await p.click("#begin");
    for (let i = 0; i < 3; i++) await p.click("#continue");
    const olderSave = await p.evaluate(() =>
      localStorage.getItem("lastarchive.casework.v1"),
    );
    assert.ok(await p.$("#casebook"));
    await p.goto(base + "/editions/sceneplay-preview/");
    await p.waitForSelector("#new-game", { timeout: 90000 });
    await p.click("#new-game");
    await p.click("#skip-intro");
    await p.click('[data-dialogue-choice="0"]');
    const sceneSave = await p.evaluate(() =>
      localStorage.getItem("lastarchive.sceneplay.v1"),
    );
    assert.equal(
      await p.evaluate(() => localStorage.getItem("lastarchive.casework.v1")),
      olderSave,
    );
    upgraded = true;
    await p.evaluate(async () => {
      const r = await navigator.serviceWorker.getRegistration(
        location.origin + "/",
      );
      await r.update();
      const w = r.installing || r.waiting;
      if (w && w.state !== "activated")
        await new Promise((resolve) =>
          w.addEventListener("statechange", () => {
            if (w.state === "activated") resolve();
          }),
        );
    });
    await p.goto(base + "/preview/");
    await p.waitForSelector("#resume-game", { timeout: 90000 });
    assert.equal(
      await p.evaluate(() => localStorage.getItem("lastarchive.sceneplay.v1")),
      sceneSave,
    );
    assert.equal(
      await p.evaluate(() => localStorage.getItem("lastarchive.casework.v1")),
      olderSave,
    );
    assert.equal(
      await p.evaluate(() => localStorage.getItem("lastarchive.fieldwork.v1")),
      "production-save-kept",
    );
    assert.equal(
      await p.evaluate(async () => await (await fetch("/index.html")).text()),
      stable,
    );
    console.log(
      "Production worker/fallback, preserved root and casework edition/save, and separate shared scene-led save verified.",
    );
  } finally {
    await b.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
