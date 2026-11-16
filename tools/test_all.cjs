// Existing story-bearing suites remain local to development. Print only a spoiler-free summary.
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let checks = 0,
  failed = false;
for (const file of [
  "t.js",
  "t2.js",
  "t3.js",
  "t5.js",
  "t6.js",
  "t7.js",
  "t8.js",
  "t9.js",
  "prog.js",
]) {
  const r = spawnSync(process.execPath, [file], {
    cwd: root,
    encoding: "utf8",
  });
  const count = (r.stdout.match(/^PASS /gm) || []).length;
  const bad = r.status !== 0 || /^FAIL /m.test(r.stdout);
  console.log(`${bad ? "FAIL" : "PASS"} ${file}: ${count} checks`);
  checks += count;
  failed ||= bad;
  if (bad)
    console.error(
      "Inspect the suite locally; its output may contain story solutions.",
    );
}
console.log(
  `${checks} passing checks; ${failed ? "regressions detected" : "all suites passed"}.`,
);
process.exitCode = failed ? 1 : 0;
