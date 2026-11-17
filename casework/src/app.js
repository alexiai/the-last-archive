import { asset, assetMarkup } from "./assets.js";
import { GEOMETRY } from "./geometry.js";
import {
  traceSheet,
  circulation,
  catalogue,
  contactSheet,
} from "./diagrams.js";
import { CONTENT as C } from "./content.js";
import * as E from "./engine.js";
import * as A from "./audio.js";
import { escape as e, modal, toast, icon } from "./dom.js";
import { VictimPhone } from "./phone.js";
const root = document.querySelector("#game");
const phone = new VictimPhone({
  source: openSource,
  puzzle: openPuzzle,
  interview: interview,
});
const button = (label, attrs = "") =>
  `<button type="button" ${attrs}>${e(label)}</button>`;
function bindSources(el) {
  el.querySelectorAll("[data-source]").forEach(
    (b) => (b.onclick = () => openSource(b.dataset.source)),
  );
  el.querySelectorAll("[data-puzzle]").forEach(
    (b) => (b.onclick = () => openPuzzle(b.dataset.puzzle)),
  );
}
function render() {
  const s = E.state;
  if (!s.started) {
    root.innerHTML = assetMarkup(
      `<section class="title-screen"><div class="title-copy"><p class="eyebrow">AN INVESTIGATION IN NINE CHAPTERS</p><h1>THE LAST<br>ARCHIVE</h1><p>Some things survive because someone keeps them.<br>Others survive because someone refuses to let them go.</p>${button("Begin the investigation", 'id="begin"')}<small>A new narrative edition. Earlier editions and saves remain separate.</small></div></section>`,
    );
    document.querySelector("#begin").onclick = () => {
      E.newGame();
      render();
    };
    return;
  }
  if (s.intro < C.intro.length) {
    const i = C.intro[s.intro];
    root.innerHTML = assetMarkup(
      `<section class="briefing" style="--back:url('assets/world/${i.image || "opening-night"}.jpg')"><div class="briefing-copy">${i.portrait ? `<img class="briefing-portrait" src="assets/portraits/${i.portrait}.png" alt="${e(i.title)}">` : ""}<p class="eyebrow">${e(i.eyebrow)}</p><h1>${e(i.title)}</h1><p>${e(i.text)}</p>${i.audio ? button("Play briefing", 'id="briefing-play"') + `<details class="briefing-transcript"><summary>Recording transcript</summary><p>${e(C.audio[i.audio].lines.map(([who, text]) => who + ": " + text).join("\n"))}</p></details>` : ""}${button(s.intro === C.intro.length - 1 ? "Enter the apartment" : "Continue", 'id="continue"')}<small>${s.intro + 1} / ${C.intro.length} · Captions shown in full</small></div></section>`,
    );
    document
      .querySelector("#briefing-play")
      ?.addEventListener("click", () => A.play(i.audio));
    document.querySelector("#continue").onclick = () => {
      s.intro++;
      E.save();
      A.stopVoice();
      render();
    };
    return;
  }
  const ch = C.chapters[s.chapter - 1];
  root.innerHTML = assetMarkup(
    `<section class="scene" aria-label="Investigation environment"><img class="scene-background" src="assets/world/${ch.location === "apartment" ? "scene-wide" : ch.location === "hotel" ? "hotel-4" : ch.location === "archive" ? "archive-room" : "station-desk"}.jpg" alt="${ch.location === "apartment" ? "Iris’s living room, preserved for examination" : e(ch.location) + " investigation workspace"}"><header class="game-heading"><span>THE LAST ARCHIVE</span><span>DETECTIVE DIMA · CASE 0416</span><button id="settings" aria-label="Settings and save">Settings / save</button></header><div class="scene-objective"><p class="eyebrow">CHAPTER ${s.chapter} / ${e(ch.title)}</p><h1>${s.chapter === 1 ? "A room. A life. A first question." : e(ch.title)}</h1><p>${e(ch.objective)}</p></div>${
      ch.location === "apartment"
        ? `<div class="scene-points">${[
            ["scene-shelf", "The shelf", 71, 28],
            ["scene-table", "The low table", 46, 64],
            ["phone-object", "The phone", 82, 78],
            ["scene-door", "The apartment door", 39, 23],
            ["scene-wide", "Examine the room", 56, 46],
          ]
            .map(
              ([id, label, x, y]) =>
                `<button class="scene-point" data-geometry="${{ "scene-shelf": "shelf", "scene-table": "table", "phone-object": "phone", "scene-door": "door" }[id] || "overview"}" style="left:${x}%;top:${y}%" data-source="${id}"><span>+</span>${label}</button>`,
            )
            .join("")}</div>`
        : ""
    }<footer class="game-tools"><button id="casebook">${icon("book")}Casebook</button><button id="records">${icon("camera")}Records & examinations</button><button id="phone" ${!E.has("phone") ? "disabled" : ""}>${icon("phone")}Iris’s phone</button><button id="people">${icon("contacts")}Conversations</button></footer><div class="scene-caption">${ch.location === "apartment" ? "8 TEILOR STREET · ORIGINAL ROOM / BODY REMOVED" : e(ch.location.toUpperCase()) + " · RETAINED SOURCES"}</div></section>`,
  );
  bindSources(root);
  const photo = root.querySelector(".scene-background");
  photo.onload = positionScenePoints;
  positionScenePoints();
  document.querySelector("#casebook").onclick = casebook;
  document.querySelector("#phone").onclick = () => phone.open();
  document.querySelector("#records").onclick = records;
  document.querySelector("#people").onclick = people;
  document.querySelector("#settings").onclick = settings;
}
function positionScenePoints() {
  const img = root.querySelector(".scene-background");
  if (!img) return;
  const r = img.getBoundingClientRect(),
    fit = getComputedStyle(img).objectFit,
    scale =
      fit === "contain"
        ? Math.min(r.width / 1400, r.height / 900)
        : Math.max(r.width / 1400, r.height / 900);
  const w = 1400 * scale,
    h = 900 * scale,
    pos = getComputedStyle(img)
      .objectPosition.split(" ")
      .map((v) => parseFloat(v) / 100);
  const ox = (r.width - w) * (pos[0] || 0.5),
    oy = (r.height - h) * (pos[1] || 0.5);
  root.querySelectorAll("[data-geometry]").forEach((b) => {
    const p =
      b.dataset.geometry === "overview"
        ? [0.12, 0.62]
        : GEOMETRY["scene-wide"][b.dataset.geometry];
    b.style.left = ox + p[0] * w + "px";
    b.style.top = oy + p[1] * h + "px";
  });
}
window.addEventListener("resize", positionScenePoints);
function openSource(id) {
  const src = C.sources[id];
  if (!E.visible(src))
    return toast(
      "This source has not yet been released into the investigation.",
    );
  E.inspected(id);
  let point = null,
    frame = 4,
    textMode = false;
  const photographic = ["photo", "surveillance"].includes(src.kind);
  const audio = id.startsWith("audio.") ? C.audio[id.slice(6)] : null;
  const d = modal(
    src.title,
    `<div class="inspection ${e(src.kind)}"><div class="original-source">${id === "trace" ? traceSheet() : id === "building-a" ? circulation(false) : id === "building-b" ? circulation(true) : id === "catalogue" ? catalogue() : id === "object-report" ? contactSheet() : ""}${src.image ? `<div class="image-tools"><label>Magnification <input aria-label="Image magnification" type="range" min="1" max="3" step=".25" value="1" id="magnify"></label>${id === "hotel-camera" ? '<label>Retained frame <select id="frame"><option value="0">00:24:56 / empty</option><option value="4" selected>00:25:00 / crossing</option><option value="8">00:25:04 / empty</option></select></label>' : ""}</div><div class="photo-viewport"><div class="photo-surface"><img id="original-image" src="assets/world/${src.image}.jpg" alt="${e(src.title)}"><span class="inspection-mark" hidden>+</span>${src.kind === "surveillance" ? `<div class="camera-overlay">${id === "hotel-camera" ? "AURELIA / CAM 02 · 18 OCT 00:25:00" : "TEILOR / E1 · FIXED VIEW"}<span>RETAINED STILL / NO AUDIO</span></div>` : ""}</div></div>` : ""}<article class="source-paper"><p class="document-heading">${e(src.kind.toUpperCase())} / ORIGINAL ${e(id)}</p><h2>${e(src.title)}</h2><p class="source-meta">${e(src.meta)}</p><div class="source-text">${e(src.text)}</div>${src.visual ? `<details><summary>Equivalent visual description</summary><p>${e(src.visual)}</p></details>` : ""}</article>${audio ? `<div class="sound-deck"><button id="play-source">Play original recording</button><button id="pause-source">Pause</button><label>Recording position<input id="audio-position" type="range" min="0" max="1" step=".1" value="0" aria-label="Recording position in seconds"></label><output id="audio-time">Ready to play</output><button id="read-sound">Use transcript and sound description</button><p>Transcript and equivalent sound observations are printed above. Replay freely.</p></div>` : ""}</div><aside class="observation-slip"><p class="eyebrow">YOUR OBSERVATION</p>${photographic ? '<p>Mark a detail in the image. Zoom and scroll to inspect it.</p><button id="text-location">Use equivalent text location</button><p id="point-feedback" role="status">No point marked.</p>' : ""}<label>What does this source show?<select id="reading"><option value="">Choose your observation</option>${Object.entries(
      src.choices,
    )
      .map(([k, v]) => `<option value="${e(k)}">${e(v)}</option>`)
      .join(
        "",
      )}</select></label><label>Personal note <textarea id="observation-note" rows="3" placeholder="What might this mean? (optional)"></textarea></label><button id="retain">Retain with source</button>${id === "phone-object" ? '<button id="recover-phone">Recover authorised phone copy</button>' : ""}<p class="source-footnote">Keeping a detail does not confirm your interpretation. Compare it with other originals in your casebook.</p></aside></div>`,
    true,
  );
  if (src.image) {
    const surface = d.querySelector(".photo-surface");
    d.querySelector("#magnify").oninput = (ev) =>
      (surface.style.width = Number(ev.target.value) * 100 + "%");
    surface.onclick = (ev) => {
      const r = surface.getBoundingClientRect();
      point = [
        (ev.clientX - r.left) / r.width,
        (ev.clientY - r.top) / r.height,
      ];
      textMode = false;
      const m = d.querySelector(".inspection-mark");
      m.hidden = false;
      m.style.left = point[0] * 100 + "%";
      m.style.top = point[1] * 100 + "%";
      d.querySelector("#point-feedback").textContent =
        "Detail marked. Select what you observed.";
    };
    d.querySelector("#text-location")?.addEventListener("click", () => {
      point = [0.5, 0.5];
      textMode = true;
      d.querySelector("#point-feedback").textContent =
        "Text observation mode: choose the visible detail from the descriptions below.";
    });
    d.querySelector("#frame")?.addEventListener("change", (ev) => {
      frame = Number(ev.target.value);
      d.querySelector("#original-image").src = asset(
        `assets/world/hotel-${frame}.jpg`,
      );
      d.querySelector(".camera-overlay").firstChild.textContent =
        "AURELIA / CAM 02 · 18 OCT " +
        { 0: "00:24:56", 4: "00:25:00", 8: "00:25:04" }[frame];
      point = null;
      d.querySelector(".inspection-mark").hidden = true;
      d.querySelector("#point-feedback").textContent =
        "Frame changed. Mark a detail in this original.";
    });
  }
  d.querySelector("#retain").onclick = () => {
    const r = E.observe(
      id,
      d.querySelector("#reading").value,
      point,
      d.querySelector("#observation-note").value,
      { frame, mode: textMode ? "text" : "marked" },
    );
    toast(r.message);
    if (r.ok) {
      d.querySelector("#retain").textContent = "Retained ✓";
      window.dispatchEvent(new Event("observation-retained"));
    }
  };
  d.querySelector("#recover-phone")?.addEventListener("click", () => {
    E.flag("phone");
    render();
    toast("Read-only phone copy recovered. The original remains sealed.");
    d.close();
    phone.open("lock");
  });
  if (audio) {
    d.querySelector("#play-source").onclick = () => {
      const item = A.getManifest()?.clips?.[id.slice(6)],
        range = d.querySelector("#audio-position");
      range.max = item?.duration || 1;
      A.play(id.slice(6), (time) => {
        range.value = time;
        d.querySelector("#audio-time").textContent =
          Math.floor(time) + " seconds";
      });
    };
    d.querySelector("#audio-position").oninput = (ev) =>
      A.seek(Number(ev.target.value));
    d.addEventListener("close", A.pause);
    d.querySelector("#pause-source").onclick = A.pause;
    d.querySelector("#read-sound").onclick = () => {
      E.soundInspected(id.slice(6));
      toast("Transcript and sound description inspected.");
    };
  }
}
function records() {
  const phoneOriginals = new Set([
    "room-before",
    "shelf-before",
    "window-memory",
    "room-prepared",
    "trip",
    "hotel-receipt",
    "rider",
    ...C.notes,
  ]);
  const sources = Object.values(C.sources).filter(
    (s) =>
      E.visible(s) &&
      !s.id.startsWith("msg.") &&
      !s.id.startsWith("calendar.") &&
      s.kind !== "message" &&
      !phoneOriginals.has(s.id),
  );
  const groups = [
    [
      "Scene contact sheet",
      sources.filter(
        (s) => s.id.startsWith("scene-") || s.id === "phone-object",
      ),
    ],
    ["Surveillance desk", sources.filter((s) => s.kind === "surveillance")],
    ["Recording examination", sources.filter((s) => s.kind === "audio")],
    [
      "Released originals",
      sources.filter(
        (s) =>
          !s.id.startsWith("scene-") &&
          s.id !== "phone-object" &&
          !["surveillance", "audio"].includes(s.kind),
      ),
    ],
  ].filter(([, items]) => items.length);
  const d = modal(
    "Records room / retained originals",
    `<div class="records-room"><p class="eyebrow">MAJOR CRIME / EXAMINATION DESK</p><p>Request an original, inspect its actual contents and keep the details you need. Personal material remains in Iris’s phone.</p>${groups.map(([title, items]) => `<section class="records-drawer"><h2>${e(title)}</h2><div class="records-index">${items.map((s) => `<button data-source="${e(s.id)}">${s.image ? `<img src="assets/world/${s.image}.jpg" alt="">` : ""}<span>${e(s.kind)}</span><b>${e(s.title)}</b><small>${e(s.meta)}</small></button>`).join("")}</div></section>`).join("")}</div>`,
    true,
  );
  bindSources(d);
}

