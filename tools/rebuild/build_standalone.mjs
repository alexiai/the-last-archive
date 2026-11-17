/** Self-contained review build. Static web build remains the production format. */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const esbuild = require(process.env.ESBUILD_PATH || "esbuild");
const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  ),
  src = path.join(root, "casework");
const output = process.argv[2];
if (!output) throw Error("Supply a new output HTML path.");
const assets = {};
const types = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".json": "application/json",
};
function walk(dir) {
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = path.join(dir, file.name);
    if (file.isDirectory()) walk(name);
    else if (types[path.extname(name)])
      assets[path.relative(src, name).split(path.sep).join("/")] =
        "data:" +
        types[path.extname(name)] +
        ";base64," +
        fs.readFileSync(name).toString("base64");
  }
}
walk(path.join(src, "assets"));
let css = ["game.css", "phone.css", "evidence.css"]
  .map((file) => fs.readFileSync(path.join(src, "styles", file), "utf8"))
  .join("\n");
css = css.replace(/url\(['"]?\.\.\/(assets\/[^'"\)]+)['"]?\)/g, (_, file) => {
  if (!assets[file]) throw Error("Missing background asset: " + file);
  return `url('${assets[file]}')`;
});
const result = await esbuild.build({
  entryPoints: [path.join(src, "src/app.js")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["safari16.4", "chrome110"],
  write: false,
  minify: true,
  legalComments: "inline",
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const html =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#131d19"><title>The Last Archive — Casework development edition</title><style>' +
  css +
  '</style></head><body><main id="game"></main><div id="announcement" class="sr-only" role="status"></div><script>globalThis.CASEWORK_ASSETS=' +
  JSON.stringify(assets) +
  ";</script><script>" +
  js +
  "</script></body></html>";
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, html);
console.log(
  JSON.stringify({
    output,
    bytes: Buffer.byteLength(html),
    embeddedFinishedAssets: Object.keys(assets).length,
    modelsIncluded: false,
  }),
);
