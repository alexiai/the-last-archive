import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
let checks = 0;
const check = (value, reason) => {
  assert.ok(value, reason);
  checks++;
};
for (const removed of [
  "assets",
  "casework",
  "editions",
  "docs/rebuild",
  "docs/narrative-review",
  "docs/production-proposal",
  "tools/production",
  "tools/build_site.py",
  "game.js",
  "engine.js",
  "story.js",
  "style.css",
  "sw.js",
  "sceneplay/package.json",
  ".github/workflows/verify.yml",
  ".github/workflows/casework.yml",
  ".github/workflows/pages.yml",
]) {
  check(
    !fs.existsSync(path.join(root, removed)),
    `obsolete edition file must not return: ${removed}`,
  );
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json")));
check(
  pkg.type === "module" && pkg.private,
  "one private ESM package owns the current edition",
);
check(
  !pkg.devDependencies.jsdom &&
    pkg.devDependencies.esbuild === "0.25.12" &&
    pkg.devDependencies["puppeteer-core"],
  "only current build/browser development tools remain",
);
for (const script of Object.values(pkg.scripts)) {
  for (const [file] of script.matchAll(/tools\/[\w/.-]+\.(?:mjs|cjs|py)/g)) {
    check(
      fs.existsSync(path.join(root, file)),
      `package command must resolve: ${file}`,
    );
    check(
      file.startsWith("tools/sceneplay/"),
      `package command must use current tooling: ${file}`,
    );
  }
}
const bridge = fs.readFileSync(
  path.join(root, "tools/rebuild/build_preview.py"),
  "utf8",
);
check(
  fs
    .readdirSync(path.join(root, "tools/rebuild"))
    .filter((n) => n !== "__pycache__")
    .join() === "build_preview.py",
  "the approved publisher compatibility directory contains only its entrypoint",
);
check(
  bridge.length < 1500 && !/build_casework|test_engine/.test(bridge),
  "the publisher entrypoint does not retain an obsolete build",
);
check(
  /sceneplay\//.test(fs.readFileSync(path.join(root, "index.html"), "utf8")),
  "opening the source root reaches the current game",
);
const app = fs.readFileSync(path.join(root, "sceneplay/src/app.js"), "utf8");
check(
  !/previousEdition|casework-preview/.test(app),
  "current gameplay contains no retired edition links",
);
const exporter = fs.readFileSync(
  path.join(root, "tools/sceneplay/export_world.py"),
  "utf8",
);
check(
  exporter.includes("apartment_source.py") &&
    !exporter.includes("rebuild/render_world"),
  "the canonical scene has a current local production source",
);
for (const folder of ["sceneplay/src", "sceneplay/vendor"]) {
  const walk = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else if (file.endsWith(".js")) {
        for (const [, ref] of fs
          .readFileSync(file, "utf8")
          .matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) {
          if (ref.startsWith("."))
            check(
              fs.existsSync(path.resolve(path.dirname(file), ref)),
              `current runtime import must resolve: ${path.relative(root, file)} → ${ref}`,
            );
        }
      }
    }
  };
  walk(path.join(root, folder));
}
for (const file of [
  "sceneplay/ASSET-LICENSES.md",
  "sceneplay/vendor/LICENSE",
  "docs/sceneplay/PROVENANCE.md",
  "docs/sceneplay/private/CASE_FOUNDATION.md",
]) {
  check(
    fs.statSync(path.join(root, file)).size > 100,
    `retain current provenance/source: ${file}`,
  );
}
console.log(
  `${checks} current-edition repository, dependency, entrypoint and provenance checks passed.`,
);
