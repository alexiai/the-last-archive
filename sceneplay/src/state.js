export const KEY = "lastarchive.sceneplay.v1";
export const fresh = () => ({
  edition: "sceneplay-1",
  version: 1,
  started: false,
  introSeen: false,
  position: "landing",
  phoneRoute: "home",
  phoneThread: null,
  phoneNote: null,
  phone: false,
  observations: [],
  visited: [],
  finding: false,
  claim: null,
  hint: 0,
  notebook: "",
  sound: true,
  reduced:
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  updated: null,
});
export function clean(raw) {
  const s = fresh();
  if (raw?.edition !== s.edition || raw.version !== 1) return s;
  for (const k of [
    "started",
    "introSeen",
    "phone",
    "finding",
    "sound",
    "reduced",
  ])
    if (typeof raw[k] === "boolean") s[k] = raw[k];
  if (
    [
      "landing",
      "threshold",
      "room",
      "table",
      "shelf",
      "phone",
      "window",
    ].includes(raw.position)
  )
    s.position = raw.position;
  if (
    [
      "home",
      "messages",
      "thread",
      "photos",
      "outbox",
      "voice",
      "contacts",
      "notes",
      "note",
    ].includes(raw.phoneRoute)
  )
    s.phoneRoute = raw.phoneRoute;
  if (["elena", "mara", "adrian"].includes(raw.phoneThread))
    s.phoneThread = raw.phoneThread;
  if (s.phoneRoute === "thread" && !s.phoneThread) s.phoneRoute = "messages";
  if (
    ["before-i-go", "message-unsent", "for-elena", "opening-words"].includes(
      raw.phoneNote,
    )
  )
    s.phoneNote = raw.phoneNote;
  if (s.phoneRoute === "note" && !s.phoneNote) s.phoneRoute = "notes";
  s.observations = Array.isArray(raw.observations)
    ? [
        ...new Set(
          raw.observations.filter((o) =>
            [
              "scene-gap",
              "scene-sofa",
              "past-sofa",
              "queued-shelf",
              "queued-sofa",
              "queued-time",
              "mug",
            ].includes(o),
          ),
        ),
      ]
    : [];
  s.visited = Array.isArray(raw.visited)
    ? [
        ...new Set(
          raw.visited.filter((v) => typeof v === "string" && v.length < 80),
        ),
      ]
    : [];
  s.hint = Math.max(0, Math.min(3, Number(raw.hint) || 0));
  s.notebook =
    typeof raw.notebook === "string" ? raw.notebook.slice(0, 12000) : "";
  s.claim = raw.claim === "bounded" ? "bounded" : null;
  if (
    s.claim !== "bounded" ||
    ![
      "scene-gap",
      "scene-sofa",
      "queued-sofa",
      "queued-shelf",
      "queued-time",
    ].every((x) => s.observations.includes(x))
  )
    s.finding = false;
  return s;
}
export let state = load();
function load() {
  try {
    return clean(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return fresh();
  }
}
export function save() {
  state.updated = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    window.dispatchEvent(new Event("save-unavailable"));
    return false;
  }
}
export function reset() {
  const { sound, reduced } = state;
  state = { ...fresh(), sound, reduced };
  state.started = true;
  save();
}
export function importSave(raw) {
  if (raw?.edition !== "sceneplay-1" || raw.version !== 1) return false;
  state = clean(raw);
  save();
  return true;
}
export function retain(id) {
  if (!state.observations.includes(id)) {
    state.observations.push(id);
    save();
    window.dispatchEvent(new CustomEvent("discovery", { detail: id }));
    return true;
  }
  return false;
}
export function testFinding(answer) {
  if (!["scene-gap", "scene-sofa"].every((x) => state.observations.includes(x)))
    return { ok: false, reason: "scene" };
  if (
    !["queued-shelf", "queued-sofa", "queued-time"].every((x) =>
      state.observations.includes(x),
    )
  )
    return { ok: false, reason: "original" };
  if (answer.change !== "shelf" || answer.source !== "queued")
    return { ok: false, reason: "comparison" };
  if (answer.layout !== "earlier") return { ok: false, reason: "comparison" };
  if (answer.limit !== "bounded") return { ok: false, reason: "bounded" };
  return { ok: true };
}
export function establish(answer) {
  const result = testFinding(answer);
  if (result.ok) {
    state.finding = true;
    state.claim = "bounded";
    save();
  }
  return result;
}
