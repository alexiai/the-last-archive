const assert = require("node:assert/strict"),
  puppeteer = require("puppeteer-core");
(async () => {
  const b = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      ...(process.env.TEST_PROXY_TLS === "1"
        ? ["--ignore-certificate-errors"]
        : []),
    ],
  });
  const p = await b.newPage();
  await p.goto(process.env.CASEWORK_URL || "http://localhost:8092/");
  await p.waitForSelector("#begin");
  const result = await p.evaluate(async () => {
    const m = await (await fetch("assets/audio/manifest.json")).json();
    const entries = Object.entries(m.clips);
    let count = 0;
    for (let i = 0; i < entries.length; i += 5) {
      await Promise.all(
        entries.slice(i, i + 5).map(
          ([id, c]) =>
            new Promise((resolve, reject) => {
              const a = new Audio(c.file),
                timer = setTimeout(
                  () => reject(Error("Recording metadata timeout")),
                  12000,
                );
              a.onloadedmetadata = () => {
                clearTimeout(timer);
                if (
                  !Number.isFinite(a.duration) ||
                  Math.abs(a.duration - c.duration) > 0.2
                )
                  reject(Error("Recording duration mismatch"));
                else {
                  count++;
                  a.removeAttribute("src");
                  a.load();
                  resolve();
                }
              };
              a.onerror = () => {
                clearTimeout(timer);
                reject(Error("Recording decode failed"));
              };
              a.load();
            }),
        ),
      );
    }
    return count;
  });
  assert.equal(
    result,
    await p.evaluate(
      async () =>
        Object.keys(
          (await (await fetch("assets/audio/manifest.json")).json()).clips,
        ).length,
    ),
  );
  await p.click("#begin");
  if (await p.$("#film-read")) await p.click("#film-read");
  await p.click("#briefing-play");
  await p.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("lastarchive.casework.v1"),
    ).listened.includes("briefing"),
  );
  await b.close();
  console.log(
    `${result} finished recordings decoded in Chromium; explicit in-game briefing playback started. Voice performance still requires listening review.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
