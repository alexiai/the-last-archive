const assert = require("node:assert/strict");
const puppeteer = require("puppeteer-core");
(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  let checks = 0;
  const check = (v, m) => {
    assert.ok(v, m);
    checks++;
  };
  for (const size of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage();
    await page.setViewport(size);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      process.env.CASEWORK_URL || "http://localhost:8091/casework/",
    );
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem("lastarchive.fieldwork.v1", "preserved");
    });
    await page.reload();
    for (const id of ["begin", "continue", "continue", "continue"]) {
      await page.waitForSelector("#" + id);
      await page.click("#" + id);
    }
    check(await page.$(".scene-objective"), "opening reaches crime scene");
    check(
      await page.$eval("#phone", (b) => b.disabled),
      "phone unavailable until recovered",
    );
    await page.click('[data-source="scene-wide"]');
    await page.select("#reading", "east");
    await page.click("#retain");
    check(
      await page.$eval("#toast", (e) => e.textContent.includes("Mark a point")),
      "photo requires actual inspection",
    );
    await page.click("#text-location");
    await page.type("#observation-note", "Working note retained");
    await page.click("#retain");
    await page.click(".close-dialog");
    await page.click('[data-source="phone-object"]');
    await page.click("#recover-phone");
    await page.click('[data-go="home"]');
    await page.click('[data-go="messages"]');
    check(
      (await page.$$eval(".phone-row", (x) => x.length)) === 6,
      "six authored threads",
    );
    await page.click('[data-thread="mara"]');
    check(
      (await page.$$eval(".phone-message", (x) => x.length)) > 3,
      "thread contains actual messages",
    );
    await page.click(".retain-message");
    await page.click('[data-system="home"]');
    await page.click('[data-go="calendar"]');
    check(
      (await page.$eval(
        ".calendar-grid",
        (el) => el.children[2].textContent,
      )) === "1",
      "October weekday alignment",
    );
    await page.click('[data-day="14"]');
    check(
      await page.$("[data-calendar-retain]"),
      "appointment can be retained",
    );
    await page.click("[data-calendar-retain]");
    await page.click('[data-system="home"]');
    await page.click('[data-go="calls"]');
    await page.click('[data-call="elena"]');
    check(
      await page.$('[data-source="audio.voicemail-elena"]'),
      "call record leads to actual voicemail",
    );
    await page.click('[data-system="close"]');
    await page.click("#casebook");
    check(
      (await page.$$eval(".retained-observation", (x) => x.length)) >= 3,
      "casebook holds retained observations",
    );
    await page.type("#case-notes", "Keep this question across reloads.");
    await page.click("#new-theory");
    await page.type(".theory-title", "My working theory");
    await page.select(".theory-link", "o1");
    await page.select(".theory-role", "challenge");
    await page.click(".attach");
    check(
      await page.$eval(".theory", (el) => el.textContent.includes("challenge")),
      "theory retains contradicting source",
    );
    await page.click(".close-dialog");
    await page.reload();
    await page.click("#casebook");
    check(
      (await page.$eval("#case-notes", (el) => el.value)) ===
        "Keep this question across reloads.",
      "notes survive reload",
    );
    check(
      (await page.$$eval(".retained-observation", (x) => x.length)) >= 3,
      "observations survive reload",
    );
    await page.click(".close-dialog");
    await page.click("#phone");
    check(await page.$(".app-call"), "phone context restored");
    await page.click('[data-system="close"]');
    check(
      (await page.evaluate(() =>
        localStorage.getItem("lastarchive.fieldwork.v1"),
      )) === "preserved",
      "old saves untouched",
    );
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "no horizontal page overflow",
    );
    check(errors.length === 0, "no runtime errors: " + errors.join(";"));
    await page.close();
  }
  await browser.close();
  console.log(
    `${checks} desktop/mobile browser checks passed. Not a blind playthrough.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
