// Functional listening/migration fixture, not a blind story playthrough.
const assert = require("node:assert/strict"),
  puppeteer = require("puppeteer-core");
(async () => {
  await import("./test_engine.mjs");
  const E = await import("../../casework/src/engine.js");
  const { CONTENT: C } = await import("../../casework/src/content.js");
  const saved = structuredClone(E.state);
  delete saved.findings.alignment;
  saved.drafts.alignment = {};
  saved.intro = 3;
  saved.notes = "Earlier preview notes are preserved.";
  saved.listened = saved.listened.filter(
    (id) => !["assembly", "original-reel"].includes(id),
  );
  const puzzle = C.puzzles.find((p) => p.id === "alignment");
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
  await p.setViewport({ width: 1365, height: 1000 });
  await p.evaluateOnNewDocument(()=>{const AudioClass=window.Audio;window.audioProbe=[];window.Audio=function(...args){const a=new AudioClass(...args);window.audioProbe.push(a);return a};window.Audio.prototype=AudioClass.prototype;});

  await p.goto(process.env.CASEWORK_URL || "http://localhost:8096/");
  await p.evaluate(
    (raw) =>
      localStorage.setItem("lastarchive.casework.v1", JSON.stringify(raw)),
    saved,
  );
  await p.reload();
  await p.evaluate(()=>navigator.serviceWorker.ready);await p.waitForFunction(()=>navigator.serviceWorker.controller);
  await p.waitForSelector("#casebook");
  await p.click("#casebook");
  await p.click('dialog[open] [data-puzzle="alignment"]');
  await p.waitForFunction(
    () =>
      [...document.querySelectorAll("dialog")].at(-1).dataset.listeningReady ===
      "true",
  );
  let checks = 0;
  await p.setViewport({ width: 390, height: 844 });
  await p.click('[data-listening-tab="assembly"]');
  assert.equal(await p.$eval('[data-listening="original-reel"]', el => getComputedStyle(el).display), 'none');
  assert.notEqual(await p.$eval('[data-listening="assembly"]', el => getComputedStyle(el).display), 'none');
  checks++;
  await p.click('[data-listening-tab="original-reel"]');
  assert.notEqual(await p.$eval('[data-listening="original-reel"]', el => getComputedStyle(el).display), 'none');
  checks++;
  await p.setViewport({ width: 1365, height: 1000 });
  for (let i = 0; i < 3; i++)
    await p.select(`[name="segment.${i}"]`, puzzle.answer.segments[i]);
  await p.select('[name="omitted"]', puzzle.answer.omitted);
  await p.select('[name="claim"]', puzzle.answer.claim);
  await p.click('button[type="submit"]');
  assert.ok(
    await p.$eval("#comparison-feedback", (el) =>
      el.textContent.includes("Inspect both recordings"),
    ),
  );
  checks++;
  await p.evaluate(() => {
    window.lastRecording = null;
    window.addEventListener(
      "recording-time",
      (e) => (window.lastRecording = e.detail),
    );
  });
  await p.click('[data-listen-id="original-reel"][data-listen-line="3"]');
  try{await p.waitForFunction(()=>window.lastRecording?.id==='original-reel'&&window.lastRecording.time>10,{timeout:8000});}catch(e){console.error(await p.evaluate(()=>({last:window.lastRecording,players:window.audioProbe.map(a=>({time:a.currentTime,duration:a.duration,paused:a.paused,ready:a.readyState,error:a.error?.code,seekable:Array.from({length:a.seekable.length},(_,i)=>[a.seekable.start(i),a.seekable.end(i)])})),toast:document.querySelector('#toast')?.textContent,button:!!document.querySelector('[data-listen-id="original-reel"][data-listen-line="3"]')?.onclick})));throw e;}
  assert.ok(
    await p.$eval(
      '[data-waveform-id="original-reel"] .listening-playhead',
      (el) => parseFloat(el.style.left) > 10,
    ),
  );
  checks++;
  await p.click('[data-listening="original-reel"] [data-listen-pause]');
  assert.equal(
    await p.$$eval(".listening-panel.is-playing", (els) => els.length),
    0,
  );
  checks++;
  await p.click('[data-listen-play="assembly"]');
  await p.waitForFunction(
    () =>
      window.lastRecording?.id === "assembly" && window.lastRecording.time > 0,
  );
  assert.equal(
    await p.$$eval(".listening-panel.is-playing", (els) => els.length),
    1,
  );
  checks++;
  await p.click('[data-listening="assembly"] [data-listen-pause]');
  await p.select('[name="omitted"]', "0");
  await p.click('button[type="submit"]');
  assert.ok(
    !(await p.evaluate(
      () =>
        JSON.parse(localStorage.getItem("lastarchive.casework.v1")).findings
          .alignment,
    )),
  );
  checks++;
  await p.select('[name="omitted"]', puzzle.answer.omitted);
  await p.click('button[type="submit"]');
  await p.waitForSelector("#finding-followup");
  const result = await p.evaluate(() =>
    JSON.parse(localStorage.getItem("lastarchive.casework.v1")),
  );
  assert.equal(result.chapter, 9);
  assert.equal(result.notes, saved.notes);
  assert.ok(
    result.findings.case &&
      result.findings.confrontation &&
      result.findings.alignment.observations.length === 2,
  );
  checks++;
  await p.click("#finding-followup");
  await p.click('[data-question="3"]');
  assert.equal(
    await p.$eval("#spoken", (el) => el.textContent),
    C.interviews.elena.questions[3][1],
  );
  checks++;
  await p.reload();
  await p.click("#casebook");
  await p.click('.retained-observation [data-source="audio.original-reel"]');
  assert.ok(await p.$('[data-listening="original-reel"]'));
  checks++;
  await p.setViewport({ width: 390, height: 844 });
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  checks++;
  await b.close();
  console.log(
    `${checks} listening, actual playback/seek, retained-source, follow-up and existing-save checks passed. Not blind playtesting.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
