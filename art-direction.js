/* THE LAST ARCHIVE / After-hours archive desk.
 * Composition and material treatments only. STORY, E and saved gameplay remain authoritative.
 */
const artView = view;
view = function (name) {
  artView(name);
  const medium =
    {
      messages: "messages",
      gallery: "photography",
      photo: "inspection",
      document: "paper",
      calendar: "calendar",
      audio: "tape",
      interview: "interview",
      puzzle: "analysis",
      analysis: "analysis",
      analysis: "analysis",
      timeline: "timeline",
      board: "board",
      profiles: "dossier",
      evidence: "paper",
      chapters: "chapters",
      ending: "ending",
      map: "map",
      social: "social",
      home: "index",
      lock: "title",
    }[name] || "device";
  document.body.dataset.medium = medium;
  document.body.dataset.world = [
    "messages",
    "social",
    "device",
    "calendar",
    "tape",
  ].includes(medium)
    ? "device"
    : "archive";
};
// Existing app handlers still provide all navigation, discovery and save actions.
home = function () {
  view("home");
  const apps = STORY.apps.filter((a) => E.vis({ ch: a[3] }));
  const phoneApps = apps.filter(
    (a) => !["ev", "int", "pz", "map", "lab", "journal"].includes(a[0]),
  );
  const caseApps = apps.filter((a) =>
    ["ev", "int", "pz", "map", "lab", "journal"].includes(a[0]),
  );
  const entry = ([id, name, on], i) =>
    `<button ${on === 0 ? "disabled" : `onclick="open_('${id}')"`} class="index-entry"><span class="index-number">${String(i + 1).padStart(2, "0")}</span><span>${esc(name)}</span><span class="index-arrow" aria-hidden="true">↗</span></button>`;
  scr.innerHTML = `<div class="archive-index"><section class="index-cover"><img src="assets/photos/P01.jpg" alt="Iris's living room, from her camera roll"><span class="contact-sheet-code">IRIS VASILESCU / PERSONAL ARCHIVE</span><h1>A life.<br><em>Interrupted.</em></h1><p>THE LAST ARCHIVE<br><span>Vespera · A recovered device</span></p><button class="cover-open" onclick="document.querySelector('.index-catalogue').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})">Open the device records ↓</button><span class="cover-corner">I / IX</span></section><section class="index-catalogue"><div class="index-intro"><span class="eyebrow">THE INVESTIGATION CONTINUES</span><p>What remains<br>is <em>never everything.</em></p></div>${banner()}<div class="section-label"><span>01 / THE DEVICE</span><span>OPEN A RECORD</span></div><div class="grid archive-apps">${phoneApps.map(entry).join("")}</div><div class="section-label"><span>02 / YOUR INVESTIGATION</span><span>MAKE IT CONNECT</span></div><div class="grid archive-tools">${caseApps
    .concat([["nb", "Notebook"]])
    .map(entry)
    .join(
      "",
    )}<button class="index-entry" onclick="profiles()"><span class="index-number">06</span><span>Subjects</span><span>↗</span></button></div><button class="index-entry" onclick="chapters()"><span class="index-number">IX</span><span>Chapter archive</span><span>↗</span></button></section></div>`;
};
lock = function () {
  view("lock");
  scr.innerHTML = `<section class="title-sequence"><div class="title-image"><img src="assets/photos/P10.jpg" alt="A quiet hotel street in Vespera at night"></div><div class="title-strip"><span>VESPERA / 19 OCTOBER</span><span>A RECOVERED DEVICE</span></div><div class="title-type"><span class="eyebrow">A PSYCHOLOGICAL INVESTIGATION</span><h1>The last<br><em>archive.</em></h1><p>Some lives leave a trace.<br>Some traces were left for you.</p></div><button class="notif title-notification" onclick="S.unlocked=true;E.save();thread('moth')"><span class="notification-source">02:14 / INCOMING MESSAGE</span><b>MOTH</b><p>You do this for a living.<br>Iris's backup is attached.</p><span class="notification-action">OPEN THE ARCHIVE <span aria-hidden="true">→</span></span></button><span class="title-edition">THE LAST ARCHIVE — A STORY IN NINE CHAPTERS<br>Headphones recommended · Saves on this device</span></section>`;
};
const originalChapterTransition = chapterTransition;
chapterTransition = function (n) {
  originalChapterTransition(n);
  const d = $("#chapter-dialog");
  if (d && d.open) {
    d.classList.add("chapter-slate");
    d.insertAdjacentHTML(
      "afterbegin",
      `<div class="chapter-numeral" aria-hidden="true">${String(n).padStart(2, "0")}</div><div class="chapter-rule"></div>`,
    );
  }
};
// An inspectable photograph takes over the work surface, rather than living in a phone-shaped modal.
const archivePhoto = photo;
photo = function (id, z = 1) {
  archivePhoto(id, z);
  const p = STORY.photos.find((p) => p.id === id);
  scr.insertAdjacentHTML(
    "afterbegin",
    `<div class="inspection-label"><span>PHOTOGRAPHIC RECORD / ${id}</span><span>IRIS'S CAMERA ROLL</span></div>`,
  );
  const f = $("#photo-frame");
  if (f) {
    f.setAttribute("tabindex", "0");
    f.onkeydown = (e) => {
      if (e.key === "+" || e.key === "=") photoZoom(1.4);
      if (e.key === "-") photoZoom(0.7);
      if (e.key === "0") photoZoom(0);
    };
  }
};
// Give renderers that predate view() a material identity, without changing their contents or handlers.
const materialRenderers = {
  cons: "profiles",
  calls: "calls",
  callD: "call",
  mail: "mail",
  mailOpen: "letter",
  notes: "notes",
  ints: "interviews",
  pzs: "challenges",
  files: "files",
  fileOpen: "document",
  web: "browser",
  page: "webpage",
  aud: "audio-list",
  nbk: "notebook",
  objectives: "objectives",
};
for (const [name, identity] of Object.entries(materialRenderers)) {
  const original = window[name];
  window[name] = function (...args) {
    view(identity);
    const result = original(...args);
    document.body.dataset.medium =
      {
        letter: "letter",
        document: "paper",
        notebook: "notebook",
        notes: "notes",
        mail: "mail",
        profiles: "dossier",
        interviews: "dossier",
        files: "files",
        objectives: "analysis",
        challenges: "analysis",
        browser: "browser",
        webpage: "letter",
        "audio-list": "tape",
      }[identity] || "device";
    document.body.dataset.world = [
      "device",
      "mail",
      "browser",
      "notes",
      "tape",
    ].includes(document.body.dataset.medium)
      ? "device"
      : "archive";
    return result;
  };
}
const boardMaterial = drawBoard;
drawBoard = function () {
  boardMaterial();
  const svg = $("#bd");
  if (!svg) return;
  svg.querySelectorAll("g[data-id]").forEach((g, i) => {
    const id = g.dataset.id,
      pos = S.board[id];
    if (!pos) return;
    const [x, y] = pos,
      ev = STORY.evidence[id],
      image = g.querySelector("image"),
      person = id.startsWith("person:"),
      on = id === A || id === B;
    // The transparent circles keep the existing, tested gesture hit area and coordinate system.
    const rect = g.querySelector("rect");
    rect.setAttribute(
      "fill",
      image ? "#e4dac1" : ev?.[1]?.includes("Messages") ? "#bfc9bd" : "#d8ccb0",
    );
    rect.setAttribute("stroke", on ? "#c76558" : "#685d48");
    rect.setAttribute("height", image ? "76" : "70");
    rect.setAttribute("width", image ? "82" : "88");
    rect.setAttribute("x", x - (image ? 41 : 44));
    if (image) {
      image.setAttribute("x", x - 37);
      image.setAttribute("y", y - 28);
      image.setAttribute("width", "74");
      image.setAttribute("height", person ? "51" : "48");
    } else {
      g.querySelectorAll("path").forEach((p) => p.remove());
      const found = Object.values(STORY.threads)
        .flatMap((t) => t.m)
        .find((m) => m[3] === id);
      const excerpt = found ? found[2] : ev?.[0] || id;
      g.querySelectorAll("text").forEach((t) => t.remove());
      const lines = [];
      let line = "";
      for (const word of excerpt.split(/\s+/)) {
        if ((line + " " + word).trim().length > 23) {
          lines.push(line);
          line = word;
        } else line = (line + " " + word).trim();
      }
      if (line) lines.push(line);
      const texts =
        `<text x="${x - 37}" y="${y - 20}" font-size="5" fill="#6c5440" font-family="monospace">${esc(id + " / " + (ev?.[1] || "RECORD").toUpperCase())}</text>` +
        lines
          .slice(0, 5)
          .map(
            (l, j) =>
              `<text x="${x - 37}" y="${y - 8 + j * 7.5}" font-size="5.6" fill="#30382f" font-family="${found ? "sans-serif" : "monospace"}">${esc(l)}${j === 4 && lines.length > 5 ? "…" : ""}</text>`,
          )
          .join("");
      g.insertAdjacentHTML("beforeend", texts);
    }
    // Material imperfections are deterministic; saved player positions remain exact.
    const angle = [-3, 2, -1, 4, -2, 1][i % 6];
    g.setAttribute("transform", `rotate(${angle},${x},${y})`);
    const tape = `<path d="M${x - 15} ${y - 37}l27 -2 2 9 -29 2z" fill="#bdae8290"/>`;
    g.insertAdjacentHTML("beforeend", tape);
    if (on)
      g.insertAdjacentHTML(
        "beforeend",
        `<path d="M${x - 43} ${y + 40}q43 5 88 -1" fill="none" stroke="#c76558" stroke-width="1.2"/>`,
      );
  });
};
// The selected medium is visible in the workbench's running folio, rather than a dashboard status panel.
const folio = document.createElement("div");
folio.id = "running-folio";
folio.setAttribute("aria-hidden", "true");
document.body.appendChild(folio);
new MutationObserver(() => {
  const title = scr.querySelector(".bar h3")?.textContent;
  folio.textContent = title
    ? `THE LAST ARCHIVE / ${title.toUpperCase()} / ${String(E.chapter()).padStart(2, "0")}`
    : "THE LAST ARCHIVE / VESPERA";
}).observe(scr, { childList: true });
if(!STORY.narrativeEdition){S.unlocked ? home() : lock();}
// Small physical cues on the work surface reuse existing chapter-one photography.
const deskPrint = document.createElement("figure");
deskPrint.id = "desk-print";
deskPrint.innerHTML =
  '<img src="assets/photos/P03.jpg" alt="Morning light from Iris’s camera roll"><figcaption>IMG / PERSONAL ARCHIVE<br>THE WORLD OUTSIDE HER WINDOW</figcaption>';
