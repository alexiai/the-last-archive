/* Presentation layer. Narrative, puzzle validation, chapter gates and save schema remain authoritative in STORY and E. */
const ICONS = {
  msg: '<path d="M4 4h16v12H9l-5 4z"/><path d="M8 8h8M8 12h6"/>',
  con: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>',
  call: '<path d="M6 3l4 5-3 3a16 16 0 0 0 6 6l3-3 5 4-2 3C10 23 1 14 3 5z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/>',
  gal: '<rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8" cy="8" r="2"/><path d="M3 18l6-6 4 4 3-5 5 7"/>',
  note: '<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
  ev: '<rect x="2" y="3" width="20" height="18"/><path d="M7 8l5 8 5-9M7 8l10-1"/><circle cx="7" cy="8" r="1.5"/><circle cx="12" cy="16" r="1.5"/><circle cx="17" cy="7" r="1.5"/>',
  map: '<path d="M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
  int: '<path d="M3 4h13v10H8l-5 4zM10 18h6l5 3V10h-3"/>',
  pz: '<path d="M9 3h6v5h5v6h-5v7H9v-7H3V8h6z"/>',
  cal: '<rect x="3" y="5" width="18" height="16"/><path d="M7 2v6M17 2v6M3 11h18M7 15h3M14 15h3"/>',
  file: '<path d="M4 3h10l6 6v12H4zM14 3v6h6M8 13h8M8 17h6"/>',
  web: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
  soc: '<circle cx="12" cy="12" r="9"/><path d="M8 13c0-5 8-5 8 0M9 16h6"/><circle cx="9" cy="8" r="1"/><circle cx="15" cy="8" r="1"/>',
  aud: '<path d="M4 16v-5a8 8 0 0 1 16 0v5M4 13H2v7h5v-7zM20 13h2v7h-5v-7z"/>',
  vault:
    '<rect x="4" y="9" width="16" height="12"/><path d="M8 9V6a4 4 0 0 1 8 0v3M12 13v4"/>',
  nb: '<path d="M3 3h16v18H3zM7 3v18M10 7h6M10 11h6M10 15h4M1 7h4M1 12h4M1 17h4"/>',
};
const icon = (id) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id] || ICONS.file}</svg>`;
let toastTimer;
function toast(t) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}
function syncCase() {
  const n = E.chapter(),
    c = STORY.chapters[n - 1];
  $("#chapter-num").textContent = String(n).padStart(2, "0");
  $("#case-title").textContent = c.title;
  $("#case-goal").textContent = c.goal;
  $("#evcount").textContent = String(S.ev.length).padStart(2, "0");
  $("#stat-ev").textContent = S.ev.length;
  $("#stat-links").textContent = S.made.length;
  $("#stat-pz").textContent = S.solved.length;
  $("#save-state").textContent =
    E.saveOk && Store.ok ? "Saved locally" : "Saving unavailable";
}
function view(v) {
  if (v !== "puzzle") delete scr.dataset.puzzle;
  document.body.dataset.view = v;
  document
    .querySelectorAll("[data-nav]")
    .forEach((el) => el.classList.toggle("active", el.dataset.nav === v));
  scr.scrollTop = 0;
  syncCase();
}
const archiveTake = E.take,
  archiveSolve = E.solve;
E.take = function (id) {
  const had = S.ev.includes(id),
    ch = E.chapter();
  archiveTake(id);
  if (!had && S.ev.includes(id)) {
    syncCase();
    toast("Evidence archived · " + id);
    if (E.chapter() > ch) chapterTransition(E.chapter());
  }
};
E.solve = function (id, a) {
  const ch = E.chapter(),
    ok = archiveSolve(id, a);
  if (ok) {
    syncCase();
    toast("Reasoning supported · investigation updated");
    if (E.chapter() > ch) chapterTransition(E.chapter());
  }
  return ok;
};
function chapterTransition(n) {
  const c = STORY.chapters[n - 1];
  toast("Chapter " + String(n).padStart(2, "0") + " unlocked · " + c.title);
  if (typeof event !== "undefined" && event && event.isTrusted) {
    const d = $("#chapter-dialog");
    d.innerHTML = `<div class="eyebrow">ARCHIVE EXPANDED / ${String(n).padStart(2, "0")}</div><h2>${esc(c.title)}</h2><p>${esc(c.goal)}</p><button class="btn red" onclick="document.querySelector('#chapter-dialog').close();home()">Continue investigation →</button>`;
    if (d.showModal) d.showModal();
  }
}
function lock() {
  view("lock");
  scr.innerHTML = `<div class="lock"><div class="eyebrow">RECOVERED DEVICE / IRIS VASILESCU</div><div class="big">02:14</div><div class="eyebrow">SUNDAY, 19 OCTOBER</div><h1 class="lock-title">The last<br><em>archive.</em></h1><button class="notif" onclick="S.unlocked=true;E.save();thread('moth')"><b>MOTH <span style="float:right">NOW</span></b><p>You do this for a living.<br>Iris's backup is attached.</p><small>Open the message to begin ↗</small></button><div class="lock-foot">A LIFE LEFT BEHIND. A STORY STILL OPEN.<br>Headphones recommended · Progress saves locally</div></div>`;
}
function appTile([id, n, on]) {
  return `<button ${on === 0 ? "disabled" : `onclick="open_('${id}')"`} class="${on === 0 ? "dis" : ""}" aria-label="${n}"><div class="ic ${id === "ev" && S.ev.length ? "on" : ""}">${icon(id)}</div>${n}</button>`;
}
function home() {
  view("home");
  const apps = STORY.apps.filter((a) => E.vis({ ch: a[3] }));
  scr.innerHTML = `<div class="home-identity"><div><div class="eyebrow">IRIS VASILESCU</div><h1>Her world.<br>Your investigation.</h1></div>${avatar("iris", "Iris Vasilescu")}</div><div class="device-caption">RECOVERED ARCHIVE / VESPERA</div>${banner()}<div class="section-label"><span>ON THIS DEVICE</span><span>${apps.filter((a) => !["ev", "int", "pz", "map"].includes(a[0])).length} APPS</span></div><div class="grid">${apps
    .filter((a) => !["ev", "int", "pz", "map"].includes(a[0]))
    .map(appTile)
    .join(
      "",
    )}</div><div class="home-tools"><div class="section-label"><span>INVESTIGATION TOOLS</span><span>↗</span></div><div class="grid">${apps
    .filter((a) => ["ev", "int", "pz", "map"].includes(a[0]))
    .concat([["nb", "Notebook"]])
    .map(appTile)
    .join(
      "",
    )}<button onclick="profiles()"><div class="ic">${icon("con")}</div>Subjects</button></div><button class="th" onclick="caseTimeline()">Case timeline <small>Follow the records. Look for the gaps. ↗</small></button><button class="th" onclick="chapters()">Chapter archive <small>Nine stages of the investigation ↗</small></button></div>`;
}
function banner_() {
  const n = E.chapter(),
    c = STORY.chapters[n - 1];
  if (E.complete())
    return `<div class="chapter-card msg"><div class="eyebrow">CASE CLOSED</div><strong>The investigation is complete</strong><button class="btn red" onclick="epilogue()">Read the ending</button></div>`;
  const total = c.done.ev.length + c.done.puz.length,
    left =
      c.done.ev.filter((x) => !S.ev.includes(x)).length +
      c.done.puz.filter((x) => !S.solved.includes(x)).length;
  return `<button class="chapter-card msg" onclick="objectives()"><div class="eyebrow">CHAPTER ${String(n).padStart(2, "0")} / 09 <span style="float:right">↗</span></div><strong>Chapter ${n}: ${esc(c.title)}</strong><p>${esc(c.goal)}</p><small>${left} objective(s) remaining</small><div class="progress-track"><span style="width:${(100 * (total - left)) / total}%"></span></div></button>`;
}
function gal() {
  view("gallery");
  const photos = STORY.photos.filter(visible);
  scr.innerHTML =
    bar("Gallery", "home()") +
    `<div class="section-label"><span>IRIS'S CAMERA ROLL</span><span>${photos.length} PHOTOGRAPHS</span></div><div class="gallery-grid">` +
    photos
      .map(
        (p) =>
          `<button class="th photo-btn" onclick="photo('${p.id}')" aria-label="Open ${esc(p.t)}">${pic(p)}<small>${esc(p.t)}<br>${p.ts}</small></button>`,
      )
      .join("") +
    "</div>";
}
let photoScale = 1,
  photoOffset = [0, 0];
