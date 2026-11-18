import { CONTENT as C } from "./content.js";
export const SAVE_KEY = "lastarchive.casework.v1";
export const blank = () => ({
  version: 1,
  edition: C.case.edition,
  started: false,
  intro: 0,
  chapter: 1,
  flags: [],
  observations: [],
  nextObservation: 1,
  findings: {},
  drafts: {},
  notes: "",
  chronology: [],
  theories: [],
  boardLayout: {},
  decisions: {},
  conversations: {},
  listened: [],
  visited: [],
  seenResponses: [],
  context: { mode: "scene", location: "apartment" },
  sound: { enabled: false, volume: 0.65, music: 0.16 },
  updated: null,
});
const str = (s, n = 5000) => (typeof s === "string" ? s.slice(0, n) : "");
export function clean(raw) {
  const s = blank();
  if (!raw || raw.version !== 1 || raw.edition !== C.case.edition) return s;
  s.started = raw.started === true;
  s.intro = Number.isInteger(raw.intro)
    ? Math.max(0, Math.min(C.intro.length, raw.intro))
    : 0;
  s.flags = Array.isArray(raw.flags)
    ? [
        ...new Set(
          raw.flags.filter((v) =>
            ["phone", "recovery", "original-message"].includes(v),
          ),
        ),
      ]
    : [];
  s.notes = str(raw.notes, 30000);
  const used = new Set();
  for (const o of Array.isArray(raw.observations) ? raw.observations : []) {
    const source = C.sources[o?.source];
    if (
      !source ||
      !/^o\d+$/.test(o.id) ||
      used.has(o.id) ||
      !source.choices[o.reading]
    )
      continue;
    const point =
      Array.isArray(o.point) &&
      o.point.length === 2 &&
      o.point.every((v) => Number.isFinite(v) && v >= 0 && v <= 1)
        ? o.point
        : null;
    if (["photo", "surveillance"].includes(source.kind) && !point) continue;
    used.add(o.id);
    s.observations.push({
      id: o.id,
      source: o.source,
      reading: o.reading,
      point,
      mode: o.mode === "text" ? "text" : "marked",
      note: str(o.note, 2500),
      ...(o.source === "hotel-camera" && Number.isInteger(o.frame) && o.frame >= 0 && o.frame <= 8
        ? { frame: o.frame }
        : {}),
    });
  }
  s.chronology = (Array.isArray(raw.chronology) ? raw.chronology : [])
    .slice(0, 100)
    .filter((v) => v && typeof v === "object")
    .map((v, i) => ({
      id: "event" + i,
      day: [17, 18, 19].includes(v.day) ? v.day : 18,
      time: /^([01]\d|2[0-3]):[0-5]\d$/.test(v.time) ? v.time : "",
      title: str(v.title, 300),
      uncertain: v.uncertain === true,
      source: used.has(v.source) ? v.source : "",
    }));
  s.nextObservation = Math.max(
    1,
    ...s.observations.map((o) => Number(o.id.slice(1)) + 1),
  );
  s.findings =
    raw.findings && typeof raw.findings === "object"
      ? Object.fromEntries(
          Object.entries(raw.findings).filter(
            ([id, v]) =>
              C.puzzles.some((p) => p.id === id) && v && typeof v === "object",
          ),
        )
      : {};
  s.drafts =
    raw.drafts && typeof raw.drafts === "object"
      ? Object.fromEntries(
          Object.entries(raw.drafts)
            .filter(
              ([id, v]) =>
                C.puzzles.some((p) => p.id === id) &&
                v &&
                typeof v === "object",
            )
            .map(([id, v]) => [id, JSON.parse(JSON.stringify(v))]),
        )
      : {};
  for (const [k, v] of Object.entries(raw.decisions || {}))
    if (["privacy", "approach"].includes(k) && typeof v === "string")
      s.decisions[k] = str(v, 50);
  s.theories = (Array.isArray(raw.theories) ? raw.theories : [])
    .filter((t) => t && typeof t === "object")
    .slice(0, 40)
    .map((t, i) => ({
      id: "t" + i,
      title: str(t.title, 160),
      note: str(t.note, 6000),
      status: ["open", "testing", "reconsidered", "supported"].includes(
        t.status,
      )
        ? t.status
        : "open",
      links: (Array.isArray(t.links) ? t.links : [])
        .filter(
          (l) =>
            l &&
            used.has(l.id) &&
            ["support", "challenge", "context"].includes(l.role),
        )
        .map((l) => ({ id: l.id, role: l.role })),
    }));
  // Board keys use stable observation ids and theory ordinal positions. Theory
  // ids are deliberately normalized during import; ordinal layout survives that.
  for (const [key, point] of Object.entries(raw.boardLayout || {})) {
    const valid = used.has(key) || (/^theory\d+$/.test(key) && Number(key.slice(6)) < s.theories.length);
    if (valid && Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))
      s.boardLayout[key] = [Math.max(12, Math.min(1100, point[0])), Math.max(12, Math.min(30000, point[1]))];
  }
  s.conversations =
    raw.conversations && typeof raw.conversations === "object"
      ? Object.fromEntries(
          Object.entries(raw.conversations)
            .filter(([k, v]) => C.interviews[k] && Array.isArray(v))
            .map(([k, v]) => [
              k,
              v.filter((x) => typeof x === "string").slice(0, 100),
            ]),
        )
      : {};
  s.listened = [
    ...new Set(
      (Array.isArray(raw.listened) ? raw.listened : []).filter(
        (id) => C.audio[id],
      ),
    ),
  ];
  s.visited = [
    ...new Set(
      (Array.isArray(raw.visited) ? raw.visited : []).filter(
        (id) => C.sources[id],
      ),
    ),
  ];
  s.sound = {
    enabled: raw.sound?.enabled === true,
    volume: Number.isFinite(raw.sound?.volume)
      ? Math.max(0, Math.min(1, raw.sound.volume))
      : 0.65,
    music: Number.isFinite(raw.sound?.music)
      ? Math.max(0, Math.min(0.4, raw.sound.music))
      : 0.16,
  };
  s.context.phoneSearch = str(raw.context?.phoneSearch, 160);
  s.context.calendarDay =
    Number.isInteger(raw.context?.calendarDay) &&
    raw.context.calendarDay >= 1 &&
    raw.context.calendarDay <= 31
      ? raw.context.calendarDay
      : 17;
  const routes = [
    "lock",
    "home",
    "messages",
    "thread",
    "camera",
    "contacts",
    "contact",
    "calls",
    "call",
    "mail",
    "email",
    "notes",
    "calendar",
    "browser",
    "page",
    "social",
    "recorder",
  ];
  if (routes.includes(raw.context?.phoneRoute)) {
    const route = raw.context.phoneRoute,
      arg = raw.context.phoneArgument;
    const valid =
      route === "thread"
        ? !!C.threads[arg]
        : route === "call"
          ? ["elena", "adrian", "julia"].includes(arg)
          : route === "contact"
            ? C.contacts.some((c) => c.id === arg)
            : route === "email"
              ? C.mail.some((m) => m.id === arg)
              : route === "page"
                ? Number.isInteger(arg) && !!C.browser[arg]
                : true;
    if (valid) {
      s.context.phoneRoute = route;
      s.context.phoneArgument = arg;
    }
  }
  s.seenResponses = (Array.isArray(raw.seenResponses) ? raw.seenResponses : [])
    .filter((x) => typeof x === "string")
    .slice(0, 100);
  s.updated = str(raw.updated, 100);
  return s;
}
let memory = null;
export let storageAvailable = true;
export function load() {
  try {
    return clean(JSON.parse(localStorage.getItem(SAVE_KEY)));
  } catch {
    return blank();
  }
}
export function persist(s) {
  s.updated = new Date().toISOString();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    storageAvailable = true;
  } catch {
    memory = JSON.stringify(s);
    storageAvailable = false;
    globalThis.dispatchEvent?.(new Event("storage-unavailable"));
  }
}
export function reset() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
  memory = null;
}