$("#stage").appendChild(deskPrint);
// Arrange newly pinned objects as a loose composition. Never rearrange a player's saved board.
const materialPlace = E.place;
E.place = function (id, x, y) {
  if (x === undefined && !S.board[id]) {
    const positions = [
      [130, 115],
      [310, 175],
      [455, 95],
      [175, 340],
      [370, 315],
      [490, 430],
      [60, 450],
      [520, 240],
      [290, 460],
      [70, 265],
      [420, 470],
      [270, 75],
    ];
    const slot = positions.find(
      (p) =>
        !Object.values(S.board).some(
          (q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 85,
        ),
    );
    if (slot) [x, y] = slot;
  }
  return materialPlace(id, x, y);
};
const annotatedBoard = drawBoard;
drawBoard = function () {
  annotatedBoard();
  const svg = $("#bd");
  if (!svg) return;
  S.made.forEach((m) => {
    if (!m[3]) return;
    const [a, b] = m[0].split("~"),
      p = S.board[a],
      q = S.board[b];
    if (!p || !q) return;
    const x = (p[0] + q[0]) / 2,
      y = (p[1] + q[1]) / 2;
    svg.insertAdjacentHTML(
      "beforeend",
      `<g pointer-events="none"><path d="M${x - 39} ${y + 5}l83 -3 -1 20 -80 3z" fill="#cbbc94"/><text x="${x - 34}" y="${y + 17}" font-family="Georgia,serif" font-style="italic" font-size="7" fill="#534c36">${esc(m[3].slice(0, 27))}${m[3].length > 27 ? "…" : ""}</text></g>`,
    );
  });
  svg.querySelectorAll("g[data-id]").forEach((g) => {
    g.ondblclick = () => {
      if (STORY.evidence[g.dataset.id]) evidenceDetail(g.dataset.id);
    };
  });
};
const focusableBoard = board;
board = function () {
  focusableBoard();
  const row = $("#bd")?.nextElementSibling;
  if (row)
    row.insertAdjacentHTML(
      "beforeend",
      '<button class="btn" onclick="toggleBoardFocus()">Focus board</button>',
    );
};
function toggleBoardFocus() {
  const on = document.body.classList.toggle("board-focus");
  if (on) {
    const btn = document.createElement("button");
    btn.id = "exit-board-focus";
    btn.className = "btn";
    btn.textContent = "Return to the desk";
    btn.onclick = () => toggleBoardFocus();
    document.body.appendChild(btn);
  } else $("#exit-board-focus")?.remove();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("board-focus"))
    toggleBoardFocus();
});
const leavingView = view;
view = function (name) {
  if (name !== "board" && document.body.classList.contains("board-focus"))
    toggleBoardFocus();
  leavingView(name);
};
// Keep the response choices next to the voice, rather than below the portrait's empty column.
const stagedInterview = talk;
talk = function (...args) {
  stagedInterview(...args);
  const scene = scr.querySelector(".interview-scene");
  if (!scene) return;
  const response = document.createElement("section");
  response.className = "interview-response";
  const quote = scene.querySelector(":scope > .m");
  if (quote) response.appendChild(quote);
  let next = scene.nextSibling;
  while (next) {
    const following = next.nextSibling;
    response.appendChild(next);
    next = following;
  }
  scene.appendChild(response);
};
files = function () {
  view("files");
  document.body.dataset.medium = "files";
  document.body.dataset.world = "archive";
  scr.innerHTML =
    bar("Files", "home()") +
    '<div class="document-drawer"><div class="eyebrow">THE DOCUMENT REGISTER / AVAILABLE RECORDS</div><h1>On the record.</h1>' +
    STORY.files
      .filter(visible)
      .map(
        (f, i) =>
          `<button class="th drawer-entry" onclick="fileOpen('${f.id}')"><span class="drawer-index">${String(i + 1).padStart(2, "0")}</span><span><b>${esc(f.n)}</b><small>${/csv$/.test(f.n) ? "DATA EXPORT" : "DOCUMENT"}${f.ev && S.ev.includes(f.ev) ? " / ARCHIVED" : ""}</small></span><span class="drawer-format">${f.n.split(".").pop().toUpperCase()}</span></button>`,
      )
      .join("") +
    "</div>";
};
aud = function () {
  view("audio-list");
  document.body.dataset.medium = "tape";
  document.body.dataset.world = "device";
  scr.innerHTML =
    bar("Audio", "home()") +
    '<div class="eyebrow">VOICE ARCHIVE / TRANSCRIPTS AVAILABLE</div><h1 class="tape-title">What was<br><em>left unsaid.</em></h1>' +
    STORY.audio
      .filter(visible)
      .map(
        (a, i) =>
          `<button class="th tape-entry" onclick="clip('${a.id}')"><span class="tape-spool" aria-hidden="true"></span><span><b>${esc(a.n)}</b><small>${esc(a.ts)}<br>${esc(a.src)}</small></span><span class="tape-side">${String(i + 1).padStart(2, "0")}</span></button>`,
      )
      .join("");
};
