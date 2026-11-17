import { assetMarkup } from "./assets.js";
export const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const $ = (s, root = document) => root.querySelector(s);
export function action(label, fn, cls = "") {
  const b = document.createElement("button");
  b.type = "button";
  b.className = cls;
  b.textContent = label;
  b.addEventListener("click", fn);
  return b;
}
export function toast(message) {
  let el = $("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(el.timer);
  el.timer = setTimeout(() => el.classList.remove("visible"), 4200);
}
export function modal(label, html, large = false) {
  const d = document.createElement("dialog");
  d.dataset.transient = "";
  const nativeClose = d.close.bind(d);
  d.close = (...args) => {
    nativeClose(...args);
    d.remove();
  };
  d.className = large ? "evidence-dialog" : "paper-dialog";
  d.setAttribute("aria-label", label);
  d.innerHTML = assetMarkup(
    `<header class="dialog-heading"><span>${escape(label)}</span><button class="close-dialog" aria-label="Close inspection">×</button></header>${html}`,
  );
  document.body.appendChild(d);
  d.querySelector(".close-dialog").onclick = () => d.close();
  d.addEventListener("close", () => d.remove());
  d.showModal();
  return d;
}
export function icon(name) {
  const paths = {
    phone: "M7 2h10v20H7zM10 19h4",
    book: "M4 4h7v16H4zM11 4h9v16h-9",
    map: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15",
    sound: "M3 9h4l5-5v16l-5-5H3zM16 8q6 4 0 8",
    back: "m14 5-7 7 7 7",
    home: "m3 10 9-8 9 8v12H3z",
    camera: "M3 7h18v13H3zM8 7l2-4h4l2 4M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    messages: "M3 4h18v13H8l-5 4z",
    contacts: "M6 21v-4a6 6 0 0 1 12 0v4M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    calls: "M5 3h4l2 5-3 2q2 4 6 6l2-3 5 2v4c-7 5-21-9-16-16z",
    mail: "M2 5h20v15H2zM2 5l10 8L22 5",
    notes: "M5 2h14v20H5zM8 7h8M8 11h8M8 15h5",
    calendar: "M3 5h18v17H3zM3 10h18M7 2v6M17 2v6",
    browser:
      "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2q8 10 0 20-8-10 0-20",
    social: "M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8M4 22v-4q8-8 16 0v4",
    recorder: "M9 2h6v13H9zM5 10v3a7 7 0 0 0 14 0v-3M12 20v3",
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
}
