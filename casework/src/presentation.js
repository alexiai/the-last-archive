import { CONTENT as C } from "./content.js";
import { escape as e } from "./dom.js";
export function briefingArtifact(index) {
  if (index === 0)
    return `<aside class="briefing-art assignment-art" aria-label="Detective assignment"><div class="folder-tab">MAJOR CRIME · 0416</div><article class="assignment-paper"><header><span>V</span><div>VESPERA<br><small>MAJOR CRIME UNIT</small></div></header><p class="paper-eyebrow">DETECTIVE ASSIGNMENT / 19 OCTOBER 2025</p><h2>Death at<br>8 Teilor Street</h2><dl><dt>Assigned detective</dt><dd>Alex Dima</dd><dt>Deceased</dt><dd>${e(C.case.victim)}</dd><dt>Initial status</dt><dd>Cause and sequence under examination</dd></dl><div class="assignment-stamp">RETAINED COPY<br>CASE 0416</div><p class="paper-reference">Record the sources.<br>Keep the first explanation provisional.</p></article></aside>`;
  if (index === 1)
    return `<aside class="briefing-art portrait-art"><figure class="personal-polaroid"><img src="assets/portraits/iris.png" alt="Iris Vasilescu"><figcaption>Iris / personal device photograph</figcaption></figure><div class="ordinary-message"><span>AN ORDINARY CONVERSATION</span><p>“Is the blue mug still leaking?”</p><p>“Only if I put liquid in it.”</p></div></aside>`;
  return `<aside class="briefing-art contact-art"><figure class="scene-contact"><img src="assets/world/scene-wide.jpg" alt="Initial room photograph"><figcaption>01 / Living room · preserved after removal</figcaption></figure><div class="entry-instruction"><span>YOUR FIRST EXAMINATION</span><p>Marked objects can be inspected. Keep observations in the casebook and return to their originals whenever you need.</p></div></aside>`;
}
export function workingLeadNote(leads) {
  if (!leads.length) return "";
  return `<aside class="working-lead-note"><span class="note-pin" aria-hidden="true"></span><p>ON YOUR DESK</p>${leads
    .slice(0, 2)
    .map(
      (p) =>
        `<button type="button" data-puzzle="${p.id}">${e(p.title)}<span>Continue this inquiry ↗</span></button>`,
    )
    .join(
      "",
    )}<small>Other originals remain at the examination desk.</small></aside>`;
}
