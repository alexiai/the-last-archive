export function waveformMarkup(clip) {
  const values = clip?.values || [],
    count = 96;
  const bars = Array.from({ length: count }, (_, i) => {
    const a = Math.floor((i * values.length) / count),
      b = Math.max(a + 1, Math.floor(((i + 1) * values.length) / count));
    const level = Math.max(0, ...values.slice(a, b)),
      x = 5 + (i * 590) / (count - 1),
      h = 2 + level * 29;
    return `<path d="M${x.toFixed(2)} ${(36 - h).toFixed(2)}v${(h * 2).toFixed(2)}"/>`;
  }).join("");
  return `<svg viewBox="0 0 600 72" focusable="false"><defs><clipPath id="recording-ink-mask"><rect width="0" height="72"/></clipPath></defs><g class="waveform-unheard">${bars}</g><g class="waveform-heard" clip-path="url(#recording-ink-mask)">${bars}</g></svg>`;
}
export const clockText = (t) =>
  `${Math.floor((t || 0) / 60)}:${String(Math.floor((t || 0) % 60)).padStart(2, "0")}`;

export function bindRecording(container, audio, clip) {
  let frame;
  const update = () => {
    cancelAnimationFrame(frame);
    if (!container.isConnected) return;
    const duration = Number.isFinite(audio.duration)
      ? audio.duration
      : clip.duration;
    const time = Math.min(duration, audio.currentTime || 0);
    container.querySelector("#recording-elapsed").textContent = clockText(time);
    container.querySelector("#recording-duration").textContent =
      clockText(duration);
    container
      .querySelector("#recording-ink-mask rect")
      .setAttribute("width", String(duration ? (time / duration) * 600 : 0));
    container.classList.toggle("is-playing", !audio.paused && !audio.ended);
    if (!audio.paused && !audio.ended) frame = requestAnimationFrame(update);
  };
  const events = [
    "playing",
    "pause",
    "ended",
    "loadedmetadata",
    "timeupdate",
    "seeking",
  ];
  events.forEach((event) => audio.addEventListener(event, update));
  update();
  return () => {
    cancelAnimationFrame(frame);
    events.forEach((event) => audio.removeEventListener(event, update));
  };
}
