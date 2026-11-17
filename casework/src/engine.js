import { GEOMETRY } from "./geometry.js";
import { CONTENT as C } from "./content.js";
import { load, persist, blank, clean, reset } from "./state.js";
export let state = load();
export const save = () => persist(state);
export function has(flag) {
  return state.flags.includes(flag) || !!state.findings[flag];
}
export function visible(item) {
  return (
    !!item &&
    (item.chapter || 1) <= state.chapter &&
    (!item.need || has(item.need))
  );
}
export function flag(id) {
  if (!["phone", "recovery", "original-message"].includes(id)) return;
  if (!has(id)) {
    state.flags.push(id);
    save();
  }
}
export function observe(
  sourceId,
  reading = "text",
  point = null,
  note = "",
  extra = {},
) {
  const source = C.sources[sourceId];
  if (!visible(source) || !source.choices[reading])
    return { ok: false, message: "That source detail is not available." };
  if (
    ["photo", "surveillance"].includes(source.kind) &&
    (!Array.isArray(point) ||
      point.length !== 2 ||
      !point.every((v) => Number.isFinite(v) && v >= 0 && v <= 1))
  )
    return {
      ok: false,
      message:
        "Mark a point in the source image, or use an equivalent text location, before retaining an observation.",
    };
  const existing = state.observations.find(
    (o) =>
      o.source === sourceId &&
      o.reading === reading &&
      (sourceId !== "hotel-camera" || o.frame === extra.frame),
  );
  if (existing) {
    existing.point = point;
    existing.note = String(note).slice(0, 2500);
    existing.mode = extra.mode === "text" ? "text" : "marked";
    save();
    return {
      ok: true,
      observation: existing,
      message: "The retained detail and source mark have been updated.",
    };
  }
  const o = {
    id: "o" + state.nextObservation++,
    source: sourceId,
    reading,
    point,
    mode: extra.mode === "text" ? "text" : "marked",
    note: String(note).slice(0, 2500),
    ...(sourceId === "hotel-camera" ? { frame: extra.frame } : {}),
  };
  state.observations.push(o);
  save();
  return {
    ok: true,
    observation: o,
    message:
      "Observation retained with its original source. Its interpretation remains yours.",
  };
}
export function inspected(id) {
  if (C.sources[id] && !state.visited.includes(id)) {
    state.visited.push(id);
    save();
  }
}
export function soundInspected(id) {
  if (C.audio[id] && !state.listened.includes(id)) {
    state.listened.push(id);
    save();
  }
}
export function draft(id, key, value) {
  if (!C.puzzles.some((p) => p.id === id)) return;
  state.drafts[id] ??= {};
  state.drafts[id][key] = value;
  save();
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export function photoSupports(o) {
  if (o.mode === "text") return true;
  const targets = {
    "scene-wide": ["sofa"],
    "room-before": ["sofa"],
    "scene-table": ["table"],
    "scene-shelf": ["shelf"],
    "shelf-before": ["shelf"],
    "room-prepared": ["sofa", "shelf"],
  };
  const keys = targets[o.source];
  if (!keys) return true;
  return (
    !!o.point &&
    keys.some((key) => {
      const p = GEOMETRY[C.sources[o.source].image]?.[key];
      return p && Math.hypot(o.point[0] - p[0], o.point[1] - p[1]) < 0.2;
    })
  );
}
export function diagnose(p, answer, s = state) {
  const fail = (message) => ({ ok: false, message });
  if (!p || !answer || typeof answer !== "object")
    return fail("Build an account from the available sources first.");
  if (
    p.chapter > s.chapter ||
    (p.need && !((s.flags || []).includes(p.need) || s.findings[p.need]))
  )
    return fail("Follow the available lead before attempting this comparison.");
  if (p.id === "room" && !s.flags.includes("phone"))
    return fail(
      "Recover the authorised phone copy before comparing its originals.",
    );
  if (p.type === "evidence") {
    for (const [key, [source, reading]] of Object.entries(p.slots)) {
      const o = s.observations.find((o) => o.id === answer.refs?.[key]);
      if (
        o &&
        o.source === source &&
        o.reading === reading &&
        !photoSupports(o)
      )
        return fail(
          "The marked area does not contain the cited feature. Reopen the original and mark the relevant detail, or use its equivalent text location.",
        );
      if (!o || o.source !== source || o.reading !== reading)
        return fail(
          "A cited detail does not support this part of the account. Return to its original source and check the actual wording or visible feature.",
        );
    }
    if (answer.account !== p.answer)
      return fail(
        "That interpretation exceeds or contradicts the sources you cited. Keep the observations; reconsider the account.",
      );
  }
  if (p.type === "order" && !same(answer.order, p.answer))
    return fail(
      "The sequence does not agree with the independently recorded events. Check the source fields rather than the order the records were delivered.",
    );
  if (
    ["code", "morse", "lock"].includes(p.type) &&
    String(answer.value || "")
      .trim()
      .toUpperCase() !== p.answer
  )
    return fail(
      p.type === "lock"
        ? "The mechanism does not release. Recheck each coordinate and the recorded pulse groups; the original case remains unchanged."
        : "That reference does not match the original source. Reinspect the reference and use the optional hints if useful.",
    );
  if (p.type === "timing") {
    if (
      !s.observations.some(
        (o) =>
          o.source === "hotel-camera" &&
          o.reading === "crossing" &&
          o.frame === 4,
      )
    )
      return fail(
        "Retain an occupied crossing frame before using the timing record.",
      );
    if (
      !same(
        { time: answer.time, gap: answer.gap, claim: answer.claim },
        p.answer,
      )
    )
      return fail(
        "Check the recorder correction, the independent arrival and the limit of the inference. A compatible interval is not an identification.",
      );
  }
  if (
    p.type === "trace" &&
    (answer.sample !== "C" || answer.claim !== "delivery")
  )
    return fail(
      "Compare the bar angle and the worn corner. Use the receiving record for context; a tread does not identify its wearer.",
    );
  if (p.type === "plan" && !same(answer.route, p.answer))
    return fail(
      "The selected route does not stay within the completed openings behind the camera sector. Trace connected places in travel order.",
    );
  if (p.type === "audio") {
    if (
      !["reassurance", "apartment-reference", "hotel-reference"].every((id) =>
        s.listened.includes(id),
      )
    )
      return fail(
        "Inspect all three sound sources, by listening or using their equivalent sound observations, before comparing them.",
      );
    if (answer.place !== p.answer)
      return fail(
        "The background pattern does not match that location reference. Compare the recurring rhythm, not just the voice.",
      );
  }
  if (
    p.type === "case" &&
    !Object.entries(p.answer).every(([k, v]) => answer[k] === v)
  )
    return fail(
      "At least one consequential claim is not supported by the independent sources. Keep attribution, timing, physical findings and permission separate.",
    );
  if (
    p.type === "confront" &&
    (!s.findings.case || answer.action !== "present")
  )
    return fail(
      "The confrontation requires an already supported case. It cannot supply a missing proof.",
    );
  return {
    ok: true,
    message:
      "The cited comparison supports this finding within its stated limits.",
  };
}
export function solve(id, answer) {
  const p = C.puzzles.find((p) => p.id === id),
    result = diagnose(p, answer);
  if (!result.ok) return result;
  const earlier = state.chapter;
  if (!state.findings[id]) {
    state.findings[id] = {
      answer: JSON.parse(JSON.stringify(answer)),
      at: new Date().toISOString(),
    };
    if (p.grant && !state.flags.includes(p.grant)) state.flags.push(p.grant);
  }
  advance();
  save();
  return {
    ...result,
    chapterChanged: earlier !== state.chapter,
    chapter: state.chapter,
    done: !!state.findings.confrontation,
  };
}
function advance() {
  while (
    state.chapter < C.chapters.length &&
    C.chapters[state.chapter - 1].requires.every((id) => state.findings[id])
  )
    state.chapter++;
}
export function resumeProofs() {
  const claimed = { ...state.findings };
  state.findings = {};
  state.flags = state.flags.filter((f) => f === "phone");
  state.chapter = 1;
  for (let i = 0; i < C.chapters.length + 1; i++) {
    let changed = false;
    for (const p of C.puzzles) {
      const saved = claimed[p.id];
      if (
        saved &&
        !state.findings[p.id] &&
        diagnose(p, saved.answer, state).ok
      ) {
        state.findings[p.id] = saved;
        if (p.grant && !state.flags.includes(p.grant))
          state.flags.push(p.grant);
        advance();
        changed = true;
      }
    }
    if (!changed) break;
  }
}
resumeProofs();
export function newGame() {
  reset();
  state = blank();
  state.started = true;
  save();
}
export function importGame(raw) {
  if (!raw || raw.version !== 1 || raw.edition !== C.case.edition) return false;
  const candidate = clean(raw);
  state = candidate;
  resumeProofs();
  save();
  return true;
}
export function choices(id, value) {
  if (id === "privacy" && !["sealed", "summary", "consented"].includes(value))
    return;
  state.decisions[id] = value;
  save();
}
export function rememberTalk(person, node) {
  state.conversations[person] ??= [];
  if (!state.conversations[person].includes(node))
    state.conversations[person].push(node);
  save();
}
export function availableLeads() {
  return C.puzzles.filter(
    (p) =>
      p.chapter === state.chapter &&
      (!p.need || has(p.need)) &&
      !state.findings[p.id],
  );
}
export function addTheory(title, note) {
  const t = {
    id: "t" + Date.now(),
    title: String(title).slice(0, 160),
    note: String(note).slice(0, 6000),
    status: "open",
    links: [],
  };
  state.theories.push(t);
  save();
  return t;
}
