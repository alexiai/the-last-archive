// Development-only WebKit checks. Linux WebKit does not certify physical iPhone Safari.
const assert = require("node:assert/strict");
const { webkit } = require("playwright");
(async () => {
  const browser = await webkit.launch({
    headless: true,
    ...(process.env.WEBKIT_PATH
      ? { executablePath: process.env.WEBKIT_PATH }
      : {}),
  });
  let checks = 0;
  for (const width of [390, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      ignoreHTTPSErrors: process.env.TEST_PROXY_TLS === "1",
      hasTouch: width === 390,
      isMobile: width === 390,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      process.env.CASEWORK_URL || "http://localhost:8091/casework/",
    );
    for (const id of ["begin", "continue", "continue", "continue"])
      await page.locator("#" + id).click();
    assert.ok(await page.locator(".scene").count());
    checks++;
    await page.locator('[data-source="scene-wide"]').click();
    await page.locator("#magnify").fill("2");
    await page.locator("#text-location").click();
    await page.locator("#reading").selectOption("east");
    await page.locator("#observation-note").fill("Keep this inspection note.");
    assert.ok(
      await page
        .locator("#observation-note")
        .evaluate((el) => document.activeElement === el),
      "forensic input retains keyboard focus",
    );
    checks++;
    await page.locator("#retain").click();
    await page.locator(".close-dialog").click();
    await page.locator('[data-source="phone-object"]').click();
    await page.locator("#recover-phone").click();
    await page.locator('[data-go="home"]').click();
    await page.locator('[data-go="messages"]').first().click();
    await page.locator("#phone-search").fill("sandwich");
    assert.ok(await page.locator('[data-thread="mara"]').count());
    checks++;
    await page.locator('[data-thread="mara"]').click();
    await page.locator(".retain-message").first().click();
    await page.locator('[data-system="home"]').click();
    await page.locator('[data-go="calendar"]').click();
    assert.equal(
      await page
        .locator(".calendar-grid")
        .evaluate((el) => el.children[2].textContent),
      "1",
    );
    checks++;
    await page.locator('[data-day="14"]').click();
    await page.locator("[data-calendar-retain]").click();
    await page.locator('[data-system="close"]').click();
    await page.locator("#casebook").click();
    await page.locator("#case-notes").fill("A WebKit working note.");
    await page.locator("#open-chronology").click();
    await page.locator("#new-event").click();
    await page.locator(".event-title").fill("A personally placed event");
    await page.locator(".event-time").fill("00:21");
    await page.locator(".event-source").selectOption("o1");
    assert.ok(await page.locator(".event-open").isEnabled());
    checks++;
    await page.reload();
    await page.locator("#casebook").click();
    assert.equal(
      await page.locator("#case-notes").inputValue(),
      "A WebKit working note.",
    );
    checks++;
    await page.locator("#open-chronology").click();
    assert.equal(
      await page.locator(".event-title").inputValue(),
      "A personally placed event",
    );
    checks++;
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "layout fits",
    );
    checks++;
    assert.equal(errors.length, 0, errors.join(";"));
    checks++;
    await context.close();
  }
  await browser.close();
  console.log(
    `${checks} local WebKit desktop/mobile checks passed. Physical iPhone Safari and blind gameplay remain unverified.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