function casebook() {
  const s = E.state;
  const d = modal(
    "Detective Dima / working casebook",
    `<div class="casebook"><section><p class="eyebrow">CURRENT LINES OF INQUIRY</p>${
      E.availableLeads()
        .map(
          (p) =>
            `<button class="lead" data-puzzle="${p.id}"><b>${e(p.title)}</b><span>${e(p.prompt)}</span></button>`,
        )
        .join("") ||
      "<p>The current account is complete. Review your sources or the final record.</p>"
    }<details><summary>Revisit completed comparisons</summary>${C.puzzles
      .filter((p) => s.findings[p.id])
      .map((p) => button(p.title, `data-puzzle="${p.id}"`))
      .join(
        "",
      )}</details><details><summary>Revisit field scenes</summary>${C.scenes
      .filter((scene) => scene.chapter <= s.chapter)
      .map(
        (scene) =>
          `<button data-scene="${scene.chapter}">${e(scene.title)}</button>`,
      )
      .join(
        "",
      )}</details><h2>Private notes</h2><textarea id="case-notes" rows="7" placeholder="Keep your questions, uncertainties and connections here.">${e(s.notes)}</textarea><button id="open-chronology">Open your working chronology</button><button id="new-theory">Add a tentative theory</button><div id="theories">${s.theories
      .map(
        (t) =>
          `<article class="theory" data-theory="${t.id}"><input class="theory-title" aria-label="Theory title" value="${e(t.title)}"><select class="theory-status" aria-label="Theory status">${["open", "testing", "reconsidered", "supported"].map((v) => `<option ${t.status === v ? "selected" : ""}>${v}</option>`).join("")}</select><textarea class="theory-note" aria-label="Theory notes">${e(t.note)}</textarea><p>Personal theory — the game does not evaluate free text.</p><div>${t.links
            .map((l) => {
              const o = s.observations.find((o) => o.id === l.id);
              return o
                ? `<button data-source="${o.source}">${e(l.role)} · ${e(C.sources[o.source].title)}</button>`
                : "";
            })
            .join(
              "",
            )}</div><label>Attach retained observation<select class="theory-link"><option value="">Choose a source detail</option>${s.observations.map((o) => `<option value="${o.id}">${e(C.sources[o.source].title + " / " + C.sources[o.source].choices[o.reading])}</option>`).join("")}</select></label><select class="theory-role" aria-label="Role of attached observation"><option value="support">Supporting</option><option value="challenge">Contradicting</option><option value="context">Context / uncertain</option></select><button class="attach">Attach</button></article>`,
      )
      .join(
        "",
      )}</div></section><section class="retained-pages"><h2>Source-linked observations</h2>${s.observations.map((o) => `<article class="retained-observation"><small>${e(o.id)} / ${e(C.sources[o.source].kind)}</small><h3>${e(C.sources[o.source].choices[o.reading])}</h3>${o.note ? `<p>${e(o.note)}</p>` : ""}<button data-source="${o.source}">↗ ${e(C.sources[o.source].title)}</button></article>`).join("") || "<p>No observations yet. Inspect originals, then retain the details you want to compare.</p>"}</section></div>`,
    true,
  );
  bindSources(d);
  d.querySelectorAll("[data-scene]").forEach(
    (b) => (b.onclick = () => arrival(Number(b.dataset.scene))),
  );
  d.querySelector("#case-notes").oninput = (ev) => {
    s.notes = ev.target.value;
    E.save();
  };
  d.querySelector("#open-chronology").onclick = chronology;
  d.querySelector("#new-theory").onclick = () => {
    E.addTheory("Untitled theory", "");
    d.close();
    casebook();
  };
  d.querySelectorAll("[data-theory]").forEach((el) => {
    const t = s.theories.find((t) => t.id === el.dataset.theory);
    for (const [sel, key] of [
      [".theory-title", "title"],
      [".theory-note", "note"],
      [".theory-status", "status"],
    ])
      el.querySelector(sel).oninput = (ev) => {
        t[key] = ev.target.value;
        E.save();
      };
    el.querySelector(".attach").onclick = () => {
      const id = el.querySelector(".theory-link").value;
      if (!id) return;
      const role = el.querySelector(".theory-role").value;
      t.links = t.links.filter((l) => l.id !== id);
      t.links.push({ id, role });
      E.save();
      d.close();
      casebook();
    };
  });
}
function chronology() {
  const s = E.state;
  const d = modal(
    "Working chronology / your reconstruction",
    `<div class="chronology"><p class="eyebrow">PERSONAL WORKING RECORD / NOT AN AUTOMATIC FINDING</p><h2>The night, in your own order</h2><p>Place documented events or uncertain hypotheses beside their sources. These notes do not replace the authored evidence comparisons.</p><div class="chronology-events">${s.chronology.map((v, i) => `<article data-event="${e(v.id)}"><div><label>October<select class="event-day">${[17, 18, 19].map((day) => `<option ${day === v.day ? "selected" : ""}>${day}</option>`).join("")}</select></label><label>Time<input class="event-time" type="time" value="${e(v.time)}"></label><label><input class="event-uncertain" type="checkbox" ${v.uncertain ? "checked" : ""}> Uncertain</label></div><label>Event / account<textarea class="event-title" rows="2">${e(v.title)}</textarea></label><label>Original support<select class="event-source"><option value="">No source attached / hypothesis</option>${s.observations.map((o) => `<option value="${o.id}" ${v.source === o.id ? "selected" : ""}>${e(C.sources[o.source].title + " / " + C.sources[o.source].choices[o.reading])}</option>`).join("")}</select></label>${button("Open original", 'class="event-open" ' + (!v.source ? "disabled" : ""))}<button class="event-up" ${i === 0 ? "disabled" : ""}>Move earlier</button><button class="event-down" ${i === s.chronology.length - 1 ? "disabled" : ""}>Move later</button><button class="event-remove">Remove personal event</button></article>`).join("") || "<p>No events placed yet. Use the records to build your own account of the night.</p>"}</div><button id="new-event">Place an event</button><p>Time and order remain yours to interpret. The game will not silently convert these notes into confirmed facts.</p></div>`,
    true,
  );
  bindSources(d);
  const refresh = () => {
    E.save();
    d.close();
    chronology();
  };
  d.querySelector("#new-event").onclick = () => {
    s.chronology.push({
      id: "event" + Date.now(),
      day: 18,
      time: "",
      title: "",
      source: "",
      uncertain: true,
    });
    refresh();
  };
  d.querySelectorAll("[data-event]").forEach((el) => {
    const v = s.chronology.find((v) => v.id === el.dataset.event);
    for (const [selector, key] of [
      [".event-day", "day"],
      [".event-time", "time"],
      [".event-title", "title"],
      [".event-source", "source"],
      [".event-uncertain", "uncertain"],
    ])
      el.querySelector(selector).oninput = (ev) => {
        v[key] =
          key === "day"
            ? Number(ev.target.value)
            : key === "uncertain"
              ? ev.target.checked
              : ev.target.value;
        E.save();
        el.querySelector(".event-open").disabled = !v.source;
      };
    el.querySelector(".event-open").onclick = () => {
      const o = s.observations.find((o) => o.id === v.source);
      if (o) openSource(o.source);
    };
    el.querySelector(".event-up").onclick = () => {
      const i = s.chronology.indexOf(v);
      [s.chronology[i - 1], s.chronology[i]] = [
        s.chronology[i],
        s.chronology[i - 1],
      ];
      refresh();
    };
    el.querySelector(".event-down").onclick = () => {
      const i = s.chronology.indexOf(v);
      [s.chronology[i + 1], s.chronology[i]] = [
        s.chronology[i],
        s.chronology[i + 1],
      ];
      refresh();
    };
    el.querySelector(".event-remove").onclick = () => {
      s.chronology = s.chronology.filter((x) => x !== v);
      refresh();
    };
  });
}
function select(name, label, options, value = "") {
  return `<label>${e(label)}<select name="${name}"><option value="">Choose…</option>${Object.entries(
    options,
  )
    .map(
      ([k, v]) =>
        `<option value="${e(k)}" ${value === k ? "selected" : ""}>${e(v)}</option>`,
    )
    .join("")}</select></label>`;
}
function openPuzzle(id) {
  const p = C.puzzles.find((p) => p.id === id);
  if (!E.visible(p)) return toast("Follow the available lead first.");
  const a = E.state.drafts[id] || {};
  let controls = "";
  if (p.type === "evidence") {
    for (const key of Object.keys(p.slots))
      controls += select(
        "ref." + key,
        key + " / cite an observation",
        Object.fromEntries(
          E.state.observations.map((o) => [
            o.id,
            C.sources[o.source].title +
              " — " +
              C.sources[o.source].choices[o.reading],
          ]),
        ),
        a.refs?.[key],
      );
    controls += select(
      "account",
      "Your bounded interpretation",
      p.accounts,
      a.account,
    );
  }
  if (p.type === "order")
    controls = `<p>Select events in chronological order. You can reset and try another sequence.</p><div id="sequence">${e((a.order || []).map((v) => p.items[v]).join(" → "))}</div>${Object.entries(
      p.items,
    )
      .map(([k, v]) => button(v, `data-order="${k}"`))
      .join("")}<button type="button" id="reset-order">Reset sequence</button>`;
  if (["code", "morse", "lock"].includes(p.type))
    controls = `${p.type === "morse" ? '<details><summary>Morse reference alphabet</summary><p class="morse-alphabet">A .− · B −... · C −.−. · D −.. · E . · F ..−. · G −−. · H .... · I .. · J .−−− · K −.− · L .−.. · M −− · N −. · O −−− · P .−−. · Q −−.− · R .−. · S ... · T − · U ..− · V ...− · W .−− · X −..− · Y −.−− · Z −−..</p></details>' : ""}<label>${p.type === "lock" ? "Four-wheel setting" : "Recovered reference"}<input name="value" value="${e(a.value || "")}" ${p.type === "lock" ? 'inputmode="numeric" maxlength="4"' : ""} autocomplete="off"></label>`;
  if (p.type === "lock")
    controls =
      `<div class="physical-lock"><p>RETAINED WORKSHOP CASE / FOUR WHEELS</p><div class="lock-wheels">${Array.from({ length: 4 }, (_, i) => `<label>Wheel ${i + 1}<select data-wheel="${i}" aria-label="Lock wheel ${i + 1}">${Array.from({ length: 10 }, (_, n) => `<option value="${n}" ${(a.value || "0000")[i] === String(n) ? "selected" : ""}>${n}</option>`).join("")}</select></label>`).join("")}</div><span class="lock-clasp" aria-hidden="true"></span></div>` +
      controls;
  if (p.type === "timing")
    controls = `<label>Corrected crossing time<input name="time" placeholder="HH:MM" value="${e(a.time || "")}"></label><label>Minutes after independent arrival<input name="gap" inputmode="numeric" value="${e(a.gap || "")}"></label>${select("claim", "What does the interval establish?", { possible: "Compatible with the journey; identity remains unproven", identity: "Proves the person’s identity", impossible: "Makes this journey impossible" }, a.claim)}`;
  if (p.type === "trace")
    controls =
      traceSheet() +
      select(
        "sample",
        "Compatible reference sole",
        {
          A: "Reference A — straight bars / square corner",
          B: "Reference B — chevrons / complete heel",
          C: "Reference C — angled bars / worn outer corner",
        },
        a.sample,
      ) +
      select(
        "claim",
        "Bounded account",
        {
          delivery: "Compatible with the independently recorded delivery",
          identity: "Identifies the wearer by the tread alone",
          none: "Excludes all recorded deliveries",
        },
        a.claim,
      );
  if (p.type === "plan")
    controls = `${circulation(true)}<p>Trace connected places in travel order; compare both original plans.</p><div id="sequence">${e((a.route || []).join(" → "))}</div>${["front", "service", "landing", "apartment", "sealed"].map((v) => button(v, `data-route="${v}"`)).join("")}<button type="button" id="reset-order">Reset route</button>`;
  if (p.type === "audio")
    controls = select(
      "place",
      "Matching background reference",
      {
        apartment: "Apartment reference",
        hotel: "Hotel reference",
        neither: "Neither reference",
      },
      a.place,
    );
  if (p.type === "case")
    controls =
      select(
        "person",
        "Attribution supported by the independent records",
        Object.fromEntries(C.contacts.map((c) => [c.id, c.name])),
        a.person,
      ) +
      select(
        "act",
        "Support for the consequential act",
        {
          physical: "Combined object, clinical and custody findings",
          print: "Old contact impression alone",
          rumour: "An uncorroborated private suspicion",
        },
        a.act,
      ) +
      select(
        "later",
        "The apparent later-life activity",
        {
          retry: "Delivery retry of an earlier source",
          live: "A newly captured live statement",
        },
        a.later,
      ) +
      select(
        "privacy",
        "Scope of the record",
        {
          separate:
            "Factual case and private source permission remain separate",
          publish: "Closure authorises publication of everything",
        },
        a.privacy,
      );
  if (p.type === "confront")
    controls = `<p>${e(C.ending.intro)}</p>${select("privacy", "Preserve the private family source", { sealed: "Keep the raw family source sealed", summary: "Provide a factual summary without the raw recording", consented: "Offer a consent-led private family listening" }, E.state.decisions.privacy)}<input type="hidden" name="action" value="present">`;
  const d = modal(
    p.title,
    `<div class="comparison"><p class="eyebrow">INVESTIGATIVE COMPARISON</p><h2>${e(p.title)}</h2><p>${e(p.prompt)}</p>${["room", "preparation"].includes(p.id) ? `<div class="photo-comparison">${(p.id === "room" ? ["room-before", "scene-wide"] : ["room-prepared", "scene-wide"]).map((id) => `<button type="button" data-source="${id}"><img src="assets/world/${C.sources[id].image}.jpg" alt="${e(C.sources[id].title)}"><span>${e(C.sources[id].meta)}</span></button>`).join("")}</div>` : ""}<div class="source-tabs">${p.sources.map((id) => button(C.sources[id].title, `data-source="${id}"`)).join("")}</div><form>${controls}<button type="submit">${p.type === "confront" ? "Present the supported account" : "Test this account"}</button><p id="comparison-feedback" role="status"></p></form><details class="optional-hint"><summary>Optional hint</summary><p>${e(p.hint)}</p></details><p class="comparison-note">Sources remain available while comparing. Personal notes are never treated as proof.</p></div>`,
    true,
  );
  bindSources(d);
  let sequence = [...(a.order || a.route || [])];
  d.querySelectorAll("[data-order],[data-route]").forEach(
    (b) =>
      (b.onclick = () => {
        const key = b.dataset.order || b.dataset.route;
        if (!sequence.includes(key)) sequence.push(key);
        E.draft(id, p.type === "plan" ? "route" : "order", sequence);
        d.querySelector("#sequence").textContent = sequence
          .map((k) => p.items?.[k] || k)
          .join(" → ");
      }),
  );
  d.querySelector("#reset-order")?.addEventListener("click", () => {
    sequence = [];
    E.draft(id, p.type === "plan" ? "route" : "order", []);
    d.querySelector("#sequence").textContent = "";
  });
  const updateCitations = () => {
    d.querySelectorAll('select[name^="ref."]').forEach((select) => {
      const old = select.value;
      select.innerHTML =
        '<option value="">Choose…</option>' +
        E.state.observations
          .map(
            (o) =>
              `<option value="${o.id}">${e(C.sources[o.source].title + " — " + C.sources[o.source].choices[o.reading])}</option>`,
          )
          .join("");
      select.value = old;
    });
  };
  window.addEventListener("observation-retained", updateCitations);
  d.addEventListener("close", () =>
    window.removeEventListener("observation-retained", updateCitations),
  );
  d.querySelectorAll("[data-wheel]").forEach(
    (w) =>
      (w.onchange = () => {
        const value = [...d.querySelectorAll("[data-wheel]")]
          .map((el) => el.value)
          .join("");
        d.querySelector("[name=value]").value = value;
        E.draft(id, "value", value);
      }),
  );
  const answer = () => {
    const r = {};
    for (const [k, v] of new FormData(d.querySelector("form"))) {
      if (k.startsWith("ref.")) {
        r.refs ??= {};
        r.refs[k.slice(4)] = v;
      } else r[k] = v;
    }
    if (p.type === "order") r.order = sequence;
    if (p.type === "plan") r.route = sequence;
    return r;
  };
  d.querySelector("form").oninput = () => {
    const r = answer();
    for (const [k, v] of Object.entries(r)) E.draft(id, k, v);
  };
  d.querySelector("form").onsubmit = (ev) => {
    ev.preventDefault();
    const r = answer();
    if (p.type === "confront") {
      if (!r.privacy)
        return toast("Choose how the private source should be held.");
      E.choices("privacy", r.privacy);
    }
    const result = E.solve(id, r);
    d.querySelector("#comparison-feedback").textContent = result.message;
    if (result.ok) {
      A.effect("discovery");
      document
        .querySelectorAll("dialog[data-transient]")
        .forEach((dialog) => dialog.close());
      if (result.chapterChanged) phone.dialog?.close();
      else if (phone.dialog?.open) phone.render();
      render();
      if (result.done) ending();
      else if (result.chapterChanged) arrival(result.chapter);
      else {
        const ch =
          C.chapters[
            (result.chapterChanged ? result.chapter - 1 : result.chapter) - 1
          ];
        modal(
          "Finding retained",
          `<div class="chapter-note"><p>${e(result.chapterChanged ? ch.response : "Your supported finding has been entered in the casebook. Other available leads remain open.")}</p><p>The originals and your observations remain available for review.</p></div>`,
        );
      }
    }
  };
}
function people() {
  const d = modal(
    "Voluntary conversations",
    `<div class="people-list">${
      Object.entries(C.interviews)
        .filter(([, v]) => E.visible(v))
        .map(
          ([id, v]) =>
            `<button data-person="${id}"><img src="assets/portraits/${id}.png" alt=""><span><b>${e(v.name)}</b><small>${e(v.role)}</small></span></button>`,
        )
        .join("") ||
      "<p>Inspect the available personal material first. Conversations become available as you establish relevant leads.</p>"
    }</div>`,
  );
  d.querySelectorAll("[data-person]").forEach(
    (b) => (b.onclick = () => interview(b.dataset.person)),
  );
}
function interview(id) {
  const person = C.interviews[id];
  if (!E.visible(person)) return;
  const d = modal(
    person.name,
    `<div class="interview"><img src="assets/portraits/${id}.png" alt="${e(person.name)}"><section><p class="eyebrow">${e(person.role)}</p><h2>${e(person.name)}</h2><div id="spoken" aria-live="polite">${e(person.opening)}</div><button id="replay-talk">Replay voice</button><div class="questions">${person.questions.map(([q, , source], i) => (!source || E.state.visited.includes(source) ? button(q, `data-question="${i}"`) : `<p class="interview-locked">A more specific question requires inspecting its original record.</p>`)).join("")}</div><label>Present an inspected original<select id="present-source"><option value="">Choose an available source</option>${Object.keys(
      person.present,
    )
      .filter(
        (source) =>
          E.visible(C.sources[source]) && E.state.visited.includes(source),
      )
      .map(
        (source) =>
          `<option value="${source}">${e(C.sources[source].title)}</option>`,
      )
      .join(
        "",
      )}</select></label><button id="present-evidence">Ask about this source</button></section></div>`,
    true,
  );
  let clip = "talk." + id + ".open";
  E.rememberTalk(id, "open");
  d.querySelector("#replay-talk").onclick = () => A.play(clip);
  d.querySelectorAll("[data-question]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.question);
        d.querySelector("#spoken").textContent = person.questions[i][1];
        clip = "talk." + id + ".q" + i;
        E.rememberTalk(id, "q" + i);
        if (E.state.sound.enabled) A.play(clip);
      }),
  );
  d.querySelector("#present-evidence").onclick = () => {
    const source = d.querySelector("#present-source").value;
    if (!source) return;
    d.querySelector("#spoken").textContent = person.present[source];
    clip = "talk." + id + ".e." + source;
    E.rememberTalk(id, source);
    if (E.state.sound.enabled) A.play(clip);
  };
}
function arrival(chapter) {
  const scene = C.scenes.find((s) => s.chapter === chapter);
  if (!scene) return;
  const d = modal(
    scene.title,
    `<div class="arrival-scene"><img src="assets/world/${scene.image}.jpg" alt="Investigation location"><div><p class="eyebrow">CHAPTER ${chapter} / FIELD NOTES</p><h1>${e(scene.title)}</h1><p>${e(scene.text)}</p><button id="continue-investigation">Continue the investigation</button></div></div>`,
    true,
  );
  d.querySelector("#continue-investigation").onclick = () => d.close();
  const key = "arrival." + chapter;
  if (!E.state.seenResponses.includes(key)) {
    E.state.seenResponses.push(key);
    E.save();
  }
}
function ending() {
  const choice = {
    sealed:
      "The private recording remains sealed. The family receives the supported factual account.",
    summary:
      "A factual summary is prepared. The raw family recording is not made public.",
    consented:
      "A private listening is offered to the family. Participation and permission remain theirs to decide.",
  }[E.state.decisions.privacy];
  const d = modal(
    "The final record",
    `<div class="ending-copy"><p class="eyebrow">THE EMPTY CHAIR</p><section id="ending-conversation"><h1>The account that remains</h1><p id="ending-response" aria-live="polite">${e(C.ending.response)}</p><button id="ending-audio">Hear the response</button><div class="questions">${C.ending.questions.map(([q], i) => button(q, `data-ending-question="${i}"`)).join("")}</div><p>You may ask each question, replay the response or continue. Factual closure does not depend on obtaining an admission.</p><button id="ending-next">Continue to the aftermath</button></section><section id="aftermath" hidden><h1>${e(C.ending.aftermath[0].title)}</h1><p>${e(C.ending.aftermath[0].text)}</p><p>${e(choice)}</p><button id="aftermath-next">Continue</button></section><section id="last-page" hidden><h1>${e(C.ending.aftermath[1].title)}</h1><p>${e(C.ending.aftermath[1].text)}</p><h2>${e(C.ending.last)}</h2><p>You may return to the casebook, conversations and original sources. Your investigation remains saved.</p></section></div>`,
    true,
  );
  let clip = "ending.julia";
  d.querySelector("#ending-audio").onclick = () => A.play(clip);
  d.querySelectorAll("[data-ending-question]").forEach(
    (b) =>
      (b.onclick = () => {
        const index = Number(b.dataset.endingQuestion);
        d.querySelector("#ending-response").textContent =
          C.ending.questions[index][1];
        clip = "ending.julia.q" + index;
        E.rememberTalk("julia", "ending.q" + index);
        if (E.state.sound.enabled) A.play(clip);
      }),
  );
  d.querySelector("#ending-next").onclick = () => {
    A.stopVoice();
    d.querySelector("#ending-conversation").hidden = true;
    d.querySelector("#aftermath").hidden = false;
    d.scrollTop = 0;
  };
  d.querySelector("#aftermath-next").onclick = () => {
    d.querySelector("#aftermath").hidden = true;
    d.querySelector("#last-page").hidden = false;
    d.scrollTop = 0;
  };
}

