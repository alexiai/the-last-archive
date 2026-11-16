// Run the existing real-browser suites on a portable local server and isolated missing-asset copy.
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os"),
  { spawn } = require("node:child_process");
const root = path.resolve(__dirname, ".."),
  fixture = fs.mkdtempSync(path.join(os.tmpdir(), "archive-fixture-"));
fs.cpSync(root, fixture, {
  recursive: true,
  filter: (src) =>
    ![".git", "node_modules", "dist"].includes(path.basename(src)),
});
for (const file of [
  "assets/photos/P17.jpg",
  "assets/photos/P18.jpg",
  "assets/portraits/julia.png",
  "assets/audio/a1.mp3",
])
  fs.rmSync(path.join(fixture, file), { force: true });
fs.mkdirSync("/tmp/br", { recursive: true });
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://local").pathname;
  const base = url.startsWith("/fixture/repo/") ? fixture : root;
  const rel = decodeURIComponent(url.replace(/^\/(fixture\/)?repo\//, ""));
  const file = path.resolve(base, rel);
  if (!file.startsWith(base + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (err, b) => {
    if (err) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      {
        ".js": "text/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".png": "image/png",
        ".jpg": "image/jpeg",
      }[path.extname(file)] || "application/octet-stream",
    );
    res.end(b);
  });
});
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  let failed = false,
    total = 0;
  try {
    for (const file of ["b4.js", "b6.js"]) {
      const result = await new Promise((resolve) => {
        const child = spawn(process.execPath, [file], {
          cwd: root,
          env: {
            ...process.env,
            GAME_URL: base + "/repo/index.html",
            FIXTURE_URL: base + "/fixture/repo/index.html",
          },
        });
        let out = "";
        child.stdout.on("data", (b) => (out += b));
        child.stderr.on("data", (b) => (out += b));
        child.on("exit", (code) => resolve({ code, out }));
      });
      const n = (result.out.match(/^PASS /gm) || []).length;
      const bad = result.code !== 0 || /^FAIL|^ERR/m.test(result.out);
      console.log(`${bad ? "FAIL" : "PASS"} ${file}: ${n} checks`);
      total += n;
      failed ||= bad;
      if (bad)
        console.error(
          result.out
            .split("\n")
            .filter((l) => /^FAIL|^ERR/.test(l))
            .join("\n"),
        );
    }
    console.log(`${total} browser checks passed.`);
    process.exitCode = failed ? 1 : 0;
  } finally {
    server.close();
    fs.rmSync(fixture, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e.message);
  server.close();
  fs.rmSync(fixture, { recursive: true, force: true });
  process.exitCode = 1;
});
