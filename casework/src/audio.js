import { RECORDINGS } from "./recordings.js";
import { asset } from "./assets.js";
import { state, save, soundInspected } from "./engine.js";
let foreground = null,
  music = null,
  manifest = { clips: RECORDINGS },
  initialization = null,
  requestVersion = 0,
  foregroundId = null;
export function initAudio() {
  return (initialization ??= Promise.resolve(manifest));
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
    pause();
    music?.pause();
  }
}
export function stopVoice() {
  requestVersion++;
  foreground?.pause();
  foreground = null;
  foregroundId = null;
  window.dispatchEvent(
    new CustomEvent("recording-state", {
      detail: { id: null, status: "stopped" },
    }),
  );
  if (music) music.volume = state.sound.music;
}
export function setVolume(value) {
  state.sound.volume = Math.max(0, Math.min(1, Number(value) || 0));
  if (foreground) foreground.volume = state.sound.volume;
  save();
}
export async function play(id, onTime, offset = 0) {
  stopVoice();
  const request = requestVersion;
  if (!manifest) await initAudio();
  if (request !== requestVersion) return false;
  const item = manifest?.clips?.[id];
  const file = item?.file || "assets/audio/" + id + ".mp3";
  foreground = new Audio(asset(file));
  const player = foreground;
  foregroundId = id;
  foreground.volume = state.sound.volume;
  if(offset>0){
    const position=()=>{if(foreground===player)player.currentTime=Math.min(offset,Number.isFinite(player.duration)?Math.max(0,player.duration-.01):offset);};
    player.addEventListener('loadedmetadata',position,{once:true});
    if(player.readyState>=1)position();
  }
  foreground.addEventListener("timeupdate", () => {
    if (foreground !== player) return;
    onTime?.(player.currentTime, item);
    window.dispatchEvent(
      new CustomEvent("recording-time", {
        detail: { id, time: player.currentTime },
      }),
    );
  });
  foreground.addEventListener("ended", () => {
    if (foreground !== player) return;
    window.dispatchEvent(
      new CustomEvent("recording-state", { detail: { id, status: "ended" } }),
    );
    if (music) music.volume = state.sound.music;
  });
  if (music) music.volume = state.sound.music * 0.28;
  foreground.addEventListener("error", () =>
    window.dispatchEvent(new CustomEvent("audio-error", { detail: id })),
  );
  try {
    await player.play();
    if(offset>0&&Math.abs(player.currentTime-offset)>.15)player.currentTime=Math.min(offset,Math.max(0,player.duration-.01));
    if (request !== requestVersion) {
      player.pause();
      return false;
    }
    soundInspected(id);
    window.dispatchEvent(
      new CustomEvent("recording-state", { detail: { id, status: "playing" } }),
    );
    return true;
  } catch {
    return false;
  }
}
export function pause() {
  requestVersion++;
  foreground?.pause();
  window.dispatchEvent(
    new CustomEvent("recording-state", {
      detail: { id: foregroundId, status: "paused" },
    }),
  );
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
    pause();
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
