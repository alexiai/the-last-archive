import { World, PLACES } from "./world.js";
import { STORY } from "./story.js";
import * as S from "./state.js";
import * as A from "./sound.js";
import { waveformMarkup, clockText, bindRecording } from "./recording.js";
import { bindWalkControls } from "./controls.js";
const ui = document.querySelector("#ui"),
  canvas = document.querySelector("#world");
const previousEdition = new URL(
  location.pathname.includes("/editions/")
    ? "../casework-preview/"
    : "../editions/casework-preview/",
  location.href,
).href;
let inspectionToken = 0;
let recordingDispose = null;
let walkDispose = null;
let world,
  mode = "loading",
  regions = {},
  returnFromPhoto = null,
  phoneRoute = "home",
  phoneThread = null,
  inspection = null,
  dialogue = null,
  answer = {},
  lastLine = null,
  statusTimer,
  objectiveShown = null;
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const button = (text, attrs = "") =>
  `<button type="button" ${attrs}>${esc(text)}</button>`;
function status(text) {
  const el = document.querySelector("#status");
  el.textContent = text;
  el.classList.add("visible");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => el.classList.remove("visible"), 3800);
}
function setMode(next) {
  walkDispose?.();
  walkDispose = null;
  recordingDispose?.();
  recordingDispose = null;
  ui.dataset.mode = next;
  if (next !== "inspect") inspectionToken++;
  mode = next;
  if (world) {
    world.setReducedMotion(S.state.reduced);
    if (next !== "dialogue") world.setSpeech(null);
    if (next !== "inspect") world.inspectionOrbit = null;
    world.interactive = next === "play";
    if (["title", "play", "inspect", "dialogue"].includes(next)) world.start();
    else world.stop();
  }
}
const noteLabels = {
  "scene-gap": [
    "IN THE ROOM",
    "A clear interval between the books on the lower shelf.",
  ],
  "scene-sofa": [
    "IN THE ROOM",
    "The sofa faces the window from the right side of the room.",
  ],
  "past-sofa": [
    "PHONE / 12 OCTOBER",
    "The sofa is across the back of the room.",
  ],
  "queued-shelf": [
    "UNSENT ORIGINAL",
    "A bronze L-shaped support is visible between the books.",
  ],
  "queued-sofa": [
    "UNSENT ORIGINAL",
    "The sofa is already on the right side of the room.",
  ],
  "queued-time": [
    "ORIGINAL CAPTURE INFORMATION",
    "17 October · 19:06. Pending delivery is a separate field.",
  ],
  mug: ["AT THE WINDOW", "A blue mug with a repaired handle."],
};
function retain(id) {
  if (S.retain(id)) {
    A.pencil();
    status("A source-linked observation has been written in your notebook.");
  } else status("This observation is already in your notebook.");
}
async function boot() {
  try {
    world = await new World(canvas, act, hover).load();
    await Promise.all([
      A.prepare(),
      fetch("assets/photos/regions.json")
        .then((r) => r.json())
        .then((v) => (regions = v)),
    ]);
    world.start();
    if (new URLSearchParams(location.search).has("test"))
      window.sceneplayView = world;
    window.addEventListener("walking", (e) => {
      A.step();
      A.ambience(e.detail);
    });
    window.addEventListener("manual-walk-end", (e) => {
      S.state.position = e.detail.place;
      S.state.freePose = e.detail.pose;
      S.save();
    });
    if (new URLSearchParams(location.search).has("capture")) {
      window.captureWorld = world;
      window.captureReady = true;
      return;
    }
    title();
  } catch (error) {
    console.error(error);
    setMode("error");
    ui.innerHTML = `<section class="loading"><h1>THE LAST ARCHIVE</h1><p>The 3D scene could not open.</p><p>This section needs WebGL 2 and its local scene assets. Your existing saves have not been changed.</p>${button("Try again", 'id="retry"')}<a href="${esc(previousEdition)}">Open the preserved previous edition</a></section>`;
    document.querySelector("#retry").onclick = () => location.reload();
  }
}
function title() {
  setMode("title");
  A.stopVoice();
  world.move("landing", true);
  world.entry.rotation.y = -0.16;
  world.renderer.shadowMap.needsUpdate = true;
  ui.innerHTML = `<section class="title"><span class="studio">A PSYCHOLOGICAL DETECTIVE ADVENTURE</span><h1>THE LAST<br>ARCHIVE</h1><p>A life leaves more than one account.</p>${S.state.started ? button("Continue", 'id="resume-game"') : ""}${button("New game", 'id="new-game"')}${button("Settings", 'id="title-settings"')}<small class="edition">SCENE-LED DEVELOPMENT EDITION · OPENING SECTION</small></section>`;
  ui.querySelector("#new-game").onclick = () => {
    if (
      S.state.started &&
      !confirm(
        "Start a new investigation in this scene-led edition? Its current save will be replaced. Earlier editions keep their own saves.",
      )
    )
      return;
    S.reset();
    objectiveShown = null;
    A.unlock();
    intro();
  };
  ui.querySelector("#resume-game")?.addEventListener("click", () => {
    A.unlock();
    if (!S.state.introSeen) intro();
    else resume();
  });
  ui.querySelector("#title-settings").onclick = () => settings(true);
}
function intro(replay = false) {
  setMode("intro");
  A.hush();
  world.stop();
  ui.innerHTML = `<section class="cinema"><video id="intro-film" playsinline preload="auto" poster="assets/films/poster.jpg" src="assets/films/arrival.mp4" aria-label="Original animated arrival at Iris's apartment"></video><div class="cinema-top"><span>VESPERA · SUNDAY 19 OCTOBER 2025<br>YOU ARE DETECTIVE ALEX DIMA</span><div>${button(S.state.sound ? "Sound on" : "Sound off", 'id="intro-sound"')}${button("Transcript", 'id="intro-transcript"')}${button("Skip introduction", 'id="skip-intro"')}</div></div><div class="cinema-name"><p>A LIFE LEAVES MORE THAN ONE ACCOUNT</p><h1>THE LAST ARCHIVE</h1></div><div class="subtitle" hidden><span class="speaker"></span><p></p></div>${button("Play introduction", 'class="film-play" id="film-play" hidden')}</section>`;
  const video = ui.querySelector("video"),
    play = ui.querySelector("#film-play"),
    sub = ui.querySelector(".subtitle");
  video.muted = !S.state.sound;
  video.volume = 0.85;
  const finish = () => {
    video.pause();
    video.ontimeupdate = null;
    video.onended = null;
    video.onerror = null;
    S.state.introSeen = true;
    if (!replay) S.state.position = "threshold";
    S.save();
    world.entry.rotation.y = -1.25;
    world.start();
    resume(!replay);
  };
  ui.querySelector("#skip-intro").onclick = finish;
  ui.querySelector("#intro-sound").onclick = () => {
    S.state.sound = !S.state.sound;
    video.muted = !S.state.sound;
    ui.querySelector("#intro-sound").textContent = S.state.sound
      ? "Sound on"
      : "Sound off";
    S.save();
  };
  ui.querySelector("#intro-transcript").onclick = () => {
    video.pause();
    play.hidden = false;
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.style.zIndex = "6";
    panel.innerHTML = `<div class="content">${button("Return to the film", 'class="close" id="close-film-transcript"')}<h1>Arrival / transcript</h1><p>Rain on the landing. A uniformed officer holds the scene. The door opens, and the detective enters the preserved apartment. The lamp remains on. The film ends at the doorway where play begins.</p>${STORY.intro.map((line) => `<p><small>${esc(line.who)}</small><br>${esc(line.text)}</p>`).join("")}</div>`;
    ui.querySelector(".cinema").append(panel);
    panel.querySelector("#close-film-transcript").onclick = () =>
      panel.remove();
  };
  video.onended = finish;
  video.ontimeupdate = () => {
    const line = STORY.intro.find(
      (l) => video.currentTime >= l.start && video.currentTime < l.end,
    );
    sub.hidden = !line;
    if (line) {
      sub.querySelector(".speaker").textContent = line.who;
      sub.querySelector("p").textContent = line.text;
    }
    ui.querySelector(".cinema-name")?.classList.toggle(
      "visible",
      video.currentTime > 41.5,
    );
  };
  video.onerror = () => {
    play.hidden = false;
    play.textContent = "Continue to the real-time scene";
    play.onclick = finish;
    sub.hidden = false;
    sub.querySelector("p").textContent =
      "The video could not load. Enter the scene; the assignment and every essential clue remain available.";
  };
  play.onclick = () => {
    play.hidden = true;
    video.play().catch(() => (play.hidden = false));
  };
  if (S.state.reduced || matchMedia("(prefers-reduced-motion: reduce)").matches)
    play.hidden = false;
  else video.play().catch(() => (play.hidden = false));
  window.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden && mode === "intro") {
        video.pause();
        play.hidden = false;
      }
    },
    { once: true },
  );
}
function resume(afterIntro = false) {
  // Petrescu returns to the clear wall-side post after letting Dima pass.
  world.officer.position.x = -1.78;
  const officerTarget = world.targets.find(
    (o) => o.userData.action === "officer",
  );
  if (officerTarget) officerTarget.position.x = -1.78;
  world.start();
  world.entry.rotation.y = -1.25;
  world.renderer.shadowMap.needsUpdate = true;
  world.move(S.state.position || "threshold", true);
  world.restorePose(S.state.freePose);
  A.setEnabled(S.state.sound);
  A.ambience(S.state.position);
  hud();
  if (afterIntro)
    speak("welcome", [
      [
        "Enter the apartment",
        () => {
          go("threshold");
        },
      ],
      [
        "Who called for help?",
        () => speak("family", [["I will look inside.", () => go("threshold")]]),
      ],
    ]);
}
function hud() {
  const showObjective = objectiveShown !== S.state.finding;
  objectiveShown = S.state.finding;
  A.setEnabled(S.state.sound);
  world.targets.forEach((o) => {
    if (o.userData.action?.startsWith("walk:")) o.visible = false;
  });
  setMode("play");
  ui.innerHTML = `<section class="hud"><div class="chapter-label">THE ROOM LEFT BEHIND<br>8 TEILOR STREET · 09:24</div>${button("Pause", 'class="menu-key" id="pause"')}<div class="objective ${showObjective ? "notice" : "quiet"}"><small>${S.state.finding ? "NEXT STEP" : "FIRST EXAMINATION"}</small>${S.state.finding ? "Return to the landing when you are ready to leave." : "Inspect the preserved room and the authorised phone copy. Bring a supported comparison to Petrescu."}</div><span class="reticle" aria-hidden="true"></span><button class="interaction" id="interaction" hidden></button><p class="view-instruction">Hold arrows to walk · drag the room to look<span class="desktop-instruction"><br>WASD walks · arrow keys look · E inspects</span></p><div class="walk-controls"><div class="movement">${button("← Look", 'id="look-left" aria-label="Look left"')}${button("Look →", 'id="look-right" aria-label="Look right"')}${button("Move", 'id="move-assist"')}</div><div class="walk-pad" role="group" aria-label="Walk">${button("↑", 'data-walk="forward" aria-label="Walk forward" aria-pressed="false"')}${button("←", 'data-walk="left" aria-label="Step left" aria-pressed="false"')}${button("↓", 'data-walk="backward" aria-label="Walk backward" aria-pressed="false"')}${button("→", 'data-walk="right" aria-label="Step right" aria-pressed="false"')}</div></div><div class="inventory">${button("Notebook", 'id="notebook"')}${S.state.phone ? button("Phone", 'id="pocket-phone"') : ""}</div></section>`;
  walkDispose = bindWalkControls(
    ui.querySelector(".walk-pad"),
    world,
    A.unlock,
  );
  ui.querySelector("#pause").onclick = () => settings(false);
  ui.querySelector("#pause").addEventListener("pointerdown", (ev) => {
    if (world.walkInput.forward || world.walkInput.side) {
      ev.preventDefault();
      settings(false);
    }
  });
  ui.querySelector("#notebook").onclick = notebook;
  ui.querySelector("#pocket-phone")?.addEventListener("click", () =>
    openPhone(S.state.phoneRoute, S.state.phoneThread, S.state.phoneNote),
  );
  ui.querySelector("#move-assist").onclick = navigation;
  ui.querySelector("#look-left").onclick = () =>
    (world.lookOffset.yaw = world.lookOffset.yaw + 0.3);
  ui.querySelector("#look-right").onclick = () =>
    (world.lookOffset.yaw = world.lookOffset.yaw - 0.3);
}
function hover(data) {
  if (mode !== "play") return;
  const b = ui.querySelector("#interaction");
  if (!b) return;
  b.hidden = !data;
  if (data) {
    b.textContent = data.label;
    b.onclick = () => act(data.action);
  }
}
function go(id) {
  world.setWalkInput();
  S.state.freePose = null;
  S.state.position = id;
  S.save();
  world.move(id, S.state.reduced);
  hud();
}
function act(action) {
  if (mode !== "play") return;
  A.unlock();
  if (action.startsWith("walk:")) {
    go(action.slice(5));
    return;
  }
  if (action === "door") {
    if (S.state.position === "landing") {
      go("threshold");
      A.latch();
    } else if (S.state.finding)
      speak("next", [
        ["Leave for the Aurelia", sectionEnd],
        ["Stay in the room a little longer", hud],
      ]);
    else go("landing");
    return;
  }
  if (action === "officer") {
    speak(S.state.finding ? "finding" : "welcome", officerChoices());
    return;
  }
  inspect(action);
}
function officerChoices() {
  return [
    [
      "What was changed after discovery?",
      () => speak("room", officerChoices()),
    ],
    ["Who was waiting for news?", () => speak("family", officerChoices())],
    [
      "I have a comparison to show you.",
      () =>
        speak("hypothesis", [
          ["Open my notebook", deduction],
          ["I need to look again.", hud],
        ]),
    ],
    ["Could you help me look at it differently?", hint],
    ...(S.state.finding
      ? [
          [
            "Arrange the next visit.",
            () =>
              speak("next", [
                ["Leave for the Aurelia", sectionEnd],
                ["Not yet.", hud],
              ]),
          ],
        ]
      : []),
    ["I will keep looking.", hud],
  ];
}
function speak(id, choices = []) {
  const entering = mode !== "dialogue";
  const line = STORY.dialogue[id];
  lastLine = id;
  setMode("dialogue");
  if (entering) frameOfficer(S.state.reduced);
  world.setSpeech(A.say(id), id);
  ui.innerHTML = `<section class="dialogue-space"><div class="dialogue"><span class="speaker">${esc(line.who)}</span><p class="line">${esc(line.text)}</p><div class="choices">${choices.map(([label], i) => button(label, `data-dialogue-choice="${i}"`)).join("")}</div><div class="dialogue-tools">${button("Replay voice", 'class="minor" id="replay-voice"')}${button(S.state.sound ? "Mute" : "Enable sound", 'class="minor" id="dialogue-sound"')}</div></div></section>`;
  choices.forEach(
    ([, fn], i) =>
      (ui.querySelector(`[data-dialogue-choice="${i}"]`).onclick = () => {
        A.stopVoice();
        fn();
      }),
  );
  ui.querySelector("#replay-voice").onclick = () =>
    world.setSpeech(A.say(id), id);
  ui.querySelector("#dialogue-sound").onclick = () => {
    S.state.sound = !S.state.sound;
    A.setEnabled(S.state.sound);
    S.save();
    ui.querySelector("#dialogue-sound").textContent = S.state.sound
      ? "Mute"
      : "Enable sound";
  };
}
function frameOfficer(instant = false) {
  world.focus(
    [-2.45, 1.65, -5.85],
    innerWidth > 600 || innerWidth > innerHeight
      ? [-2.12, 1.38, -4.62]
      : [-1.78, innerHeight < 700 ? 1.3 : 1.38, -4.84],
    instant,
  );
}
window.addEventListener("resize", () => {
  if (mode === "dialogue") frameOfficer(true);
});
function hint() {
  S.state.hint = Math.min(3, S.state.hint + 1);
  S.save();
  speak("hint" + S.state.hint, [["I will try that.", hud]]);
}
const INSPECTIONS = {
  shelf: {
    place: "shelf",
    pos: [0.95, 1.28, -1.83],
    look: [1.38, 1.07, -3.04],
    title: "The lower shelf",
    text: "The wood is unbroken. Between the books, a clear space interrupts the dust.",
    note: "scene-gap",
    label: "Keep this view",
  },
  sofa: {
    place: "room",
    pos: [0.25, 1.35, 1.5],
    look: [1.7, 0.65, -0.8],
    title: "The sofa",
    text: "Its seats face the window. From here, the shelves are behind its far end.",
    note: "scene-sofa",
    label: "Keep its position",
  },
  table: {
    place: "table",
    pos: [-0.65, 1.3, 1.05],
    look: [0.05, 0.62, 0],
    title: "A glass. A folded paper.",
    text: "A dry ring lies beside the glass. The small ordinary things are still where someone left them.",
    note: null,
  },
  desk: {
    place: "room",
    pos: [0.45, 1.4, 1.75],
    look: [0.55, 0.85, 2.64],
    title: "A place to listen",
    text: "Room tone. A kettle. Rain. Iris kept recordings of ordinary places. Headphones lie beside her listening notes. No entry here dates the recorder's last use.",
    note: null,
  },
  phone: {
    place: "phone",
    pos: [2.65, 1.25, 1.6],
    look: [2.1, 0.61, 1],
    title: "The authorised copy",
    text: "Device A-04. The laboratory prepared a read-only copy under the case warrant. The original stays sealed.",
    note: null,
  },
  mug: {
    place: "window",
    pos: [-2.6, 1.35, -0.4],
    look: [-3.22, 1.05, -1.22],
    title: "The blue mug",
    text: "A fine repair crosses the handle. Someone kept using it.",
    note: "mug",
    label: "Remember this",
  },
};
function inspect(id) {
  const item = INSPECTIONS[id];
  if (!item) return;
  inspection = id;
  setMode("inspect");
  const run = ++inspectionToken;
  const approached = world
    .move(item.place, S.state.reduced)
    .then(() => {
      if (mode === "inspect" && run === inspectionToken)
        return world.focus(item.pos, item.look, S.state.reduced);
    })
    .then(() => {
      if (mode === "inspect" && inspection === id && run === inspectionToken)
        world.beginInspection(item.look);
    });
  S.state.position = item.place;
  S.state.freePose = null;
  if (!S.state.visited.includes(id)) S.state.visited.push(id);
  S.save();
  ui.innerHTML = `<section class="inspection-space"><div class="inspection-caption"><small>LOOKING CLOSER</small><h2>${esc(item.title)}</h2><p>${esc(item.text)}</p>${item.note ? button(S.state.observations.includes(item.note) ? "View kept" : item.label, 'id="keep-view"') : ""}${id === "phone" ? button(S.state.phone ? "Open the copy" : "Take the authorised copy", 'id="take-phone"') : ""}${button("Lean closer", 'id="lean-closer"')}${button("Ease back", 'id="lean-back"')}${button("Step back", 'id="step-back"')}<p class="hint-quiet">Drag to lean around the detail. The original stays in place.</p></div></section>`;
  const controls = [
    ...ui.querySelectorAll("#keep-view,#take-phone,#lean-closer,#lean-back"),
  ];
  controls.forEach((b) => (b.disabled = true));
  approached.then(() => {
    if (mode === "inspect" && inspection === id && run === inspectionToken)
      controls.forEach((b) => (b.disabled = false));
  });
  ui.querySelector("#keep-view")?.addEventListener("click", () => {
    retain(item.note);
    ui.querySelector("#keep-view").textContent = "View kept";
  });
  ui.querySelector("#take-phone")?.addEventListener("click", () => {
    S.state.phone = true;
    S.save();
    openPhone("home");
  });
  ui.querySelector("#lean-closer").onclick = () => world.lean(-0.12);
  ui.querySelector("#lean-back").onclick = () => world.lean(0.12);
  ui.querySelector("#step-back").onclick = () => {
    world.move(item.place);
    hud();
  };
}
function navigation() {
  setMode("navigation");
  ui.innerHTML = `<section class="panel"><div class="content">${button("Return", 'class="close" id="return"')}<h1>Move through the room</h1><p>This is the navigation assist. You can also tap the floor and drag the view.</p><div class="access-route">${[
    ["landing", "The officer on the landing"],
    ["threshold", "The doorway"],
    ["room", "The room"],
    ["table", "The low table"],
    ["shelf", "The shelves"],
    ["phone", "The side table"],
    ["window", "The window"],
  ]
    .map(([id, text]) => button(text, `data-place="${id}"`))
    .join(
      "",
    )}</div><p>At a destination, inspect what is in front of you.</p></div></section>`;
  ui.querySelector("#return").onclick = hud;
  ui.querySelectorAll("[data-place]").forEach(
    (b) => (b.onclick = () => go(b.dataset.place)),
  );
}
function openPhone(route = "home", thread = null, note = null) {
  if (!S.state.phone) return;
  setMode("phone");
  phoneRoute = route;
  phoneThread = thread;
  S.state.phoneRoute = route;
  S.state.phoneThread = thread;
  S.state.phoneNote = note;
  S.save();
  let body = "",
    title = "Iris’s phone";
  if (route === "home")
    body = `<section class="phone-home"><h2>09:24</h2><p>Sunday, 19 October</p><div class="phone-apps">${[
      ["messages", "Messages", "◌"],
      ["photos", "Photos", "✿"],
      ["outbox", "Outbox", "↗"],
      ["voice", "Voice notes", "≋"],
      ["notes", "Notes", "▤"],
      ["contacts", "Contacts", "◉"],
    ]
      .map(
        ([id, text, icon]) =>
          `<button data-app="${id}"><span class="app-icon ${id}">${icon}</span>${text}</button>`,
      )
      .join(
        "",
      )}</div><p class="copy-note">AUTHORISED READ-ONLY COPY<br>The original device remains sealed. Messages, capture times and queued deliveries are kept separately.</p></section>`;
  if (route === "messages") {
    title = "Messages";
    body = STORY.phone.messages
      .map(
        (m) =>
          `<button class="thread-link" data-thread="${m.id}"><b>${esc(m.name)}</b><span>${esc(m.preview)}</span></button>`,
      )
      .join("");
  }
  if (route === "thread") {
    const m = STORY.phone.messages.find((m) => m.id === thread);
    title = m.name;
    body = m.rows
      .map(
        ([time, who, text]) =>
          `<article class="message ${who === "Iris" ? "sent" : ""}"><small>${esc(time)} · ${esc(who)}</small>${text.startsWith("[Attachment") ? `<button id="message-attachment">Queued attachment · open original</button>` : esc(text)}</article>`,
      )
      .join("");
  }
  if (route === "photos") {
    title = "Photos";
    body = `<div class="phone-gallery">${STORY.phone.photos.map((p) => `<button data-photo="${p.id}"><img src="${p.file}" alt="${esc(p.title)}"><span>${esc(p.title)}</span></button>`).join("")}</div><p>Original gallery items. Open a photograph to inspect it and its capture information.</p>`;
  }
  if (route === "outbox") {
    title = "Outbox";
    body = `<h2>Not sent</h2><small>1 retained item · pending delivery</small><article class="outbox-item"><p>To Mara<br><small>Queue created Friday, 17 October</small></p><button id="queued-photo"><img src="${STORY.phone.queued.file}" alt="Unsent image attachment"><p>Open original attachment ↗</p></button></article><p>A pending message has no delivery receipt. Its attachment retains independent capture information.</p>`;
  }
  if (route === "voice") {
    title = "Voice notes";
    body = `<div class="recording"><small>16 OCTOBER · 18:21</small><h2>The blue mug</h2><div class="recording-waveform" aria-hidden="true">${waveformMarkup(world.motionData.clips.iris)}</div><div class="recording-time"><span id="recording-elapsed">0:00</span><span id="recording-duration">${clockText(world.motionData.clips.iris.duration)}</span></div>${button("Play recording", 'id="phone-recording"')}${button("Stop", 'id="phone-recording-stop"')}<details><summary>Transcript</summary><p>${esc(STORY.dialogue.iris.text)}</p></details></div>`;
  }
  if (route === "notes") {
    title = "Notes";
    body = `<p class="notes-context">Retained from the authorised copy</p><div class="phone-notes">${STORY.phone.notes.map((n) => `<button class="note-link" data-note="${esc(n.id)}"><b>${esc(n.title)}</b><small>${esc(n.date)} · ${n.status === "deleted" ? "Recovered fragment" : "Draft"}</small><span>${esc(n.body.slice(0, 80))}…</span></button>`).join("")}</div>`;
  }
  if (route === "note") {
    const n = STORY.phone.notes.find((n) => n.id === note);
    if (!n) {
      openPhone("notes");
      return;
    }
    title = "Notes";
    body = `<article class="personal-note"><small>CREATED ${esc(n.date)}</small><h2>${esc(n.title)}</h2><p class="note-body">${esc(n.body)}</p><footer>${n.status === "deleted" ? "Recovered deleted text. The creation field does not establish when it was deleted." : "Retained draft. No sending or publication is recorded here."}</footer></article>`;
  }
  if (route === "contacts") {
    title = "Contacts";
    body = `<h2>Elena</h2><p>Sister</p>${button("Open retained conversation", 'data-thread="elena"')}<h2>Mara</h2><p>Friend · sound editor</p>${button("Open retained conversation", 'data-thread="mara"')}<h2>Adrian</h2><p>Mobile</p>${button("Open retained conversation", 'data-thread="adrian"')}<p>This copy cannot place calls or send messages.</p>`;
  }
  ui.innerHTML = `<section class="phone-shell">${button("Put away", 'class="phone-close" id="put-phone-away"')}<div class="phone-device"><div class="phone-screen"><div class="phone-status"><span>09:24</span><span>▰ 74%</span></div><header>${route !== "home" ? button("‹ Back", 'id="phone-back"') : ""}<b>${esc(title)}</b></header><div class="phone-body" style="${route === "home" ? "padding:0" : ""}">${body}</div><div class="phone-copy">CASE 0416 / READ-ONLY DEVICE COPY</div><div class="phone-system">${button("Home", 'id="phone-home" aria-label="Phone home"')}</div></div></div></section>`;
  ui.querySelector("#put-phone-away").onclick = () => {
    A.stopVoice();
    hud();
  };
  ui.querySelector("#phone-home").onclick = () => openPhone("home");
  ui.querySelector("#phone-back")?.addEventListener("click", () =>
    openPhone(
      route === "thread" ? "messages" : route === "note" ? "notes" : "home",
    ),
  );
  ui.querySelectorAll("[data-app]").forEach(
    (b) => (b.onclick = () => openPhone(b.dataset.app)),
  );
  ui.querySelectorAll("[data-thread]").forEach(
    (b) => (b.onclick = () => openPhone("thread", b.dataset.thread)),
  );
  ui.querySelectorAll("[data-photo]").forEach(
    (b) =>
      (b.onclick = () =>
        photo(b.dataset.photo, () => openPhone(route, thread))),
  );
  ui.querySelectorAll("[data-note]").forEach(
    (b) => (b.onclick = () => openPhone("note", null, b.dataset.note)),
  );
  ui.querySelector("#queued-photo")?.addEventListener("click", () =>
    photo("queued", () => openPhone("outbox")),
  );
  ui.querySelector("#message-attachment")?.addEventListener("click", () =>
    photo("queued", () => openPhone("thread", thread)),
  );
  let recordingAudio = null;
  ui.querySelector("#phone-recording")?.addEventListener("click", () => {
    recordingDispose?.();
    recordingAudio = A.say("iris");
    recordingDispose = bindRecording(
      ui.querySelector(".recording"),
      recordingAudio,
      world.motionData.clips.iris,
    );
  });
  ui.querySelector("#phone-recording-stop")?.addEventListener("click", () => {
    A.stopVoice();
    if (recordingAudio) recordingAudio.currentTime = 0;
  });
}
function photo(id, back = () => openPhone("photos")) {
  if (!S.state.visited.includes("photo:" + id)) {
    S.state.visited.push("photo:" + id);
    S.save();
  }
  setMode("photo");
  const source =
    id === "queued"
      ? STORY.phone.queued
      : STORY.phone.photos.find((p) => p.id === id);
  let zoom = 1,
    pan = [0, 0],
    down = null,
    pointers = new Map(),
    lastPinch = 0;
  returnFromPhoto = back;
  ui.innerHTML = `<section class="photo-space"><header class="photo-header">${button("‹ Return", 'id="close-photo"')}<span>${esc(source.title)}<br>ORIGINAL SOURCE</span>${button("ⓘ Capture info", 'id="photo-info"')}</header><div class="photo-view"><div class="photo-stage"><img id="source-photo" src="${source.file}" alt="Original room photograph"><span class="source-pin" hidden></span></div></div><footer class="photo-footer"><div class="photo-controls"><label>Magnification <input id="photo-zoom" type="range" min="1" max="4" step=".1" value="1"></label>${button("Reset view", 'id="photo-reset"')}${button("Image description", 'id="photo-description"')}</div><p id="photo-feedback" role="status">Tap a detail to mark it. Drag to move; pinch or use magnification. Keeping a detail does not confirm an explanation.</p></footer></section>`;
  const stage = ui.querySelector(".photo-stage"),
    view = ui.querySelector(".photo-view"),
    pin = ui.querySelector(".source-pin"),
    feedback = ui.querySelector("#photo-feedback");
  const transform = () => {
    stage.style.transform = `translate(${pan[0]}px,${pan[1]}px) scale(${zoom})`;
    ui.querySelector("#photo-zoom").value = zoom;
  };
  ui.querySelector("#close-photo").onclick = back;
  ui.querySelector("#photo-zoom").oninput = (ev) => {
    zoom = Number(ev.target.value);
    transform();
  };
  ui.querySelector("#photo-reset").onclick = () => {
    zoom = 1;
    pan = [0, 0];
    transform();
  };
  const mark = (x, y) => {
    pin.hidden = false;
    pin.style.left = x * 100 + "%";
    pin.style.top = y * 100 + "%";
    const target = regions[id]?.shelf,
      sofa = regions[id]?.sofa;
    const near = (p, r) => p && Math.hypot(x - p[0], y - p[1]) < r;
    if (id === "queued" && near(target, 0.075)) {
      retain("queued-shelf");
      feedback.textContent =
        "A bronze support is visible between the books. Original image position retained.";
    } else if (near(sofa, 0.19)) {
      retain(id === "queued" ? "queued-sofa" : "past-sofa");
      feedback.textContent =
        id === "queued"
          ? "The sofa is on the right side, facing the window. Source position retained."
          : "The sofa is across the back of the room. Source position retained.";
    } else
      feedback.textContent =
        "Mark placed. You can zoom further or use the image description. No conclusion has been confirmed.";
  };
  view.onpointerdown = (ev) => {
    pointers.set(ev.pointerId, [ev.clientX, ev.clientY]);
    view.setPointerCapture(ev.pointerId);
    down = {
      x: ev.clientX,
      y: ev.clientY,
      last: [ev.clientX, ev.clientY],
      moved: false,
    };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      lastPinch = Math.hypot(a[0] - b[0], a[1] - b[1]);
    }
  };
  view.onpointermove = (ev) => {
    if (!pointers.has(ev.pointerId)) return;
    pointers.set(ev.pointerId, [ev.clientX, ev.clientY]);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()],
        dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
      zoom = Math.max(1, Math.min(4, (zoom * dist) / lastPinch));
      lastPinch = dist;
      down.moved = true;
      transform();
    } else if (down) {
      const dx = ev.clientX - down.last[0],
        dy = ev.clientY - down.last[1];
      down.moved ||= Math.hypot(ev.clientX - down.x, ev.clientY - down.y) > 7;
      if (down.moved) {
        pan = [
          Math.max(-innerWidth * 2, Math.min(innerWidth * 2, pan[0] + dx)),
          Math.max(-innerHeight * 2, Math.min(innerHeight * 2, pan[1] + dy)),
        ];
        transform();
      }
      down.last = [ev.clientX, ev.clientY];
    }
  };
  view.onpointerup = (ev) => {
    pointers.delete(ev.pointerId);
    if (down && !down.moved && pointers.size === 0) {
      const r = stage.getBoundingClientRect(),
        x = (ev.clientX - r.left) / r.width,
        y = (ev.clientY - r.top) / r.height;
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) mark(x, y);
    }
    down = null;
  };
  view.onpointercancel = () => {
    pointers.clear();
    down = null;
  };
  ui.querySelector("#photo-info").onclick = () =>
    photoOverlay(
      `<h2>Original capture</h2><pre>${esc(source.metadata || source.date)}</pre>${id === "queued" ? button("Keep the original capture fields", 'id="keep-metadata"') : ""}`,
      (box) =>
        box.querySelector("#keep-metadata")?.addEventListener("click", () => {
          retain("queued-time");
          box.remove();
        }),
    );
  ui.querySelector("#photo-description").onclick = () =>
    photoOverlay(
      `<h2>Equivalent image description</h2><p>The window is on the left. The shelves run across the back. These landmarks establish that both images show the same room.</p><div class="source-description">${id === "queued" ? `<p>The sofa is along the right side, facing the window. A bronze L-shaped book support with a circular ornament stands on the lower shelf.</p>${button("Retain the lower shelf detail", 'id="describe-shelf"')}${button("Retain the sofa position", 'id="describe-sofa"')}` : id === "before" ? `<p>The sofa runs across the back, facing the table.</p>${button("Retain the sofa position", 'id="describe-sofa"')}` : "<p>The window, the worn chair and a blue mug on the sill. This is a personal photograph, not a record of the later scene.</p>"}</div>`,
      (box) => {
        box
          .querySelector("#describe-shelf")
          ?.addEventListener("click", () => retain("queued-shelf"));
        box
          .querySelector("#describe-sofa")
          ?.addEventListener("click", () =>
            retain(id === "queued" ? "queued-sofa" : "past-sofa"),
          );
      },
    );
}
function photoOverlay(html, bind) {
  const box = document.createElement("article");
  box.className = "photo-meta";
  box.innerHTML = html + button("Return to the image", 'id="close-photo-meta"');
  ui.querySelector(".photo-space").append(box);
  box.querySelector("#close-photo-meta").onclick = () => box.remove();
  bind?.(box);
}
function notebook() {
  setMode("notebook");
  ui.innerHTML = `<section class="panel"><div class="content">${button("Close notebook", 'class="close" id="close-notebook"')}<article class="notebook"><small class="notebook-imprint">FIELD NOTES / CASE 0416</small><h1>Alex Dima / field notebook</h1><p>Observations first. Interpretations remain provisional.</p>${S.state.observations.map((id) => `<button class="note-source" data-observation="${id}"><small>${esc(noteLabels[id][0])} ↗ ORIGINAL</small>${esc(noteLabels[id][1])}</button>`).join("") || "<p>No observation has been retained. Inspect the room and the phone before drawing a conclusion.</p>"}${S.state.finding ? "<p><b>Supported comparison retained.</b> The search request preserves the interval and the limits of the evidence.</p>" : ""}<label>Private notes<textarea id="private-notes" placeholder="Questions you want to return to…">${esc(S.state.notebook)}</textarea></label></article></div></section>`;
  ui.querySelector("#close-notebook").onclick = hud;
  ui.querySelector("#private-notes").oninput = (ev) => {
    S.state.notebook = ev.target.value;
    S.save();
  };
  ui.querySelectorAll("[data-observation]").forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.observation;
        if (id.startsWith("queued")) photo("queued", notebook);
        else if (id === "past-sofa") photo("before", notebook);
        else
          inspect(id === "scene-gap" ? "shelf" : id === "mug" ? "mug" : "sofa");
      }),
  );
}
function deduction(stage = 0) {
  if (!S.state.phone || !S.state.visited.includes("photo:queued")) {
    speak("notYet", [
      ["Return to the room", hud],
      ["Ask for a nudge", hint],
    ]);
    return;
  }
  const steps = [
    [
      "question-object",
      [
        ["shelf", "The bronze book support."],
        ["glass", "The drinking glass."],
        ["sofa", "The sofa."],
      ],
      "change",
    ],
    [
      "question-source",
      [
        ["before", "The older gallery photograph."],
        [
          "queued",
          "The queued attachment, with its original capture information.",
        ],
        ["room", "The room as it is now."],
      ],
      "source",
    ],
    [
      "question-layout",
      [
        [
          "later",
          "The present sofa position establishes a struggle during the fatal event.",
        ],
        [
          "earlier",
          "That arrangement already existed in the queued image. It does not by itself establish a later struggle.",
        ],
        ["unchanged", "Nothing in this room has changed."],
      ],
      "layout",
    ],
    [
      "question-limit",
      [
        ["time", "The exact time of the fatal injury."],
        [
          "bounded",
          "It bounds a physical change. It does not date the injury or identify a person.",
        ],
        ["identity", "It identifies who was responsible."],
      ],
      "limit",
    ],
  ];
  const [id, options, key] = steps[stage];
  speak(id, [
    ...options.map(([value, text]) => [
      text,
      () => {
        answer[key] = value;
        if (stage < steps.length - 1) deduction(stage + 1);
        else {
          const result = S.establish(answer);
          if (result.ok)
            speak("finding", [
              [
                "What follows from it?",
                () =>
                  speak("next", [
                    ["Leave for the Aurelia", sectionEnd],
                    ["I will take another look first.", hud],
                  ]),
              ],
            ]);
          else
            speak(
              result.reason === "bounded"
                ? "bounded"
                : result.reason === "scene" || result.reason === "original"
                  ? "notYet"
                  : "wrong",
              [
                ["Return to the room", hud],
                ["Reconsider the comparison", () => deduction(0)],
                ["Ask for a nudge", hint],
              ],
            );
        }
      },
    ]),
    [
      "Let me reopen the original.",
      () => photo("queued", () => deduction(stage)),
    ],
    ["I need to look again.", hud],
  ]);
}
function sectionEnd() {
  setMode("section-end");
  A.hush();
  ui.innerHTML = `<section class="prologue-end"><small>THE ROOM LEFT BEHIND / FIRST SECTION COMPLETE</small><h1>Outside, the rain has stopped.</h1><p>The search request is specific now. There is a next place to go, and a reason to go there.</p><p>This scene-led development section ends here. The Aurelia visit and the remaining campaign are being rebuilt to follow this format. Your progress is saved; the previous full casework edition remains separate.</p>${button("Return to the apartment", 'id="return-room"')}${button("Save and return to title", 'id="return-title"')}</section>`;
  ui.querySelector("#return-room").onclick = () => go("room");
  ui.querySelector("#return-title").onclick = () => {
    S.save();
    title();
  };
}
function settings(fromTitle = false) {
  setMode("settings");
  A.stopVoice();
  ui.innerHTML = `<section class="panel"><div class="content">${button("Return", 'class="close" id="close-settings"')}<h1>Pause</h1><p>The scene-led opening is in development. Earlier editions and saves remain separate.</p><label><input id="sound-enabled" type="checkbox" ${S.state.sound ? "checked" : ""}>Music, room ambience and voices</label><label><input id="reduced-motion" type="checkbox" ${S.state.reduced ? "checked" : ""}>Reduced motion during movement</label>${S.state.started ? button("Replay introduction", 'id="replay-intro"') : ""}${button("Download save backup", 'id="export-save"')}<label>Restore this edition’s backup <input type="file" id="import-save" accept="application/json"></label>${button("Return to title", 'id="pause-title"')}<p class="hint-quiet">Hold the lower-left arrows to walk. Drag the room with another finger to look while moving. Release an arrow to stop. On desktop, WASD walks and arrow keys look. Tap objects to inspect; pinch photographs for detail. Move provides optional guided navigation.</p><p><a href="${esc(previousEdition)}">Preserved previous casework edition</a></p><p id="save-feedback" role="status"></p></div></section>`;
  ui.querySelector("#close-settings").onclick = fromTitle ? title : hud;
  ui.querySelector("#sound-enabled").onchange = (ev) => {
    S.state.sound = ev.target.checked;
    A.unlock();
    A.setEnabled(S.state.sound);
    S.save();
  };
  ui.querySelector("#reduced-motion").onchange = (ev) => {
    S.state.reduced = ev.target.checked;
    world.setReducedMotion(S.state.reduced);
    S.save();
  };
  ui.querySelector("#replay-intro")?.addEventListener("click", () => {
    A.unlock();
    intro(true);
  });
  ui.querySelector("#pause-title").onclick = title;
  ui.querySelector("#export-save").onclick = () => {
    S.save();
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(S.state, null, 2)], {
          type: "application/json",
        }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = "THE_LAST_ARCHIVE_sceneplay_save.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  ui.querySelector("#import-save").onchange = async (ev) => {
    try {
      const raw = JSON.parse(await ev.target.files[0].text());
      if (!S.importSave(raw)) throw Error();
      world.move(S.state.position, true);
      status("Scene-led save restored. Earlier editions are unchanged.");
      resume();
    } catch {
      ui.querySelector("#save-feedback").textContent =
        "This backup does not belong to the scene-led edition. Your current progress is preserved.";
    }
  };
}
window.addEventListener("keydown", (ev) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName))
    return;
  if (ev.key === "Escape") {
    if (mode === "play") settings();
    else if (mode !== "intro" && mode !== "title") hud();
  }
  if (mode === "play" && ev.key.toLowerCase() === "e") {
    const hit = world.hit(innerWidth / 2, innerHeight / 2);
    if (hit) act(hit.userData.action);
  }
  if (
    mode === "play" &&
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(ev.key)
  ) {
    ev.preventDefault();
    if (ev.key === "ArrowLeft") world.lookOffset.yaw += 0.15;
    if (ev.key === "ArrowRight") world.lookOffset.yaw -= 0.15;
    if (ev.key === "ArrowUp") world.lookOffset.pitch += 0.1;
    if (ev.key === "ArrowDown") world.lookOffset.pitch -= 0.1;
    world.lookOffset.pitch = Math.max(
      -0.65,
      Math.min(0.55, world.lookOffset.pitch),
    );
  }
});
window.addEventListener("save-unavailable", () =>
  status(
    "Progress could not be stored. Keep this tab open and export a backup from Pause.",
  ),
);
boot();

window.addEventListener("sceneplay-updated", () => {
  if (document.querySelector("#build-update")) return;
  const b = document.createElement("aside");
  b.id = "build-update";
  b.setAttribute("role", "status");
  b.innerHTML =
    "<span>An updated development build is ready.</span><button>Save & reload</button>";
  b.querySelector("button").onclick = () => {
    world?.setWalkInput();
    S.save();
    A.hush();
    document.querySelector("#intro-film")?.pause();
    location.reload();
  };
  document.body.append(b);
});
