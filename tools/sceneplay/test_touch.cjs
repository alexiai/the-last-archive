const assert = require("node:assert/strict"),
  pptr = require("puppeteer-core");
(async () => {
  const b = await pptr.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      ...(process.env.TEST_PROXY_TLS === "1"
        ? ["--ignore-certificate-errors"]
        : []),
    ],
  });
  let checks = 0;
  try {
    const p = await b.newPage();
    await p.setViewport({
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true,
    });
    const base =
      process.env.SCENEPLAY_URL || "http://localhost:8098/sceneplay/";
    await p.goto(base + "?test=1");
    await p.waitForSelector("#new-game", { timeout: 90000 });
    await p.evaluate(() =>
      localStorage.setItem(
        "lastarchive.sceneplay.v1",
        JSON.stringify({
          edition: "sceneplay-1",
          version: 1,
          started: true,
          introSeen: true,
          position: "room",
          phone: true,
        }),
      ),
    );
    await p.reload();
    await p.waitForSelector("#resume-game", { timeout: 90000 });
    await p.click("#resume-game");
    await p.waitForSelector("#pause");
    const client = await p.createCDPSession();
    const yaw = await p.evaluate(() => sceneplayView.lookOffset.yaw);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 180, y: 420 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 280, y: 420 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.notEqual(await p.evaluate(() => sceneplayView.lookOffset.yaw), yaw);
    assert.equal(
      await p.evaluate(
        () =>
          JSON.parse(localStorage.getItem("lastarchive.sceneplay.v1"))
            .observations?.length || 0,
      ),
      0,
    );
    checks++;
    await p.click("#pocket-phone");
    await p.click('[data-app="outbox"]');
    await p.click("#queued-photo");
    await p.waitForFunction(
      () =>
        document.querySelector("#source-photo").complete &&
        document.querySelector("#source-photo").naturalWidth > 0,
    );
    const rect = await p.$eval(".photo-view", (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { id: 1, x: rect.x - 35, y: rect.y },
        { id: 2, x: rect.x + 35, y: rect.y },
      ],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { id: 1, x: rect.x - 80, y: rect.y },
        { id: 2, x: rect.x + 80, y: rect.y },
      ],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.ok(await p.$eval("#photo-zoom", (el) => Number(el.value) > 1.5));
    checks++;
    await p.click("#photo-info");
    await p.click("#keep-metadata");
    assert.ok(
      await p.evaluate(() =>
        JSON.parse(
          localStorage.getItem("lastarchive.sceneplay.v1"),
        ).observations.includes("queued-time"),
      ),
    );
    checks++;
    await p.setViewport({
      width: 844,
      height: 390,
      isMobile: true,
      hasTouch: true,
    });
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.ok(
      await p.$eval("#close-photo", (el) => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight;
      }),
    );
    await p.click("#close-photo");
    assert.ok(
      await p.$eval(".phone-device", (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 650 && Math.abs(r.height - innerHeight) < 2;
      }),
      "landscape orientation uses the wide phone layout rather than a clipped portrait device",
    );
    await p.click("#put-phone-away");
    await p.click("#notebook");
    await p.type("#private-notes", "Landscape focus stays here.");
    assert.equal(
      await p.$eval("#private-notes", (el) => document.activeElement === el),
      true,
    );
    await p.click("#close-notebook");
    assert.ok(await p.$("#pause"));
    checks++;
    console.log(
      `${checks} native touch-look/pinch, original metadata, landscape controls and notebook-focus checks passed. Physical iPhone testing remains separate.`,
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
