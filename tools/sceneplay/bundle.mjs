import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url),
  esbuild = require(process.env.ESBUILD_PATH || "esbuild"),
  root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  src = path.join(root, "sceneplay"),
  output = process.argv[2];
if (!output) throw Error("Supply a bundle output path.");
await esbuild.build({
  entryPoints: [path.join(src, "src/app.js")],
  outfile: output,
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["safari15.4", "chrome110"],
  alias: { three: path.join(src, "vendor/three.module.js") },
  legalComments: "inline",
});
const sources = {};
function walk(dir) {
  for (const row of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = path.join(dir, row.name);
    if (row.isDirectory()) walk(name);
    else if (name.endsWith(".js"))
      sources[path.relative(src, name).split(path.sep).join("/")] = crypto
        .createHash("sha256")
        .update(fs.readFileSync(name))
        .digest("hex");
  }
}
walk(path.join(src, "src"));
walk(path.join(src, "vendor"));
fs.writeFileSync(
  path.join(path.dirname(output), "game-build.json"),
  JSON.stringify(
    {
      compiler: "esbuild 0.25.12",
      target: "Safari 15.4 / Chrome 110",
      sources,
      bundleSha256: crypto
        .createHash("sha256")
        .update(fs.readFileSync(output))
        .digest("hex"),
    },
    null,
    2,
  ),
);
