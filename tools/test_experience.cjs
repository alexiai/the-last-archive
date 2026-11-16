// Browser checks for the new presentation, using real local assets under a repository path.
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path"),
  p = require("puppeteer-core");
const root = path.resolve(__dirname, "..");
let count = 0;
function check(name, ok) {
  if (!ok) throw Error(name);
  count++;
  console.log("PASS " + name);
}
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(
    new URL(req.url, "http://local").pathname,
  ).replace(/^\/repo\//, "");
  const file = path.resolve(root, rel || "index.html");
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (err, b) => {
    if (err) {
      res.writeHead(404).end();
      return;
    }
    const type = {
      ".js": "text/javascript",
      ".css": "text/css",
      ".html": "text/html",
      ".jpg": "image/jpeg",
      ".png": "image/png",
    }[path.extname(file)];
    res.setHeader("Content-Type", type || "application/octet-stream");
    res.end(b);
  });
});
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}/repo/index.html`;
  const browser = await p.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    for (const width of [320, 390, 1280]) {
      const pg = await browser.newPage();
      await pg.setViewport({
        width,
        height: 844,
        isMobile: width < 500,
        hasTouch: width < 500,
      });
      const errs = [];
      pg.on("pageerror", (e) => errs.push(e.message));
      await pg.goto(url);
      await pg.evaluate(() => localStorage.clear());
      await pg.reload();
      await pg.click(".notif");
      await pg.evaluate(() => chapters());
      check(
        width + " future chapter titles remain unrecovered",
        await pg.evaluate(
          () =>
            document.querySelectorAll(".chapter-row.locked").length === 8 &&
            [...document.querySelectorAll(".chapter-row.locked h3")].every(
              (h) => h.textContent === "Unrecovered archive",
            ),
        ),
      );
      await pg.evaluate(() => profiles());
      check(
        width + " undiscovered contacts stay hidden",
        await pg.evaluate(
          () =>
            !document
              .querySelector("#screen")
              .textContent.includes("Luca Marin"),
        ),
      );
      await pg.evaluate(() => {
        E.take("E2");
        E.take("E8");
        E.take("E3");
        E.take("E4");
        board();
      });
      check(
        width + " new board starts with real evidence cards",
        await pg.evaluate(
          () =>
            document.querySelectorAll("#bd g[data-id]").length === 4 &&
            !!document.querySelector("#bd image"),
        ),
      );
      await pg.evaluate(() => {
        pickN("E2");
        pickN("E8");
      });
      check(
        width + " both selected board cards are highlighted",
        await pg.evaluate(() =>
          ["E2", "E8"].every(
            (id) =>
              document
                .querySelector(`#bd g[data-id="${id}"] rect`)
                .getAttribute("stroke") === "#c76558",
          ),
        ),
      );
      await pg.evaluate(() => {
        R = "contradicts";
        test();
      });
      check(
        width + " board validation delegates to existing engine",
        await pg.evaluate(() => S.made.some((m) => m[1] === "proved")),
      );
      await pg.evaluate(() => evidenceDetail("E3"));
      await pg.waitForFunction(
        () => document.querySelector("#screen img")?.naturalWidth > 0,
      );
      check(
        width + " evidence details show installed photo and source",
        await pg.evaluate(() =>
          document
            .querySelector("#screen")
            .textContent.includes("Source: Gallery"),
        ),
      );
      await pg.evaluate(() => openEvidenceSource("E3"));
      check(
        width + " evidence source opens image inspection",
        await pg.evaluate(() => !!document.querySelector("#photo-frame")),
      );
      await pg.evaluate(() => {
        photoZoom(1.4);
        photoZoom(1.4);
      });
      check(
        width + " inspection zoom changes transform",
        await pg.evaluate(
          () =>
            photoScale > 1 &&
            document
              .querySelector("#photo-frame .zoom")
              .style.transform.includes("scale(1."),
        ),
      );
      await pg.evaluate(() => {
        nbk();
        document.querySelector("#nb2").value = "A player observation";
        document
          .querySelector("#nb2")
          .dispatchEvent(new Event("input", { bubbles: true }));
      });
      await pg.reload();
      check(
        width + " mobile notebook survives reload",
        await pg.evaluate(
          () =>
            S.nb === "A player observation" &&
            document.querySelector("#nb").value === S.nb,
        ),
      );
      const views = [
        "home()",
        "profiles()",
        'subject("adrian")',
        "chapters()",
        "caseTimeline()",
        'evidenceDetail("E3")',
        'photo("E3")',
        "help()",
        "maps()",
        'pz("p1")',
      ];
      let overflow = [];
      for (const f of views) {
        await pg.evaluate((s) => eval(s), f);
        const bad = await pg.evaluate(
          () =>
            document.documentElement.scrollWidth > innerWidth ||
            document.querySelector("#screen").scrollWidth >
              document.querySelector("#screen").clientWidth + 1,
        );
        if (bad) overflow.push(f);
      }
      check(
        width + " new views fit without horizontal overflow",
        !overflow.length,
      );
      await pg.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ]);
      await pg.evaluate(() => home());
      check(
        width + " reduced motion respected",
        await pg.evaluate(
          () =>
            getComputedStyle(document.querySelector(".archive-index"))
              .animationName === "none",
        ),
      );
      await pg.evaluate(() => {
        board();
        toggleBoardFocus();
      });
      check(
        width + " focused board uses the viewport",
        await pg.evaluate(
          () =>
            document.body.classList.contains("board-focus") &&
            Math.abs(
              document.querySelector("#phone").getBoundingClientRect().height -
                innerHeight,
            ) < 2,
        ),
      );
      await pg.keyboard.press("Escape");
      check(
        width + " Escape returns to the work surface",
        await pg.evaluate(
          () =>
            !document.body.classList.contains("board-focus") &&
            !document.querySelector("#exit-board-focus"),
        ),
      );
      await pg.evaluate(() => talk("adrian"));
      check(
        width + " interview choices stay alongside the transcript",
        await pg.evaluate(
          () =>
            !!document.querySelector(".interview-response .m") &&
            document.querySelectorAll(".interview-response button").length >= 4,
        ),
      );
      await pg.evaluate(() => photo("E3"));
      await pg.waitForFunction(
        () => document.querySelector("#photo-frame img")?.naturalWidth > 0,
      );
      await pg.waitForFunction(() =>
        [
          ...document.querySelectorAll("#photo-frame svg,#photo-frame .tile"),
        ].every((e) => getComputedStyle(e).visibility === "hidden"),
      );
      check(
        width + " image inspection hides the old drawn fallback",
        await pg.evaluate(() =>
          [
            ...document.querySelectorAll("#photo-frame svg,#photo-frame .tile"),
          ].every((e) => getComputedStyle(e).visibility === "hidden"),
        ),
      );
      await pg.evaluate(() => doc("m1"));
      check(
        width + " document reading leaves the device layout",
        await pg.evaluate(
          () =>
            document.body.dataset.medium === "paper" &&
            document.body.dataset.world === "archive",
        ),
      );
      check(width + " no uncaught browser errors", errs.length === 0);
      await pg.close();
    }
    const photos = fs.readdirSync(path.join(root, "assets/photos"));
    check("all 23 real photographs installed", photos.length === 23);
    check(
      "all eight portrait/mark files installed",
      fs.readdirSync(path.join(root, "assets/portraits")).length === 8,
    );
    console.log(`${count} experience checks passed`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error("FAIL", e.message);
  server.close();
  process.exitCode = 1;
});
