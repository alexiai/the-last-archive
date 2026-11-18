import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
const memory = new Map([
  ["lastarchive.casework.v1", "keep-casework"],
  ["lastarchive.fieldwork.v1", "keep-fieldwork"],
]);
globalThis.localStorage = {
  getItem: (k) => memory.get(k) || null,
  setItem: (k, v) => memory.set(k, v),
};
globalThis.window = new EventTarget();
const S = await import("../../sceneplay/src/state.js"),
  { STORY } = await import("../../sceneplay/src/story.js");
let checks = 0;
const ok = (value, message) => {
  assert.ok(value, message);
  checks++;
};
S.reset();
ok(S.KEY !== "lastarchive.casework.v1", "new edition has its own save");
ok(!S.state.finding, "fresh game is not solved");
S.state.sound = false;
S.state.reduced = true;
S.reset();
ok(
  !S.state.sound && S.state.reduced,
  "New Game keeps audio and motion preferences",
);
const proof = [
  "scene-gap",
  "scene-sofa",
  "queued-shelf",
  "queued-sofa",
  "queued-time",
];
const correct = {
  change: "shelf",
  source: "queued",
  layout: "earlier",
  limit: "bounded",
};
for (const id of proof) S.retain(id);
ok(
  !S.state.finding,
  "retaining evidence does not automatically confirm an interpretation",
);
let accepted = 0;
for (const change of ["shelf", "glass", "sofa"])
  for (const source of ["before", "queued", "room"])
    for (const layout of ["later", "earlier", "unchanged"])
      for (const limit of ["time", "bounded", "identity"]) {
        const result = S.testFinding({ change, source, layout, limit });
        if (result.ok) accepted++;
        checks++;
      }
ok(accepted === 1, "only the authored coherent comparison is supported");
for (const id of proof) {
  const current = [...S.state.observations];
  S.state.observations = current.filter((o) => o !== id);
  ok(!S.testFinding(correct).ok, "each independent observation is required");
  S.state.observations = current;
}
ok(S.establish(correct).ok, "authored finding can be established");
ok(S.clean(S.state).finding, "finding survives save reconstruction");
const bad = { ...S.state, claim: null };
ok(
  !S.clean(bad).finding,
  "a claimed closure without the bounded interpretation is not restored",
);
const before = JSON.stringify(S.state);
ok(
  !S.importSave({ edition: "casework-1", version: 1 }),
  "foreign save rejected",
);
ok(
  JSON.stringify(S.state) === before,
  "foreign save leaves current game intact",
);
for (const [key, value] of [
  ["lastarchive.casework.v1", "keep-casework"],
  ["lastarchive.fieldwork.v1", "keep-fieldwork"],
])
  ok(memory.get(key) === value, "earlier edition saves preserved");
const notes = "My tentative interpretation is mine.";
S.state.notebook = notes;
S.save();
ok(S.clean(S.state).notebook === notes, "personal notes survive");
const audio = JSON.parse(
  fs.readFileSync(
    new URL("../../sceneplay/assets/audio/manifest.json", import.meta.url),
  ),
);
for (const [id, line] of [
  ...STORY.intro.map((l, i) => ["intro-" + i, l]),
  ...Object.entries(STORY.dialogue),
]) {
  ok(
    audio[id].text === line.text,
    "finished voice matches actual player dialogue",
  );
  const file = fs.readFileSync(
    new URL("../../sceneplay/" + audio[id].file, import.meta.url),
  );
  ok(
    crypto.createHash("sha256").update(file).digest("hex") === audio[id].sha256,
    "finished recording integrity",
  );
}
const regions = JSON.parse(
  fs.readFileSync(
    new URL("../../sceneplay/assets/photos/regions.json", import.meta.url),
  ),
);
for (const name of ["before", "queued", "scene"]) {
  ok(
    regions[name].shelf.every((v) => v >= 0 && v <= 1),
    "source mark projects inside its actual photograph",
  );
  ok(
    regions[name].sofa.every((v) => v >= 0 && v <= 1),
    "sofa projects inside its actual photograph",
  );
}
console.log(
  `${checks} scene-led story, deduction, source integrity and separate-save checks passed. Not blind playtesting.`,
);
