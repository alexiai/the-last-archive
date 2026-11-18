import * as A from "./audio.js";
import { CONTENT as C } from "./content.js";
import { soundInspected } from "./engine.js";
import { escape as e, toast } from "./dom.js";
import { asset } from "./assets.js";
let measured = null,
  pending = null;
function envelopes() {
  return (pending ??= (async () => {
    try {
      measured = await (
        await fetch(asset("assets/audio/waveforms.json"))
      ).json();
    } catch {
      measured = {};
    }
    return measured;
  })());
}
function waveform(id, data, legacy = false) {
  const peaks = data?.peaks || [];
  return `<div class="waveform-body" data-waveform-id="${id}"><svg viewBox="0 0 720 100" preserveAspectRatio="none" aria-label="Measured recording amplitude" role="img"><path d="M0 50H720" stroke="currentColor" opacity=".18"/>${peaks.map((v, i) => `<path d="M${((i / peaks.length) * 720).toFixed(1)} ${(50 - v * 45).toFixed(1)}v${(v * 90).toFixed(1)}" stroke="currentColor" stroke-width="2"/>`).join("")}</svg><span class="listening-playhead" aria-hidden="true"></span><input type="range" class="waveform-seek" ${legacy ? 'id="audio-position"' : ""} min="0" max="${data?.duration || 1}" step=".05" value="0" aria-label="Replay recording from selected time"></div>`;
}
export function listeningPanel(id, legacy = false) {
  const recording = C.audio[id];
  return `<section class="listening-panel" data-listening="${id}" ${legacy ? 'data-legacy="true"' : ""}><header><span class="reel-symbol" aria-hidden="true">◉</span><div><small>RETAINED AUDIO / ${id === "assembly" ? "DELIVERED EXTRACT" : recording.offsets ? "INDEXED ORIGINAL EXCERPTS" : "ORIGINAL RECORDING"}</small><h3>${e(recording.title)}</h3></div></header><div data-envelope="${id}" class="waveform-loading">Preparing the recording…</div><div class="listening-transport"><button type="button" data-listen-play="${id}" ${legacy ? 'id="play-source"' : ""}>Play / replay</button><button type="button" data-listen-pause ${legacy ? 'id="pause-source"' : ""}>Pause</button><output data-listen-time="${id}" ${legacy ? 'id="audio-time"' : ""}>00:00</output></div><details open><summary>Transcript and source positions</summary><p class="listening-context">${e(recording.description || (id === "assembly" ? "Passages are presented in delivery order. Compare with the independently retained source." : "Transcript of the retained recording. Select a passage to replay from its actual position."))}</p><div class="listening-transcript">${recording.lines.map(([who, text], i) => `<button type="button" data-listen-line="${i}" data-listen-id="${id}"><span>${recording.offsets ? "SOURCE " + recording.offsets[i] : id === "assembly" ? "EXTRACT " + String.fromCharCode(65 + i) : "PASSAGE " + (i + 1)}</span><b>${e(who)}</b><q>${e(text)}</q></button>`).join("")}</div><button type="button" data-listen-read="${id}" ${legacy ? 'id="read-sound"' : ""}>Use transcript as the sound equivalent</button></details></section>`;
}
export async function mountListening(root) {
  let data = {},
    active = null;
  root.querySelector("[data-listening]")?.classList.add("mobile-active");
  root.querySelectorAll("[data-listening-tab]").forEach(
    (button) =>
      (button.onclick = () => {
        root
          .querySelectorAll("[data-listening]")
          .forEach((panel) =>
            panel.classList.toggle(
              "mobile-active",
              panel.dataset.listening === button.dataset.listeningTab,
            ),
          );
        root
          .querySelectorAll("[data-listening-tab]")
          .forEach((tab) =>
            tab.setAttribute("aria-pressed", String(tab === button)),
          );
      }),
  );

  root
    .querySelectorAll("[data-listen-play]")
    .forEach((b) => (b.onclick = () => A.play(b.dataset.listenPlay)));
  root
    .querySelectorAll("[data-listen-pause]")
    .forEach((b) => (b.onclick = A.pause));
  root.querySelectorAll("[data-listen-read]").forEach(
    (b) =>
      (b.onclick = () => {
        soundInspected(b.dataset.listenRead);
        b.textContent = "Transcript inspected ✓";
        toast("The original transcript is available for comparison.");
      }),
  );
  root.querySelectorAll("[data-listen-line]").forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.listenId,
          index = Number(b.dataset.listenLine),
          time = A.getManifest()?.clips?.[id]?.segments?.[index]?.start || 0;
        A.play(id, undefined, time);
      }),
  );
  const update = (ev) => {
    const { id, time } = ev.detail;
    root
      .querySelectorAll(`[data-listen-time="${id}"]`)
      .forEach(
        (el) =>
          (el.textContent =
            String(Math.floor(time / 60)).padStart(2, "0") +
            ":" +
            String(Math.floor(time % 60)).padStart(2, "0")),
      );
    root.querySelectorAll(`[data-waveform-id="${id}"]`).forEach((el) => {
      if (el.dataset.scrubbing === "true") return;
      const duration = data[id]?.duration || 1;
      el.querySelector(".listening-playhead").style.left =
        Math.min(100, (time / duration) * 100) + "%";
      if (document.activeElement !== el.querySelector("input"))
        el.querySelector("input").value = time;
    });
    const segments = A.getManifest()?.clips?.[id]?.segments || [];
    root.querySelectorAll(`[data-listen-id="${id}"]`).forEach((b) => {
      const segment = segments[Number(b.dataset.listenLine)];
      b.classList.toggle(
        "speaking",
        active === id &&
          !!segment &&
          time >= segment.start &&
          time <= segment.end,
      );
    });
  };
  const status = (ev) => {
    active = ev.detail.status === "playing" ? ev.detail.id : null;
    root
      .querySelectorAll("[data-listening]")
      .forEach((el) =>
        el.classList.toggle(
          "is-playing",
          ev.detail.status === "playing" &&
            el.dataset.listening === ev.detail.id,
        ),
      );
    root
      .querySelectorAll(".listening-transcript .speaking")
      .forEach((el) => el.classList.remove("speaking"));
  };
  window.addEventListener("recording-state", status);
  window.addEventListener("recording-time", update);
  root.addEventListener(
    "close",
    () => {
      window.removeEventListener("recording-time", update);
      window.removeEventListener("recording-state", status);
      A.pause();
    },
    { once: true },
  );
  data = await envelopes();
  if (!root.isConnected) return;
  root.querySelectorAll("[data-envelope]").forEach((el) => {
    el.innerHTML = data[el.dataset.envelope]
      ? waveform(
          el.dataset.envelope,
          data[el.dataset.envelope],
          el.closest("[data-listening]").dataset.legacy === "true",
        )
      : "<p>The transcript remains available for this recording.</p>";
  });
  root.querySelectorAll(".waveform-seek").forEach((input) => {
    input.oninput = () => {
      const frame = input.closest("[data-waveform-id]");
      frame.dataset.scrubbing = "true";
      frame.querySelector(".listening-playhead").style.left =
        (Number(input.value) / Number(input.max)) * 100 + "%";
      const output = frame.closest("[data-listening]").querySelector("output");
      const t = Number(input.value);
      output.textContent =
        String(Math.floor(t / 60)).padStart(2, "0") +
        ":" +
        String(Math.floor(t % 60)).padStart(2, "0");
    };
    input.onchange = () => {
      const frame = input.closest("[data-waveform-id]");
      frame.dataset.scrubbing = "false";
      A.play(frame.dataset.waveformId, undefined, Number(input.value));
    };
  });
  root.dataset.listeningReady = "true";
}
