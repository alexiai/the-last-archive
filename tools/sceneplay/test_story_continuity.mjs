import assert from "node:assert/strict";
import fs from "node:fs";
import { STORY } from "../../sceneplay/src/story.js";

globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const S = await import("../../sceneplay/src/state.js");
const root = new URL("../../", import.meta.url);
let checks = 0;
const check = (value, message) => {
  assert.ok(value, message);
  checks++;
};

const rows = STORY.phone.messages.flatMap((thread) => thread.rows);
check(rows.length === 15, "the authored phone contains fifteen message rows");
check(
  STORY.phone.notes.length === 4,
  "four retained draft/deleted note originals",
);
check(
  new Set(STORY.phone.notes.map((note) => note.id)).size === 4,
  "note originals have unique stable identities",
);
check(
  STORY.phone.notes.every((note) => ["draft", "deleted"].includes(note.status)),
  "recovery status stays distinct from note creation",
);
check(
  STORY.phone.notes.every((note) => note.title && note.date && note.body),
  "each note retains original wording and creation field",
);
check(
  STORY.phone.notes.every(
    (note) => !/Julia|bookend|W-12|T-0416|01:22|01:48/i.test(note.body),
  ),
  "early personal notes do not release late consequential sources",
);
check(
  rows.every((row) => row.length === 3 && row[0].startsWith("17 OCT")),
  "added opening messages remain in the established pre-event day",
);

const mara = STORY.phone.messages.find((thread) => thread.id === "mara");
check(
  mara.rows.filter((row) => row[2].startsWith("[Attachment")).length === 1,
  "the original queued attachment is not duplicated or hidden behind a new thread",
);
check(
  mara.rows.at(-1)[0] === "17 OCT · 19:06",
  "the queued source keeps its fixed contemporaneous field",
);
check(
  STORY.phone.queued.date === "17 October 2025 · 19:06",
  "the independent image capture is unchanged",
);

for (const thread of STORY.phone.messages) {
  const restored = S.clean({
    ...S.fresh(),
    phone: true,
    phoneRoute: "thread",
    phoneThread: thread.id,
  });
  check(
    restored.phoneRoute === "thread" && restored.phoneThread === thread.id,
    "each actual conversation can be restored without a different thread appearing",
  );
}
for (const note of STORY.phone.notes) {
  const restored = S.clean({
    ...S.fresh(),
    phone: true,
    phoneRoute: "note",
    phoneNote: note.id,
  });
  check(
    restored.phoneRoute === "note" && restored.phoneNote === note.id,
    "each original note context survives save reconstruction",
  );
  check(
    !restored.finding && restored.observations.length === 0,
    "reading a personal note does not silently establish an investigative conclusion",
  );
}
check(
  S.clean({ ...S.fresh(), phoneRoute: "note", phoneNote: "foreign-note" })
    .phoneRoute === "notes",
  "unknown note contexts fall back to the retained list",
);
check(
  S.clean({ ...S.fresh(), phoneRoute: "thread", phoneThread: "foreign-thread" })
    .phoneRoute === "messages",
  "unknown conversations cannot appear after restore",
);

const matrix = fs
  .readFileSync(
    new URL("docs/sceneplay/private/EVIDENCE_MATRIX.tsv", root),
    "utf8",
  )
  .trimEnd()
  .split("\n")
  .map((row) => row.split("\t"));
const header = matrix.shift();
check(
  matrix.length >= 20,
  "the source ledger covers the case beyond the opening",
);
check(
  matrix.every((row) => row.length === header.length),
  "every source keeps all origin, release, limit and payoff fields",
);
check(
  new Set(matrix.map((row) => row[0])).size === matrix.length,
  "matrix source identities do not collide",
);
const clinical = matrix.find((row) => row[0] === "clinical");
check(
  clinical[header.indexOf("first_scene")] === "7",
  "consequential clinical findings remain a later release",
);
check(
  /Cannot identify speaker\/user, certify exact minute/.test(
    clinical[header.indexOf("limits")],
  ),
  "clinical limits prohibit a death-clock or speaker-detector shortcut",
);

const graph = fs.readFileSync(
  new URL("docs/sceneplay/private/PLAYER_FLOW.twee", root),
  "utf8",
);
const passages = [...graph.matchAll(/^:: ([^\[\n]+)(?:\[.*\])?$/gm)].map(
  (match) => match[1].trim(),
);
const links = [...graph.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) =>
  match[1].split("->").at(-1),
);
check(
  new Set(passages).size === passages.length,
  "Twine authoring passages have stable unique names",
);
check(
  links.every((link) => passages.includes(link)),
  "the free authoring map has no dangling scene transitions",
);
for (const id of [
  "Journey",
  "Aurelia",
  "Archive",
  "Workshop",
  "Accounts",
  "Return Room",
  "Preparation",
  "Closure",
])
  check(
    graph.includes(`:: ${id} [planned]`),
    "unimplemented scene passages remain explicitly marked planned",
  );

console.log(
  `${checks} authored phone, save-context and private continuity-map checks passed. Not blind playtesting or clinical review.`,
);
