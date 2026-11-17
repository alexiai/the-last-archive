import assert from "node:assert/strict";
const memory = new Map([
  ["lastarchive.v2", "preserve-original"],
  ["lastarchive.fieldwork.v1", "preserve-current"],
]);
globalThis.localStorage = {
  getItem: (k) => memory.get(k) || null,
  setItem: (k, v) => memory.set(k, v),
  removeItem: (k) => memory.delete(k),
};
const E = await import("../../casework/src/engine.js");
const { CONTENT: C } = await import("../../casework/src/content.js");
const { clean, SAVE_KEY } = await import("../../casework/src/state.js");
let checks = 0;
const check = (v, msg) => {
  assert.ok(v, msg);
  checks++;
};
E.newGame();
check(E.state.chapter === 1, "fresh chapter");
check(!E.solve("room", {}).ok, "no unsupported bypass");
check(
  !E.observe("room-prepared", "prepared", [0.5, 0.5]).ok,
  "unreleased original gated",
);
E.flag("phone");
for (const p of C.puzzles) {
  check(E.visible(p), "puzzle available in authored sequence");
  for (const source of p.sources)
    check(
      E.visible(C.sources[source]),
      "every required original is available at this investigative stage",
    );
  let answer;
  if (p.type === "evidence") {
    answer = { refs: {}, account: p.answer };
    for (const [key, [source, reading]] of Object.entries(p.slots)) {
      const s = C.sources[source];
      const result = E.observe(
        source,
        reading,
        ["photo", "surveillance"].includes(s.kind) ? [0.5, 0.5] : null,
        "",
        { mode: "text" },
      );
      check(result.ok, "source retain");
      answer.refs[key] = result.observation.id;
    }
    const bad = structuredClone(answer);
    bad.account = "unsupported";
    check(!E.solve(p.id, bad).ok, "incorrect interpretation rejected");
  } else if (p.type === "order") answer = { order: p.answer };
  else if (["code", "morse", "lock"].includes(p.type))
    answer = { value: p.answer };
  else if (p.type === "timing") {
    check(!E.solve(p.id, p.answer).ok, "camera requires retained frame");
    E.observe("hotel-camera", "crossing", [0.5, 0.5], "", { frame: 0 });
    check(!E.solve(p.id, p.answer).ok, "empty frame cannot support crossing");
    E.observe("hotel-camera", "crossing", [0.5, 0.5], "", { frame: 4 });
    answer = p.answer;
  } else if (p.type === "trace") answer = p.answer;
  else if (p.type === "plan") answer = { route: p.answer };
  else if (p.type === "audio") {
    check(
      !E.solve(p.id, { place: p.answer }).ok,
      "audio requires source inspection",
    );
    for (const id of ["reassurance", "apartment-reference", "hotel-reference"])
      E.soundInspected(id);
    answer = { place: p.answer };
  } else if (p.type === "alignment") {
    check(
      !E.solve(p.id, p.answer).ok,
      "listening comparison requires inspection",
    );
    E.soundInspected("original-reel");
    E.soundInspected("assembly");
    check(
      !E.solve(p.id, { ...p.answer, segments: ["0", "0", "0"] }).ok,
      "repeated wrong alignment rejected",
    );
    check(
      !E.solve(p.id, { ...p.answer, claim: "live" }).ok,
      "matching voice cannot certify live capture",
    );
    answer = p.answer;
  } else if (p.type === "case") answer = p.answer;
  else answer = { action: "present" };
  if (p.id === "room") {
    const o = E.state.observations.find((o) => o.id === answer.refs.current);
    o.mode = "marked";
    o.point = [0, 0];
    check(
      !E.diagnose(p, answer).ok,
      "unrelated photo region cannot support visual finding",
    );
    E.observe("scene-wide", "east", [0.5, 0.5], "", { mode: "text" });
    check(
      E.diagnose(p, answer).ok,
      "equivalent text alternative restores valid support without duplicate observation",
    );
  }
  check(E.solve(p.id, answer).ok, "supported authored comparison accepted");
  const before = JSON.stringify(E.state.findings);
  check(E.importGame(JSON.parse(memory.get(SAVE_KEY))), "own save reload");
  check(JSON.stringify(E.state.findings) === before, "proofs survive reload");
}
check(
  E.state.chapter === 9 && E.state.findings.confrontation,
  "all nine chapters complete",
);
check(
  memory.get("lastarchive.v2") === "preserve-original" &&
    memory.get("lastarchive.fieldwork.v1") === "preserve-current",
  "earlier saves untouched",
);
const legacy = structuredClone(E.state);
delete legacy.findings.accounts.answer.revision;
for (const key of ["vehicle", "purchase", "provider"])
  delete legacy.findings.accounts.answer.refs[key];
check(
  E.importGame(legacy) && E.state.chapter === 9,
  "expanded document comparison preserves genuine earlier preview proofs",
);
const expanded=C.puzzles.find(p=>p.id==='accounts');const expandedRefs=Object.fromEntries(Object.entries(expanded.slots).map(([key,[source,reading]])=>[key,E.state.observations.find(o=>o.source===source&&o.reading===reading).id]));check(E.solve('accounts',{refs:expandedRefs,account:expanded.answer}).ok&&E.state.findings.accounts.answer.revision===2&&E.state.chapter===9,'revisiting an expanded finding retains its new source citations without resetting progression');
const completed = structuredClone(E.state);
delete completed.findings.alignment;
check(
  E.importGame(completed) && E.state.chapter === 9,
  "new optional investigation does not roll back earlier preview saves",
);
check(
  E.availableLeads().some((p) => p.id === "alignment"),
  "earlier optional lead remains discoverable after progression",
);
const later=E.solve('alignment',C.puzzles.find(p=>p.id==='alignment').answer);check(later.ok&&!later.done&&E.state.chapter===9,'new optional finding after closure does not replay the ending or reset progress');
const before = JSON.stringify(E.state);
check(!E.importGame({ edition: "old" }), "foreign save rejected");
check(JSON.stringify(E.state) === before, "foreign save leaves state intact");
check(
  !E.importGame({ ...E.state, version: 999 }),
  "unsupported backup version rejected",
);
check(
  JSON.stringify(E.state) === before,
  "unsupported backup cannot erase the active investigation",
);
for (const privacy of ["sealed", "summary", "consented"]) {
  E.choices("privacy", privacy);
  check(
    clean(E.state).decisions.privacy === privacy,
    "privacy survives cleaning",
  );
}
check(
  clean({ ...E.state, theories: [null, 5, "bad", {}] }).theories.length === 1,
  "malformed theory entries ignored",
);
check(clean({}).chapter === 1, "malformed save reset safely");
console.log(
  `${checks} authored-logic checks passed. These are not blind playtesting or measured playtime.`,
);
