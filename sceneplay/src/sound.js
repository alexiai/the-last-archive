import { state } from "./state.js";
let context,
  master,
  weather,
  hum,
  voice = new Audio(),
  primed = false,
  manifest = {},
  timer;
const oscillators = [];
export async function prepare() {
  manifest = await (await fetch("assets/audio/manifest.json")).json();
}
export function unlock() {
  if (!context) {
    context = new (window.AudioContext || window.webkitAudioContext)();
    master = context.createGain();
    master.gain.value = state.sound ? 0.25 : 0;
    master.connect(context.destination);
    const n = context.createBuffer(
        1,
        context.sampleRate * 3,
        context.sampleRate,
      ),
      data = n.getChannelData(0);
    let seed = 417;
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      data[i] = (seed / 2147483648 - 1) * 0.17;
    }
    const rain = context.createBufferSource();
    rain.buffer = n;
    rain.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1050;
    weather = context.createGain();
    weather.gain.value = 0.6;
    rain.connect(filter).connect(weather).connect(master);
    rain.start();
    for (const f of [55, 82.41]) {
      const o = context.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = context.createGain();
      g.gain.value = 0.016;
      o.connect(g).connect(master);
      o.start();
      oscillators.push(o);
    }
    timer = setInterval(() => tick(), 2400);
  }
  context.resume().catch(() => {});
  if (!primed) {
    primed = true;
    voice.src =
      "data:audio/wav;base64,UklGRgQCAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YeABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    voice.volume = 0.01;
    const silent = voice.src;
    voice
      .play()
      .then(() => {
        if (voice.src === silent) voice.pause();
      })
      .catch(() => {});
  }
  setEnabled(state.sound);
}
export function setEnabled(on) {
  if (master)
    master.gain.setTargetAtTime(on ? 0.25 : 0, context.currentTime, 0.3);
  if (voice) voice.muted = !on;
}
export function ambience(place = "room") {
  if (weather)
    weather.gain.setTargetAtTime(
      place === "landing" ? 0.3 : place === "window" ? 0.85 : 0.5,
      context.currentTime,
      0.6,
    );
}
function pulse(f, length, volume, type = "sine") {
  if (!context || !state.sound) return;
  const o = context.createOscillator(),
    g = context.createGain(),
    t = context.currentTime;
  o.type = type;
  o.frequency.value = f;
  o.connect(g).connect(master);
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  o.start(t);
  o.stop(t + length);
}
function tick() {
  pulse(1450, 0.035, 0.035);
  setTimeout(() => pulse(1100, 0.03, 0.02), 350);
  setTimeout(() => pulse(1450, 0.035, 0.025), 1100);
}
export function step() {
  pulse(76, 0.13, 0.16, "triangle");
  setTimeout(() => pulse(58, 0.11, 0.09, "triangle"), 280);
}
export function pencil() {
  pulse(3100, 0.04, 0.035, "sawtooth");
  setTimeout(() => pulse(2400, 0.07, 0.025, "sawtooth"), 80);
}
export function latch() {
  pulse(310, 0.08, 0.08, "triangle");
  setTimeout(() => pulse(120, 0.12, 0.07), 100);
}
export function stopVoice() {
  if (voice) {
    if (!voice.src.startsWith("data:audio/wav")) voice.pause();
  }
  if (master)
    master.gain.setTargetAtTime(
      state.sound ? 0.25 : 0,
      context.currentTime,
      0.4,
    );
}
export function say(id) {
  stopVoice();
  const clip = manifest[id];
  if (!clip) return;
  voice.src = clip.file;
  voice.muted = !state.sound;
  voice.volume = 0.84;
  if (master)
    master.gain.setTargetAtTime(
      state.sound ? 0.08 : 0,
      context.currentTime,
      0.2,
    );
  voice.onended = () => {
    if (master)
      master.gain.setTargetAtTime(
        state.sound ? 0.25 : 0,
        context.currentTime,
        0.4,
      );
  };
  voice.play().catch(() => {});
  return voice;
}
export function hush() {
  stopVoice();
  if (master) master.gain.setTargetAtTime(0, context.currentTime, 0.2);
}
window.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    voice?.pause();
    context?.suspend();
  } else if (state.sound) context?.resume().catch(() => {});
});
