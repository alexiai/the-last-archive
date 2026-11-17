import { asset } from "./assets.js";
import { state, save, soundInspected } from "./engine.js";
let foreground = null,
  music = null,
  manifest = null;
export async function initAudio() {
  try {
    manifest = await (await fetch(asset("assets/audio/manifest.json"))).json();
  } catch {}
  return manifest;
}
export function setSound(on) {
  state.sound.enabled = on;
  save();
  if (on) {
    music ??= new Audio(asset("assets/audio/music-investigation.mp3"));
    music.loop = true;
    music.volume = state.sound.music;
    music.play().catch(() => {});
  } else {
    foreground?.pause();
    music?.pause();
  }
}
export function stopVoice() {
  foreground?.pause();
  foreground = null;
  if (music) music.volume = state.sound.music;
}
export function setVolume(value) {
  state.sound.volume = Math.max(0, Math.min(1, Number(value) || 0));
  if (foreground) foreground.volume = state.sound.volume;
  save();
}
export async function play(id, onTime) {
  stopVoice();
  const item = manifest?.clips?.[id];
  const file = item?.file || "assets/audio/" + id + ".mp3";
  foreground = new Audio(asset(file));
  foreground.volume = state.sound.volume;
  foreground.addEventListener("timeupdate", () =>
    onTime?.(foreground.currentTime, item),
  );
  foreground.addEventListener("ended", () => {
    if (music) music.volume = state.sound.music;
  });
  if (music) music.volume = state.sound.music * 0.28;
  foreground.addEventListener("error", () =>
    window.dispatchEvent(new CustomEvent("audio-error", { detail: id })),
  );
  try {
    await foreground.play();
    soundInspected(id);
    return true;
  } catch {
    return false;
  }
}
export function pause() {
  foreground?.pause();
  if (music) music.volume = state.sound.music;
}
export function setMusicVolume(value) {
  state.sound.music = Math.max(0, Math.min(0.4, Number(value) || 0));
  if (music) music.volume = state.sound.music;
  save();
}
export function effect(name = "notification") {
  if (!state.sound.enabled) return;
  const a = new Audio(asset("assets/audio/" + name + ".mp3"));
  a.volume = state.sound.volume * 0.25;
  a.play().catch(() => {});
}
export function getManifest() {
  return manifest;
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    foreground?.pause();
    music?.pause();
  }
});

export function seek(seconds) {
  if (foreground && Number.isFinite(seconds))
    foreground.currentTime = Math.max(
      0,
      Math.min(foreground.duration || seconds, seconds),
    );
}
