/* Authored-solution UI regression. Never presented as a blind first playthrough. */
const assert = require("node:assert/strict"),
  puppeteer = require("puppeteer-core");
(async () => {
  const { CONTENT: C } = await import("../../casework/src/content.js");
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 1000 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    process.env.CASEWORK_URL || "http://localhost:8091/casework/",
  );
  for (const id of ["begin", "continue", "continue", "continue"]) {
    await page.waitForSelector("#" + id);
    await page.click("#" + id);
  }
  await page.click('[data-source="phone-object"]');
  await page.click("#recover-phone");
  await page.click('[data-system="close"]');
  let checks = 0;
  async function closeTop() {
    await page.evaluate(() =>
      [...document.querySelectorAll("dialog[open]")]
        .at(-1)
        .querySelector(".close-dialog")
        .click(),
    );
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
  }
  async function source(id) {
    await page.evaluate(
      (id) =>
        [...document.querySelectorAll("dialog[open]")]
          .at(-1)
          .querySelector(`[data-source="${id}"]`)
          .click(),
      id,
    );
    await page.waitForSelector("#reading");
  }
  for (const p of C.puzzles) {
    console.log("Checking authored chapter", p.chapter, p.type);
    await page.click("#casebook");
    await page.click(`[data-puzzle="${p.id}"]`);
    let refs = {};
    if (p.type === "evidence") {
      for (const [key, [id, reading]] of Object.entries(p.slots)) {
        await source(id);
        if (["photo", "surveillance"].includes(C.sources[id].kind))
          await page.click("#text-location");
        await page.select("#reading", reading);
        await page.click("#retain");
        await closeTop();
        const state = await page.evaluate(() =>
          JSON.parse(localStorage.getItem("lastarchive.casework.v1")),
        );
        refs[key] = state.observations.find(
          (o) => o.source === id && o.reading === reading,
        ).id;
      }
      // Source observations are intentionally re-read when reopening a comparison.
      await closeTop();
      await page.evaluate(
        (id) =>
          [...document.querySelectorAll("dialog[open]")]
            .at(-1)
            .querySelector(`[data-puzzle="${id}"]`)
            .click(),
        p.id,
      );
      for (const [key, id] of Object.entries(refs))
        await page.select(`[name="ref.${key}"]`, id);
      await page.select('[name="account"]', p.answer);
    } else if (p.type === "order") {
      for (const v of p.answer) await page.click(`[data-order="${v}"]`);
    } else if (["code", "morse", "lock"].includes(p.type)) {
      await page.type('[name="value"]', p.answer);
    } else if (p.type === "timing") {
      await source("hotel-camera");
      await page.click("#text-location");
      await page.select("#reading", "crossing");
      await page.click("#retain");
      await closeTop();
      await page.type('[name="time"]', p.answer.time);
      await page.type('[name="gap"]', p.answer.gap);
      await page.select('[name="claim"]', p.answer.claim);
    } else if (p.type === "trace") {
      for (const [k, v] of Object.entries(p.answer))
        await page.select(`[name="${k}"]`, v);
    } else if (p.type === "plan") {
      for (const v of p.answer) await page.click(`[data-route="${v}"]`);
    } else if (p.type === "audio") {
      for (const id of p.sources) {
        await source(id);
        await page.click("#read-sound");
        await closeTop();
      }
      await page.select('[name="place"]', p.answer);
    } else if (p.type === "case") {
      for (const [k, v] of Object.entries(p.answer))
        await page.select(`[name="${k}"]`, v);
    } else await page.select('[name="privacy"]', "summary");
    await page.evaluate(() =>
      [...document.querySelectorAll("dialog[open]")]
        .at(-1)
        .querySelector("form")
        .requestSubmit(),
    );
    const state = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lastarchive.casework.v1")),
    );
    assert.ok(state.findings[p.id], `comparison ${p.id} completes through UI`);
    checks++;
    await closeTop();
    while (await page.$("dialog[open]")) await closeTop();
    await page.reload();
    const resumed = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lastarchive.casework.v1")),
    );
    assert.ok(resumed.findings[p.id], "finding survives browser reload");
    checks++;
  }
  assert.equal(errors.length, 0, errors.join(";"));
  await browser.close();
  console.log(
    `${checks} complete-campaign UI checks passed across nine chapters, including reloads. Authored route; no playtime claim.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
