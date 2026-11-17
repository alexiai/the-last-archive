/* Original examination diagrams: shared scale and explicit limitations. */
export function traceSheet() {
  const sole = (x, y, type, title) =>
    `<g transform="translate(${x} ${y})"><text x="65" y="-16" text-anchor="middle">${title}</text><path d="M24 200 Q8 185 18 140 L12 65 Q13 9 60 3 Q108 4 113 65 L107 135 Q121 190 96 203Z" fill="none" stroke="#55624c" stroke-width="2"/>${Array.from(
      { length: 9 },
      (_, i) => {
        const yy = 30 + i * 17;
        return type === "B"
          ? `<path d="M26 ${yy}l36 10 36-10"/>`
          : `<path d="M28 ${yy}l69 ${type === "A" ? 0 : 13}"/>`;
      },
    ).join(
      "",
    )}${type === "C" || type === "trace" ? '<path d="M93 173l18 3-6 24-22 4" stroke="#eae0c5" stroke-width="15"/>' : ""}</g>`;
  return `<figure class="examination-diagram"><svg viewBox="0 0 720 370" role="img" aria-label="Equal-scale partial angled sole trace and three reference soles. Reference C shares angled bars and worn outer heel."><rect width="720" height="370" fill="#eae0c5"/><g fill="#263d2f" stroke="#263d2f" stroke-width="6" font-family="monospace" font-size="13">${sole(20, 55, "trace", "RECOVERED")}${sole(195, 55, "A", "A")}${sole(370, 55, "B", "B")}${sole(545, 55, "C", "C")}</g><path d="M30 320h120m-120-6v12m120-12v12" stroke="#263d2f"/><text x="30" y="347" font-size="12" fill="#263d2f">Shared examination scale / diagram, not a wearer identification</text></svg><figcaption>Compare the pattern and missing corner. The paired wheel track is recorded separately in the original receiving sheet.</figcaption></figure>`;
}
export function circulation(completed = false) {
  return `<figure class="examination-diagram"><svg viewBox="0 0 760 530" role="img" aria-label="${completed ? "Completed service connection joins the landing behind camera E1." : "Older plan shows the side service connection closed."}"><rect width="760" height="530" fill="#e8dfc7"/><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#a4b8a266" stroke-width=".6"/></pattern></defs><rect width="760" height="530" fill="url(#grid)"/><g fill="none" stroke="#344d3c" stroke-width="7"><path d="M200 440V90H440V240H650V340H440V440Z"/><path d="M200 240H40V340H200M300 440v65M200 90V25H440V90"/></g><path d="M202 244v92" stroke="${completed ? "#e8dfc7" : "#944e3c"}" stroke-width="11"/>${completed ? '<path d="M80 290H260V400" fill="none" stroke="#976d36" stroke-width="3" stroke-dasharray="8 7"/>' : '<path d="M180 250l40 75m0-75-40 75" stroke="#944e3c" stroke-width="3"/>'}<path d="M340 170L220 90H440Z" fill="#728a7844" stroke="#728a78"/><g font-family="monospace" font-size="16" fill="#263d2f"><text x="277" y="67">FRONT</text><text x="260" y="350">LANDING</text><text x="55" y="275">SERVICE</text><text x="485" y="295">STAIR</text><text x="235" y="475">APARTMENT</text><text x="352" y="170">E1 ↑</text></g><text x="30" y="510" fill="#425e48" font-size="13">8 TEILOR STREET / ${completed ? "COMPLETED SERVICE WORKS / B" : "RETAINED DESK COPY / A"} / NORTH ↑</text></svg><figcaption>Same drawing scale and camera position. Compare openings, not the apparent extent of the camera image.</figcaption></figure>`;
}
export function catalogue() {
  return `<div class="catalogue-drawer"><div class="catalogue-tabs"><span>A</span><span>B</span><span>C</span><span>D</span></div><p>RADIO WORKSHOP / ORIGINAL INDEX</p><table><thead><tr><th>Reel word</th><th>Shelf</th><th>Drawer</th><th>Sequence</th></tr></thead><tbody><tr><td>LANTERN</td><td>B</td><td>1</td><td>4</td></tr><tr><td>MEADOW</td><td>A</td><td>4</td><td>1</td></tr><tr><td>ORCHID</td><td>D</td><td>3</td><td>2</td></tr></tbody></table><p>The last wheel counts long pulses in the slate. Shelf letters: A=1, B=2, C=3, D=4.</p></div>`;
}
export function contactSheet() {
  return `<figure class="examination-diagram"><svg viewBox="0 0 700 340" role="img" aria-label="Diagram of a partial undated contact impression beside a gift photograph reference. Contact is not a timestamp."><rect width="700" height="340" fill="#e8dfc7"/><g transform="translate(75 40)" fill="none" stroke="#344d3c" stroke-width="2">${Array.from({ length: 20 }, (_, i) => `<path d="M${15 + i * 3} ${220 - i * 3} C${-30 + i * 5} ${80 + i * 2},${140 - i * 2} ${-35 + i * 5},${180 - i * 2} ${90 + i * 3} Q${205 - i * 3} ${180 - i},${115 - i} ${220 - i * 3}"/>`).join("")}</g><g font-family="monospace" font-size="15" fill="#344d3c"><text x="340" y="80">CONTACT IMPRESSION</text><text x="340" y="115">Partial / undated contact</text><text x="340" y="155">A surface mark is not a clock.</text><text x="340" y="200">Compare independently retained</text><text x="340" y="225">custody and physical layering.</text></g><text x="30" y="315" font-size="12" fill="#344d3c">Examination diagram / no date or intention can be inferred from contact alone</text></svg></figure>`;
}