function settings() {
  const d = modal(
    "Sound & saved investigation",
    `<div class="settings"><label><input id="sound-enabled" type="checkbox" ${E.state.sound.enabled ? "checked" : ""}> Enable atmosphere and automatic interview voices</label><label>Recording volume<input id="volume" type="range" min="0" max="1" step=".05" value="${E.state.sound.volume}"></label><label>Atmosphere volume<input id="music-volume" type="range" min="0" max=".4" step=".02" value="${E.state.sound.music}"></label><p>This narrative edition saves separately on this browser. Download a backup before moving devices.</p><button id="export">Download save backup</button><label>Restore this edition’s backup<input id="import" type="file" accept="application/json"></label><p id="backup-feedback" role="status"></p><button id="replay-opening">Revisit opening briefing</button>${E.state.findings.confrontation ? '<button id="revisit-ending">Revisit final record</button>' : ""}</div>`,
  );
  d.querySelector("#sound-enabled").onchange = (ev) =>
    A.setSound(ev.target.checked);
  d.querySelector("#volume").oninput = (ev) => A.setVolume(ev.target.value);
  d.querySelector("#music-volume").oninput = (ev) =>
    A.setMusicVolume(ev.target.value);
  d.querySelector("#export").onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(E.state)], { type: "application/json" }),
    );
    a.download = "last-archive-casework-save.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  d.querySelector("#import").onchange = async (ev) => {
    try {
      const raw = JSON.parse(await ev.target.files[0].text());
      if (!E.importGame(raw)) throw Error();
      d.close();
      render();
      toast("This edition’s investigation restored.");
    } catch {
      d.querySelector("#backup-feedback").textContent =
        "This is not a valid backup for this narrative edition. Your existing save has been preserved.";
    }
  };
  d.querySelector("#replay-opening").onclick = () => {
    E.state.intro = 0;
    E.save();
    d.close();
    render();
  };
  d.querySelector("#revisit-ending")?.addEventListener("click", ending);
}
window.addEventListener("storage-unavailable", () =>
  toast(
    "This browser could not store progress. Keep this tab open and download a save backup from Settings.",
  ),
);
window.addEventListener("audio-error", () =>
  toast(
    "This recording could not play. The full transcript remains available.",
  ),
);
A.initAudio().then(render);
