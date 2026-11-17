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
  const network = [];
  if (process.env.NO_NETWORK === "1") {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().startsWith("http") && !req.isNavigationRequest()) {
        if (!req.url().endsWith("/favicon.ico")) network.push(req.url());
        req.abort();
      } else req.continue();
    });
  }
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
  for (const privacy of ["sealed", "summary", "consented"]) {
    await page.click("#casebook");
    await page.click("details summary");
    await page.click('[data-puzzle="confrontation"]');
    await page.select('[name="privacy"]', privacy);
    await page.click('button[type="submit"]');
    await page.waitForSelector("#ending-response");
    for (let i = 0; i < C.ending.questions.length; i++) {
      await page.click(`[data-ending-question="${i}"]`);
      assert.equal(
        await page.$eval("#ending-response", (el) => el.textContent),
        C.ending.questions[i][1],
        "optional final conversation plays the authored response",
      );
      checks++;
    }
    await page.click("#ending-next");
    assert.ok(
      await page.$eval("#aftermath", (el) => !el.hidden),
      "aftermath has its own stage",
    );
    checks++;
    await page.click("#aftermath-next");
    assert.ok(
      await page.$eval("#last-page", (el) => !el.hidden),
      "final human aftermath remains accessible",
    );
    checks++;
    assert.ok(
      (await page.$eval("#private-outcome", (el) => el.textContent)).includes(
        C.ending.privacy[privacy].text,
      ),
      "choice produces its own authored aftermath",
    );
    checks++;
    await closeTop();
    await page.reload();
    const resumed = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lastarchive.casework.v1")),
    );
    assert.equal(resumed.decisions.privacy, privacy);
    assert.equal(resumed.chapter, 9);
    assert.ok(resumed.findings.case && resumed.findings.confrontation);
    checks++;
  }
  await page.click("#settings");
  await page.click("#replay-opening");
  for (let i = 0; i < 3; i++) await page.click("#continue");
  assert.ok(await page.$(".scene-objective"));
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("lastarchive.casework.v1")).chapter,
    ),
    9,
    "opening replay preserves completed progression",
  );
  checks++;
  page.on("dialog", (dialog) => dialog.accept());
  await page.click("#settings");
  await page.click("#restart-case");
  await page.waitForSelector("#continue");
  const fresh = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lastarchive.casework.v1")),
  );
  assert.equal(fresh.chapter, 1);
  assert.equal(Object.keys(fresh.findings).length, 0);
  assert.equal(fresh.observations.length, 0);
  checks++;
  assert.equal(errors.length, 0, errors.join(";"));
  assert.equal(
    network.length,
    0,
    "self-contained copy must not request external game assets",
  );
  await browser.close();
  console.log(
    `${checks} complete-campaign UI checks passed across nine chapters, including reloads. Authored route; no playtime claim.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
