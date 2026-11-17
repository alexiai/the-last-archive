const assert = require("node:assert/strict"),
  puppeteer = require("puppeteer-core");
(async () => {
  const { GEOMETRY: G } = await import("../../casework/src/geometry.js");
  const b = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox", ...(process.env.TEST_PROXY_TLS==='1'?['--ignore-certificate-errors']:[])],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 1000 });
  await p.goto(process.env.CASEWORK_URL || "http://localhost:8092/");
  for (const id of ["begin", "continue", "continue", "continue"]) {
    await p.waitForSelector("#" + id);
    await p.click("#" + id);
  }
  await p.click('[data-source="phone-object"]');
  await p.click("#recover-phone");
  await p.click('[data-system="close"]');
  let count = 0;
  async function mark(source, key, reading, zoom = false) {
    await p.click(`[data-source="${source}"]`);
    await p.waitForFunction(
      () =>
        document.querySelector("#original-image")?.complete &&
        document.querySelector("#original-image")?.naturalWidth > 0,
    );
    if (zoom)
      await p.$eval("#magnify", (el) => {
        el.value = "2";
        el.dispatchEvent(new Event("input", { bubbles: true }));
      });
    const point = G[source][key];
    const at = await p.evaluate((point) => {
      const surface = document.querySelector(".photo-surface"),
        v = document.querySelector(".photo-viewport");
      v.scrollLeft = point[0] * surface.clientWidth - v.clientWidth / 2;
      v.scrollTop = point[1] * surface.clientHeight - v.clientHeight / 2;
      const r = surface.getBoundingClientRect();
      return { x: r.left + point[0] * r.width, y: r.top + point[1] * r.height };
    }, point);
    await p.mouse.click(at.x, at.y);
    await p.select("#reading", reading);
    await p.click("#retain");
    const o = await p.evaluate(
      (source) =>
        JSON.parse(
          localStorage.getItem("lastarchive.casework.v1"),
        ).observations.find((o) => o.source === source),
      source,
    );
    assert.equal(o.mode, "marked");
    assert.ok(
      Math.hypot(o.point[0] - point[0], o.point[1] - point[1]) < 0.01,
      "retained point matches the inspected feature under magnification/scroll",
    );
    count++;
    await p.click(".close-dialog");
  }
  await mark("scene-wide", "sofa", "east", true);
  await mark("scene-table", "table", "ring");
  await mark("scene-shelf", "shelf", "gap");
  await p.click("#phone");
  await p.click('[data-go="home"]');
  await p.click('[data-go="camera"]');
  await mark("room-before", "sofa", "north");
  await p.click('[data-system="close"]');
  await p.click("#casebook");
  await p.click('[data-puzzle="room"]');
  const obs = await p.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lastarchive.casework.v1")).observations,
  );
  for (const [key, source] of Object.entries({
    current: "scene-wide",
    earlier: "room-before",
    detail: "scene-shelf",
    table: "scene-table",
  }))
    await p.select(
      `[name="ref.${key}"]`,
      obs.find((o) => o.source === source).id,
    );
  await p.select('[name="account"]', "changed");
  await p.click('button[type="submit"]');
  assert.equal(
    await p.evaluate(
      () => JSON.parse(localStorage.getItem("lastarchive.casework.v1")).chapter,
    ),
    2,
  );
  count++;
  await b.close();
  console.log(
    `${count} visual-inspection checks passed through actual image marking, zoom/scroll and the first supported finding. No text-location substitute used.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
