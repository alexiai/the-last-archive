/** Offline production only. The shipped game needs no browser automation. */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import crypto from "node:crypto";
const require = createRequire(import.meta.url),
  p = require("puppeteer-core");
const output = process.env.FRAME_DIR || "/workspace/work/sceneplay-frames";
fs.mkdirSync(output, { recursive: true });
const worldSha256 = crypto
  .createHash("sha256")
  .update(
    fs.readFileSync(new URL("../../sceneplay/src/world.js", import.meta.url)),
  )
  .digest("hex");
const sourceRecord = path.join(output, "frame-source.json");
if (
  fs.existsSync(sourceRecord) &&
  JSON.parse(fs.readFileSync(sourceRecord)).worldSha256 !== worldSha256
)
  throw Error(
    "The world changed. Capture to a new frame directory rather than mixing productions.",
  );
fs.writeFileSync(
  sourceRecord,
  JSON.stringify({ worldSha256, dimensions: [1280, 720] }, null, 2),
);
const b = await p.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
try {
  const page = await b.newPage();
  page.on("pageerror", (e) => {
    throw e;
  });
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto(
    process.env.CAPTURE_URL ||
      "http://localhost:8098/tools/sceneplay/capture.html",
  );
  await page.waitForFunction(() => window.ready, { timeout: 60000 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
  const root = new URL("../../sceneplay/", import.meta.url),
    regions = {};
  for (const [id, version, pos, look] of [
    ["before", "before", [2.8, 1.7, 2.6], [-0.1, 1.1, -1.1]],
    ["queued", "prepared", [2.8, 1.7, 2.6], [-0.1, 1.1, -1.1]],
    ["scene", "current", [2.8, 1.7, 2.6], [-0.1, 1.1, -1.1]],
    ["window", "before", [-1.4, 1.65, 1], [-3.4, 1.4, -1.3]],
  ]) {
    const result = await page.evaluate(
      async ({ version, pos, look }) => {
        const T = await import("three");
        g.setVersion(version);
        const data = g.photograph(version, pos, look);
        const shelf = new T.Vector3(1.44, 1.08, -3.02).project(g.camera);
        const s = new T.Box3()
          .setFromObject(g.sofa)
          .getCenter(new T.Vector3())
          .project(g.camera);
        return {
          data,
          region: {
            shelf: [(shelf.x + 1) / 2, (1 - shelf.y) / 2],
            sofa: [(s.x + 1) / 2, (1 - s.y) / 2],
          },
        };
      },
      { version, pos, look },
    );
    const name = id === "queued" ? "prepared" : id;
    fs.writeFileSync(
      new URL(`assets/photos/${name}.jpg`, root),
      Buffer.from(result.data.split(",")[1], "base64"),
    );
    regions[id] = result.region;
  }
  fs.writeFileSync(
    new URL("assets/photos/regions.json", root),
    JSON.stringify(regions, null, 2),
  );
  await page.evaluate(() => {
    g.setVersion("current");
    g.renderer.shadowMap.autoUpdate = false;
    g.renderer.shadowMap.needsUpdate = true;
  });
  const frames = Number(process.env.CAPTURE_FRAMES) || 44 * 24;
  const start = Number(process.env.CAPTURE_START) || 0;
  const end = Number(process.env.CAPTURE_END) || frames;
  if (start < 0 || start >= end || end > frames)
    throw Error("Invalid render range.");
  // The door opens in the preceding shot. Recreate that stage state when
  // producing a later shot independently rather than playing from frame zero.
  if (start >= 600) await page.evaluate(() => g.cinematic(24.999));
  for (let i = start; i < end; i++) {
    const name = path.join(output, `frame-${String(i).padStart(5, "0")}.jpg`);
    if (!fs.existsSync(name)) {
      const data = await page.evaluate((t) => {
        g.cinematic(t);
        return g.canvas.toDataURL("image/jpeg", 0.94);
      }, i / 24);
      fs.writeFileSync(name, Buffer.from(data.split(",")[1], "base64"));
    }
    if (i % 48 === 0) console.log(`Animated world frame ${i}/${frames}`, true);
  }
  console.log("Actual 3D motion capture complete.");
} finally {
  await b.close();
}