function photo(id, z = 1) {
  view("photo");
  const p = STORY.photos.find((x) => x.id === id);
  photoScale = z;
  photoOffset = [0, 0];
  const compare =
    (id === "E4" || id === "H2") &&
    STORY.photos.some((p) => p.id === "H2" && visible(p));
  scr.innerHTML =
    bar(esc(p.t), "gal()") +
    `<div id="photo-frame" class="viewer-frame" role="img" aria-label="${esc(p.alt || p.t)}. Pinch to zoom; drag to inspect.">${pic(p, z)}</div><div class="row"><button class="btn" onclick="photoZoom(1.4)">Zoom in</button><button class="btn" onclick="photoZoom(.7)">Zoom out</button><button class="btn" onclick="photoZoom(0)">Reset</button><button class="btn" onclick="fullPhoto()">Full screen</button></div><small style="color:var(--dim)">Pinch or zoom, then drag to inspect. Metadata is shown below.</small><div class="meta photo-meta">${esc(p.meta)}</div>${saveBtn(id, `photo('${id}')`)}${compare ? '<button class="th" onclick="comparePhotos()">Compare available versions ↗</button>' : ""}`;
  bindPhoto();
}
function fullPhoto() {
  const f = $("#photo-frame");
  if (f.requestFullscreen)
    f.requestFullscreen().catch(() =>
      toast("Full screen is unavailable on this device. Use pinch to inspect."),
    );
  else toast("Use pinch and drag to inspect on this device.");
}
function photoZoom(f) {
  photoScale = f ? Math.max(1, Math.min(5, photoScale * f)) : 1;
  if (photoScale === 1) photoOffset = [0, 0];
  applyPhoto();
}
function applyPhoto() {
  const z = $("#photo-frame .zoom");
  if (z)
    z.style.transform = `translate(${photoOffset[0]}px,${photoOffset[1]}px) scale(${photoScale})`;
}
function bindPhoto() {
  const f = $("#photo-frame"),
    points = new Map();
  let dist = 0;
  f.onpointerdown = (e) => {
    points.set(e.pointerId, [e.clientX, e.clientY]);
    try {
      f.setPointerCapture(e.pointerId);
    } catch {}
  };
  f.onpointermove = (e) => {
    if (!points.has(e.pointerId)) return;
    const old = points.get(e.pointerId);
    points.set(e.pointerId, [e.clientX, e.clientY]);
    if (points.size === 2) {
      const [a, b] = [...points.values()],
        d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (dist) photoZoom(d / dist);
      dist = d;
    } else if (photoScale > 1) {
      const limit = ((photoScale - 1) * f.clientWidth) / 2;
      photoOffset = [
        Math.max(-limit, Math.min(limit, photoOffset[0] + e.clientX - old[0])),
        Math.max(-limit, Math.min(limit, photoOffset[1] + e.clientY - old[1])),
      ];
      applyPhoto();
    }
  };
  const up = (e) => {
    points.delete(e.pointerId);
    dist = 0;
  };
  f.onpointerup = up;
  f.onpointercancel = up;
}
function comparePhotos() {
  if (!STORY.photos.some((p) => p.id === "H2" && visible(p))) return;
  view("photo");
  scr.innerHTML =
    bar("Compare photographs", "photo('E4')") +
    '<div class="compare-grid">' +
    ["E4", "H2"]
      .map((id) => {
        const p = STORY.photos.find((x) => x.id === id);
        return `<section><h3>${esc(p.t)}</h3>${pic(p)}<div class="meta">${esc(p.meta)}</div><button class="btn" onclick="photo('${id}')">Inspect image</button></section>`;
      })
      .join("") +
    "</div>";
}
function con(id) {
  view("profiles");
  const c = STORY.contacts.find((x) => x.id === id),
    has = STORY.threads[id] && visible(STORY.threads[id]);
  scr.innerHTML =
    bar(esc(c.n), "cons()") +
    `<div class="profile-hero">${avatar(c.id, c.n)}<div><div class="eyebrow">CONTACT RECORD</div><h2>${esc(c.n)}</h2><small>${esc(c.rel)}</small></div></div><div class="meta">Phone: ${c.ph}\nRelationship: ${esc(c.rel)}${c.note ? "\nNote: " + esc(c.note) : ""}</div>${c.ev ? saveBtn(c.ev, `con('${id}')`) : ""}<div class="row">${has ? `<button class="btn" onclick="thread('${id}')">Open messages</button>` : ""}<button class="btn" onclick="subject('${id}')">Investigation profile</button></div>`;
}
function profiles() {
  view("profiles");
  scr.innerHTML =
    bar("Investigation subjects", "home()") +
    `<p class="eyebrow">PEOPLE CONNECTED TO THE AVAILABLE RECORDS</p><div class="subject-grid">` +
    STORY.contacts
      .filter((c) => !c.need || E.has(c.need))
      .map(
        (c) =>
          `<button class="subject-card" onclick="subject('${c.id}')">${avatar(c.id, c.n)}<strong>${esc(c.n)}</strong><small>${esc(c.rel)}</small></button>`,
      )
      .join("") +
    "</div>";
}
function subject(id) {
  const c = STORY.contacts.find((c) => c.id === id);
  if (!c || (c.need && !E.has(c.need))) return;
  view("profiles");
  const person = id === "j" ? "julia" : id,
    ev = S.ev.filter((e) =>
      (STORY.evidence[e][2] || []).some((p) => p === person || p === id),
    ),
    iv = STORY.interviews[person];
  scr.innerHTML =
    bar(esc(c.n), "profiles()") +
    `<div class="profile-hero">${avatar(c.id, c.n)}<div><div class="eyebrow">SUBJECT DOSSIER</div><h2>${esc(c.n)}</h2><small>${esc(c.rel)}</small></div></div><div class="meta">${esc(c.ph)}${c.note ? "\n" + esc(c.note) : ""}</div><div class="row"><button class="btn" onclick="con('${id}')">Contact record</button>${iv && E.vis(iv) && iv.need.every((n) => S.ev.includes(n)) ? `<button class="btn red" onclick="talk('${person}')">Interview subject</button>` : ""}</div><div class="section-label"><span>COLLECTED RECORDS</span><span>${ev.length}</span></div>` +
    (ev.map((e) => evidenceCard(e)).join("") ||
      "<p>No associated evidence collected yet.</p>");
}
function evidenceCard(id) {
  const e = STORY.evidence[id];
  return `<button class="ev" onclick="evidenceDetail('${id}')"><span class="source-tag">${id} / ${esc(e[1])}</span><br>${esc(e[0])}<small style="display:block;margin-top:8px">Inspect record ↗</small></button>`;
}
function evidenceDetail(id) {
  if (!S.ev.includes(id)) return;
  view("evidence");
  const e = STORY.evidence[id],
    p = STORY.photos.find((p) => p.id === id && visible(p));
  scr.innerHTML =
    bar("Evidence record", "board()") +
    `<article class="evidence-detail"><div class="source-tag">ARCHIVED / ${id} / ${esc(e[1])}</div><h1>${esc(e[0])}</h1>${p ? pic(p) : ""}<div class="meta">Source: ${esc(e[1])}\nAssociated people: ${
      (e[2] || [])
        .map((p) => STORY.persons[p] || p)
        .map(esc)
        .join(", ") || "Not established"
    }</div><div class="row"><button class="btn red" onclick="pickN('${id}')">Select on board</button><button class="btn" onclick="openEvidenceSource('${id}')">Open source</button></div><h3>Established connections</h3>${
      S.made
        .filter((m) => m[0].split("~").slice(0, 2).includes(id))
        .map(
          (m) =>
            `<div class="msg">${m[1] === "proved" ? "✓ Supported" : "? Plausible"}<p>${esc(m[2])}</p>${m[3] ? `<small>Your annotation: ${esc(m[3])}</small>` : ""}</div>`,
        )
        .join("") || "<p>No connections established for this item.</p>"
    }</article>`;
}
function openEvidenceSource(id) {
  for (const [k, t] of Object.entries(STORY.threads))
    if (visible(t) && t.m.some((m) => m[3] === id && msgOk(m)))
      return thread(k);
  const p = STORY.photos.find((p) => p.id === id && visible(p));
  if (p) return photo(id);
  const m = STORY.mails.find((m) => m.ev === id && visible(m));
  if (m) return mailOpen(m.id);
  const f = STORY.files.find((f) => f.ev === id && E.vis(f));
  if (f) return fileOpen(f.id);
  const a = STORY.audio.find((a) => a.ev === id && E.vis(a));
  if (a) return clip(a.id);
  const c = STORY.contacts.find((c) => c.ev === id);
  if (c) return con(c.id);
  if (STORY.notes.some((n) => n[2] === id)) return notes();
  if (STORY.records.some((r) => r[6] === id)) return maps();
  if (Object.values(STORY.callNotes || {}).some((n) => n[0] === id))
    return calls();
  const iv = ((e) => e && e[1] === "Interview")(STORY.evidence[id]);
  if (iv) return ints();
  const pageIndex = STORY.web.pages.findIndex((p) => p.ev === id);
  if (pageIndex >= 0) return page(pageIndex);
  if (STORY.social.some((p) => p.ev === id)) return soc();
  evidenceDetail(id);
}
let timelineSource = "all";
function caseTimeline() {
  view("timeline");
  const events = [];
  const add = (ts, title, src, id, action) =>
    events.push({ ts, title, src, id, action });
  for (const [k, t] of Object.entries(STORY.threads))
    if (visible(t))
      for (const m of t.m.filter(msgOk))
        if (m[3] && S.ev.includes(m[3]))
          add(
            m[1],
            STORY.evidence[m[3]][0],
            "Messages",
            m[3],
            `thread('${k}')`,
          );
  for (const p of STORY.photos.filter(visible))
    if (S.ev.includes(p.id))
      add(p.ts, p.t, "Gallery", p.id, `photo('${p.id}')`);
  for (const m of STORY.mails.filter(visible))
    if (S.ev.includes(m.ev))
      add(m.ts, m.sub, "Email", m.ev, `mailOpen('${m.id}')`);
  for (const a of STORY.audio.filter(E.vis))
    if (S.ev.includes(a.ev)) add(a.ts, a.n, "Audio", a.ev, `clip('${a.id}')`);
  for (const r of movementRows())
    if (!r[6] || S.ev.includes(r[6]))
      add(
        r[3],
        movementName(r[1]) + " · " + STORY.places[r[2]].n + " · " + r[5],
        "Maps",
        r[6],
        "maps()",
      );
  for (const c of STORY.calls)
    add(
      c[2],
      c[1] + " · " + (c[0] === "in" ? "Incoming" : "Outgoing") + " · " + c[3],
      "Phone",
      null,
      "calls()",
    );
  for (const c of STORY.calendar)
    if (!c[4] || S.ev.includes(c[4]))
      add(c[0] + " · " + c[1], c[2] + " · " + c[3], "Calendar", c[4], "cal()");
  for (const p of STORY.social.filter(visible))
    if (p.ev && S.ev.includes(p.ev))
      add(p.ts, p.who + " · " + p.text, "Social", p.ev, "soc()");
  const date = (t) => {
    if (/^2025-/.test(t)) return t;
    const m = t.match(/(Aug|Sep|Oct)\s+(\d+).*?(\d\d:\d\d)/);
    return m
      ? `2025-${{ Aug: "08", Sep: "09", Oct: "10" }[m[1]]}-${m[2].padStart(2, "0")}T${m[3]}`
      : "2025-10-00T00:00";
  };
  events.sort((a, b) => date(a.ts).localeCompare(date(b.ts)));
  const sources = ["all", ...new Set(events.map((e) => e.src))];
  scr.innerHTML =
    bar("Case timeline", "home()") +
    `<p style="color:var(--dim);font-size:12px">Available records, in sequence. Missing data does not establish what did or did not happen. Evidence appears here after you collect it.</p><select class="in timeline-filter" aria-label="Filter timeline" onchange="timelineSource=this.value;caseTimeline()">${sources.map((s) => `<option ${s === timelineSource ? "selected" : ""} value="${s}">${s === "all" ? "All sources" : s}</option>`).join("")}</select>` +
    events
      .filter((e) => timelineSource === "all" || e.src === timelineSource)
      .map(
        (e) =>
          `<article class="timeline-entry"><time>${esc(e.ts)}</time><h3>${esc(e.title)}</h3><small>${e.src}${e.id ? " / " + e.id : ""}</small><br><button class="btn" onclick="${e.action}">Open record ↗</button></article>`,
      )
      .join("");
  const dated = new Set(events.map((e) => e.id).filter(Boolean));
  const undated = S.ev.filter((id) => !dated.has(id));
  if (timelineSource === "all" && undated.length)
    scr.innerHTML +=
      '<h3>Records without an assigned event time</h3><p style="color:var(--dim);font-size:12px">These collected documents, statements and notes remain available for comparison. They have not been assigned an inferred timestamp.</p>' +
      undated.map(evidenceCard).join("");
}
function chapters() {
  view("chapters");
  const current = E.chapter();
  scr.innerHTML =
    bar("Chapter archive", "home()") +
    STORY.chapters
      .map(
        (c, i) =>
          `<section class="chapter-row ${i + 1 > current ? "locked" : ""}"><span>${String(i + 1).padStart(2, "0")}</span><div><div class="eyebrow">${i + 1 > current ? "LOCKED" : E.done(i + 1) ? "COMPLETE" : "IN PROGRESS"}</div><h3>${i + 1 > current ? "Unrecovered archive" : esc(c.title)}</h3>${i + 1 <= current ? `<p>${esc(c.goal)}</p><small>${c.done.ev.filter((e) => S.ev.includes(e)).length}/${c.done.ev.length} evidence · ${c.done.puz.filter((p) => S.solved.includes(p)).length}/${c.done.puz.length} challenges</small>` : "<p>Continue the investigation to recover this chapter.</p>"}</div></section>`,
      )
      .join("");
}
function talk(k, pick = false) {
  view("interview");
  const I = STORY.interviews[k];
  if (!S.talk[k]) E.go(k, I.start);
  const n = E.node(k, S.talk[k]),
    tr = S.trust[k] || 0;
  scr.innerHTML =
    bar(I.name, "ints()") +
    `<div class="interview-scene"><div class="interview-title">${avatar(k, I.name)}<div><div class="eyebrow">INTERVIEW RECORD</div><h2>${esc(I.name)}</h2></div></div><div class="m">${esc(n.t)}</div></div>` +
    (pick
      ? "<p>Present which evidence?</p>" +
        S.ev
          .map(
            (e) =>
              `<button class="ev" onclick="E.present('${k}','${e}');talk('${k}')"><span class="source-tag">${e} / ${esc(STORY.evidence[e][1])}</span><br>${esc(STORY.evidence[e][0])}</button>`,
          )
          .join("") +
        `<button class="btn" onclick="talk('${k}')">Cancel</button>`
      : n.o
          .filter((o) => (!o[2] || tr >= o[2]) && (!o[3] || E.has(o[3])) && E.nodeReady(k,o[1]))
          .map(
            (o, i) =>
              `<button class="ev" onclick="E.go('${k}','${o[1]}');talk('${k}')"><span class="choice-num" aria-hidden="true" data-number="${String(i + 1).padStart(2, "0")}"></span>${esc(o[0])}</button>`,
          )
          .join("") +
        `<div class="row"><button class="btn red" onclick="talk('${k}',true)">Present evidence</button><button class="btn" onclick="E.go('${k}','${I.start}');talk('${k}')">Restart interview</button></div>`);
}
function soc() {
  view("social");
  const socialPhoto = (p) => (p.loc && /Atelier/.test(p.loc) ? "P08" : null);
  scr.innerHTML =
    bar("Social", "home()") +
    '<div class="eyebrow">THE PUBLIC RECORD / FEED & STORIES</div>' +
    STORY.social
      .filter(visible)
      .map((p) => {
        const id = Object.keys(STORY.persons).find((id) =>
            p.who.startsWith(STORY.persons[id].split(" ")[0]),
          ),
          ph = socialPhoto(p),
          image = ph && STORY.photos.find((x) => x.id === ph && visible(x));
        return `<article class="social-post"><header>${id ? avatar(id, p.who) : ""}<div><b>${esc(p.who)}</b><div class="post-meta">${esc(p.h || "")} · ${esc(p.kind)}</div></div></header>${image ? pic(image) : ""}<div class="post-body"><p>${esc(p.text)}</p>${p.loc ? `<div class="post-meta">${esc(p.loc)}</div>` : ""}${p.tag ? `<div class="post-meta">Tagged: ${esc(p.tag)}</div>` : ""}<p class="post-meta">${p.ts}${p.likes ? " · " + p.likes + " likes" : ""}</p>${(p.com || []).map((c) => `<p class="comment">${esc(c)}</p>`).join("")}${p.deleted ? `<p class="msg">${esc(p.deleted)}</p>` : ""}${p.ev ? saveBtn(p.ev, "soc()") : ""}</div></article>`;
      })
      .join("");
}
function clip(id) {
  const gated=STORY.audio.find(a=>a.id===id);if(!gated||!visible(gated)){view("audio");scr.innerHTML=bar("Recording unavailable","aud()")+'<p>This recording has not been recovered yet. Continue the current investigation.</p>';return;}
  view("audio");
  const a = STORY.audio.find((x) => x.id === id),
    can = typeof speechSynthesis !== "undefined" && !!speechSynthesis;
  scr.innerHTML =
    bar(esc(a.n), "aud()") +
    `<div class="audio-deck"><div class="eyebrow">${esc(a.ts)} / ${esc(a.n)}</div><div class="waveform" aria-hidden="true">${Array.from({ length: 44 }, (_, i) => `<i style="height:${8 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.4)) * 50}px"></i>`).join("")}</div><small>${esc(a.src)}</small><audio id="au" controls preload="none" src="assets/audio/${id}.mp3"></audio><p id="aun" class="post-meta">Recorded audio is not installed. Synthesized speech is an optional reading aid.</p>${can ? `<button class="btn" onclick="speak('${id}')">▶ Play synthesized voice</button><button class="btn" onclick="speechSynthesis.cancel()">Stop</button>` : "<p>This device has no speech playback. Read the transcript.</p>"}</div><div class="section-label"><span>TRANSCRIPT</span><span>${id.toUpperCase()}</span></div>` +
    a.lines
      .map(
        (l) =>
          `<div class="m"><b class="who">${esc(l[0])}</b>${esc(l[1])}</div>`,
      )
      .join("") +
    saveBtn(a.ev, `clip('${id}')`);
  const au = $("#au");
  au.onerror = () => {
    au.remove();
  };
  au.onloadedmetadata = () => {
    $("#aun").textContent = "Local audio recording";
  };
}
function help() {
  view("help");
  scr.innerHTML =
    bar("Field guide", "home()") +
    `<div class="eyebrow">HOW TO INVESTIGATE</div><h1>Read between<br>the records.</h1><div class="paper stmt"><div class="p-head">01 / Explore the device</div><p>Open conversations, photographs, calls and documents. Return to older records as the archive expands.</p><div class="p-head">02 / Collect evidence</div><p>Tap messages with a dashed edge or use “Save as evidence.” Your collection persists between sessions. In photographs, use “Inspect and retain a detail.” In documents, keep a passage to retain its exact source.</p><div class="p-head">03 / Make connections</div><p>Use Working theories for your own accounts. Attach observations and records as supporting, challenging or contextual material. Free text is not automatically assessed. The Established links tab retains the original connection canvas: select two items, choose a relationship and test its cited support.</p><div class="p-head">04 / Question and compare</div><p>Present evidence in interviews. Use Challenges to test your reasoning, and optional hints when you need a nudge. A poor interview response will not end the investigation.</p><div class="p-head">05 / Keep your own account</div><p>The Timeline organizes available records. Notebook is always accessible in the bottom navigation. Absence of a record is not proof of absence.</p></div><button class="btn red" onclick="S.unlocked?home():lock()">Return to investigation</button>`;
}
function epilogue() {
  view("ending");
  scr.innerHTML =
    bar("The Last Archive", "home()") +
    `<div class="eyebrow">INVESTIGATION COMPLETE / 09</div><h1>Epilogue</h1>` +
    E.epilogue()
      .map((p) => `<p class="ending-quote">${esc(p.t)}</p>`)
      .join("") +
    `<div class="meta">Evidence collected: ${S.ev.length}\nChallenges solved: ${S.solved.length}\nHints used: ${S.hints}</div><button class="btn" onclick="home()">Return to the archive</button>`;
}
// Add consistent screen identities without coupling the engine to presentation.
new MutationObserver(() => {
  const title = scr.querySelector(".bar h3")?.textContent || "";
  if (title === "Evidence board") document.body.dataset.view = "board";
  else if (title === "Maps") document.body.dataset.view = "map";
  syncCase();
}).observe(scr, { childList: true });
$("#nb").addEventListener("input", () => {
  const mobile = $("#nb2");
  if (mobile) mobile.value = S.nb;
  syncCase();
});
if(!STORY.narrativeEdition){S.unlocked ? home() : lock();}
// Cards retain the original board coordinates and gesture handlers; only their drawing changes.
function drawBoard() {
  const sv = $("#bd");
  if (!sv) return;
  const P = S.board;
  const edges = S.made
    .map((m) => {
      const [a, b] = m[0].split("~");
      if (!P[a] || !P[b]) return "";
      const proved = m[1] === "proved";
      return `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${proved ? "#bb6258" : "#9baba0"}" stroke-width="${proved ? 2.2 : 1.4}" ${proved ? "" : 'stroke-dasharray="5 4"'}/><text x="${(P[a][0] + P[b][0]) / 2}" y="${(P[a][1] + P[b][1]) / 2 - 5}" fill="#e4d7b5" font-size="10" paint-order="stroke" stroke="#1c251d" stroke-width="3">${proved ? "✓" : "?"}</text>`;
    })
    .join("");
  sv.innerHTML =
    edges +
    Object.keys(P)
      .map((id) => {
        const [x, y] = P[id],
          on = id === A || id === B,
          isPerson = id.startsWith("person:"),
          person = isPerson ? id.slice(7) : null,
          ph = STORY.photos.find((p) => p.id === id && visible(p)),
          title = isPerson
            ? STORY.persons[person]
            : id.startsWith("place:")
              ? STORY.places[id.slice(6)].n
              : id.startsWith("event:")
                ? STORY.events[id.slice(6)]
                : STORY.evidence[id]?.[0] || id,
          src = isPerson
            ? `assets/portraits/${person === "j" ? "julia" : person}.png`
            : ph
              ? `assets/photos/${id}.jpg`
              : null;
        return `<g data-id="${id}" style="cursor:grab"><title>${esc(title)}</title><circle cx="${x}" cy="${y}" r="35" fill="transparent"/><circle cx="${x}" cy="${y}" r="18" fill="transparent"/><rect x="${x - 38}" y="${y - 33}" width="76" height="70" rx="1" fill="${on ? "#d4bfa0" : "#d1ceb9"}" stroke="${on ? "#c76558" : "#848e78"}" stroke-width="${on ? 2 : 1}"/><path d="M${x - 32} ${y - 24}h25" stroke="#8d574b" stroke-width="3"/>${src ? `<image href="${src}" x="${x - 32}" y="${y - 19}" width="64" height="34" preserveAspectRatio="xMidYMid slice"/>` : `<path d="M${x - 28} ${y - 10}h52m-52 7h44m-44 7h48" stroke="#a7ab98" stroke-width="2"/>`}<text x="${x - 31}" y="${y + 25}" fill="#283629" font-family="monospace" font-size="6.5">${esc(title.slice(0, 17))}</text><text x="${x - 31}" y="${y + 33}" fill="#283629" font-family="monospace" font-size="6">${esc(title.slice(17, 34))}${title.length > 34 ? "…" : ""}</text><text x="${x + 30}" y="${y - 23}" fill="#5b634b" text-anchor="end" font-family="monospace" font-size="5.5">${isPerson ? "SUBJECT" : id}</text><circle cx="${x}" cy="${y - 31}" r="2" fill="${on ? "#a74943" : "#776552"}"/></g>`;
      })
      .join("");
}
const recoveredMaps = maps;
maps = function () {
  view("map");
  recoveredMaps();
  const svg = $("#mp");
  if (svg) {
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    bg.setAttribute("aria-hidden", "true");
    bg.innerHTML =
      '<defs><pattern id="mapgrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#40503e" stroke-width=".4"/></pattern></defs><rect width="360" height="260" fill="#202a23"/><rect width="360" height="260" fill="url(#mapgrid)"/><path d="M-10 95Q100 120 150 80T370 105" fill="none" stroke="#344a45" stroke-width="22"/><path d="M-10 95Q100 120 150 80T370 105" fill="none" stroke="#658078" stroke-width=".5"/><g fill="#303d2e" stroke="#465540" stroke-width=".6"><path d="M15 17h38v36H15zM69 15h50v28H69zM126 18h42v38h-42zM201 14h54v28h-54zM271 12h62v41h-62zM20 144h45v23H20zM81 147h51v36H81zM201 143h41v37h-41zM263 137h38v26h-38zM22 211h71v30H22zM104 215h28v30h-28zM205 215h48v29h-48zM276 210h56v30h-56z"/></g><g fill="none" stroke="#68705a" stroke-width="2"><path d="M0 130H360M180 0V260M60 0L150 260M0 40L360 220"/></g><text x="15" y="248" fill="#8f9c7e" font-size="7" font-family="monospace" letter-spacing="2">VESPERA / LOCATION RECORDS</text>';
    svg.insertBefore(bg, svg.firstChild);
  }
};
// Make legacy tap-to-collect records keyboard accessible without changing their actions.
new MutationObserver(() => {
  scr.querySelectorAll(".m[onclick]:not([role])").forEach((el) => {
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    el.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    };
  });
}).observe(scr, { childList: true });
function msgs(q = "") {
  view("messages");
  const L = q.toLowerCase(),
    hits = [];
  Object.entries(STORY.threads)
    .filter(([k, t]) => visible(t))
    .forEach(([k, t]) =>
      t.m.filter(msgOk).forEach((m) => {
        if (L && m[2].toLowerCase().includes(L)) hits.push([k, t.name, m]);
      }),
    );
  const sender = (k, t) => {
    const id = k.replace(/_old|_del/g, "");
    return STORY.contacts.some((c) => c.id === id) || id === "moth"
      ? avatar(id, t.name)
      : `<span class="av">${icon("msg")}</span>`;
  };
  scr.innerHTML =
    bar("Messages", "home()") +
    `<input id="q" class="in" placeholder="Search messages" aria-label="Search available messages" value="${esc(q)}"><div class="section-label"><span>${L ? "SEARCH RESULTS" : "CONVERSATIONS"}</span><span>RECOVERED BACKUP</span></div>` +
    (L
      ? hits
          .map(
            ([k, n, m]) =>
              `<button class="th" onclick="thread('${k}')"><b>${esc(n)}</b><small>${m[1]} · ${esc(m[2])}</small></button>`,
          )
          .join("") || "<p>No matches.</p>"
      : Object.entries(STORY.threads)
          .filter(([k, t]) => visible(t))
          .map(([k, t]) => {
            const recent = t.m.filter(msgOk).at(-1);
            return `<button class="th conversation-row" onclick="thread('${k}')">${sender(k, t)}<span><b>${esc(t.name)}</b><small>${esc(t.sub)}</small>${recent ? `<span class="message-preview">${esc(recent[2])}</span>` : ""}</span><span class="chevron" aria-hidden="true">›</span></button>`;
          })
          .join(""));
  const i = $("#q");
  i.oninput = () => msgs(i.value);
  if (q) {
    i.focus();
    i.setSelectionRange(q.length, q.length);
  }
}
function thread(k) {
  view("messages");
  const t = STORY.threads[k];
  let day = "";
  scr.innerHTML =
    bar(esc(t.name), "msgs()") +
    `<div class="conversation-context"><span class="live-dot"></span>RECOVERED CONVERSATION <span>${esc(t.sub)}</span></div>` +
    (t.m.some((m) => m[3])
      ? '<small style="color:var(--dim)">Dashed messages can be saved as evidence.</small>'
      : "") +
    t.m
      .filter(msgOk)
      .map(([f, ts, x, e]) => {
        const d = ts.split(" · ")[0],
          separator =
            d !== day ? `<div class="message-date">${esc(d)}</div>` : "";
        day = d;
        return (
          separator +
          `<div class="m ${f === "me" ? "me" : ""} ${e ? "has" : ""} ${e && S.ev.includes(e) ? "saved" : ""}" ${e ? `role="button" tabindex="0" aria-label="${S.ev.includes(e) ? "Archived" : "Save evidence"}: ${esc(x)}" onclick="saveMsg(this,'${e}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();saveMsg(this,'${e}')}"` : ""}>${f !== "me" && f !== "them" ? `<b class="who">${esc(f)}</b>` : ""}${esc(x)}<time>${ts}${e && S.ev.includes(e) ? " · Archived" : ""}</time>${e ? `<span class="archive-action">${S.ev.includes(e)?"✓ Archived record":"＋ Archive this record"}</span>`:""}</div>`
        );
      })
      .join("");
}
function doc(id) {
  const m = STORY.mails.find((x) => x.id === id);
  view("document");
  scr.innerHTML =
    bar(esc(m.att), `mailOpen('${id}')`) +
    `<div class="document-cover"><div class="eyebrow">EMAIL ATTACHMENT / READ ONLY</div><div class="paper log"><div class="p-head">${esc(m.doc[0])}</div>${m.doc
      .slice(1)
      .map((l) => `<div class="p-line">${esc(l)}</div>`)
      .join("")}</div><p class="eyebrow">ATTACHED TO: ${esc(m.sub)}</p></div>`;
}
function cal() {
  view("calendar");
  const year=STORY.calendarYear||2025, month=STORY.calendarMonth||10;
  const offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
  const count=new Date(Date.UTC(year,month,0)).getUTCDate();
  const dates=new Set(STORY.calendar.map(c=>Number(c[0].match(/\d+/)?.[0])));
  scr.innerHTML =
    bar("Calendar", "home()") +
    `<div class="calendar-heading"><div class="eyebrow">ARCHIVED SCHEDULE / ${year}</div><h1>October</h1></div><div class="month-grid" aria-hidden="true">${["M", "T", "W", "T", "F", "S", "S"].map((x) => `<span class="weekday">${x}</span>`).join("")}${Array.from({ length: offset }, () => '<span class="calendar-empty"></span>').join("")}${Array.from({ length: count }, (_, i) => `<span data-day="${i+1}" class="${dates.has(i + 1) ? "event-day" : ""}">${i + 1}</span>`).join("")}</div><div class="section-label"><span>SCHEDULED EVENTS</span><span>OCTOBER</span></div>` +
    STORY.calendar
      .map(
        ([d, t, n, l, e]) =>
          `<div class="calendar-event ${e ? "m has" : ""} ${e && S.ev.includes(e) ? "saved" : ""}" ${e ? `role="button" tabindex="0" onclick="take('${e}');this.classList.add('saved');this.classList.remove('has')" onkeydown="if(event.key==='Enter')this.click()"` : ""}><div class="calendar-date">${esc(d)}<small>${esc(t)}</small></div><div><b>${esc(n)}</b><small>${esc(l)}</small>${e ? "<small>Tap to archive this event</small>" : ""}</div></div>`,
      )
      .join("");
}
const originalPuzzleRender = pz;
pz = function (id, msg = "") {
  view("puzzle");
  originalPuzzleRender(id, msg);
  const p = STORY.puzzles.find((p) => p.id === id);
  scr.dataset.puzzle = p.type;
  const label = document.createElement("div");
  label.className = "puzzle-heading";
  label.innerHTML = `<span class="eyebrow">ANALYSIS / ${String(STORY.puzzles.indexOf(p) + 1).padStart(2, "0")}</span><span class="source-tag">${{ order: "SEQUENCE", code: "ACCESS RECOVERY", match: "CROSS-REFERENCE", set: "EVIDENCE REVIEW", case: "FINAL CASE FILE" }[p.type] || "ANALYSIS"}</span>`;
  scr.querySelector(".bar").after(label);
};
const originalPlace = E.place;
E.place = function (id, x, y) {
  if (x === undefined && !S.board[id]) {
    const slots = Array.from({ length: 12 }, (_, i) => [
        160 + (i % 3) * 140,
        120 + Math.floor(i / 3) * 120,
      ]),
      slot = slots.find(
        (s) =>
          !Object.values(S.board).some(
            (p) => Math.hypot(p[0] - s[0], p[1] - s[1]) < 75,
          ),
      );
    if (slot) [x, y] = slot;
  }
  return originalPlace(id, x, y);
};
const originalBoard = board;
board = function () {
  view("board");
  if (S.ev.length >= 2 && !Object.keys(S.board).length) {
    S.ev.slice(0, 6).forEach((id) => E.place(id));
    E.save();
  }
  originalBoard();
};
