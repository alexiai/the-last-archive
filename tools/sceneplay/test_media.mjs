import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
const root = new URL("../../sceneplay/", import.meta.url);
let checks = 0;
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");
const film = JSON.parse(
  fs.readFileSync(new URL("assets/films/manifest.json", root)),
);
assert.equal(film.duration, 44);
assert.equal(film.fps, 24);
assert.equal(film.frames, 1056);
assert.ok(film.distinctFrames > 1000);
assert.equal(film.videoCodec, "h264");
checks += 5;
assert.equal(
  hash(fs.readFileSync(new URL("assets/films/arrival.mp4", root))),
  film.fileSha256,
);
assert.equal(
  hash(fs.readFileSync(new URL("assets/models/apartment.glb", root))),
  film.geometrySha256,
);
assert.equal(
  hash(fs.readFileSync(new URL("src/world.js", root))),
  film.worldSourceSha256,
  "film and live world use the same procedural character, lighting and room",
);
checks += 3;
for (const name of ["before", "prepared", "scene", "window"]) {
  assert.ok(
    fs.statSync(new URL("assets/photos/" + name + ".jpg", root)).size > 10000,
  );
  checks++;
}
const runtime = JSON.parse(fs.readFileSync(new URL("game-build.json", root)));
for (const [name, sha] of Object.entries(runtime.sources)) {
  assert.equal(
    hash(fs.readFileSync(new URL(name, root))),
    sha,
    "offline bundle source is current",
  );
  checks++;
}
assert.equal(
  hash(fs.readFileSync(new URL("game.js", root))),
  runtime.bundleSha256,
);
checks++;
assert.ok(
  fs.readFileSync(new URL("vendor/LICENSE", root), "utf8").includes("MIT"),
);
checks++;
console.log(
  `${checks} animated-film, shared-world, photograph, vendored licence and offline-bundle integrity checks passed.`,
);
