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
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.waitForFunction(() => navigator.serviceWorker.controller);
  await p.click("#begin");
  for (let i = 0; i < 3; i++) await p.click("#continue");
  await p.click('[data-source="phone-object"]');
  await p.click("#recover-phone");
  await p.click('[data-go="home"]');
  await p.click('[data-go="messages"]');
  await p.click('[data-thread="mara"]');
  await p.click(".retain-message");
  await p.click('[data-system="close"]');
  const saved = await p.evaluate(() =>
    localStorage.getItem("lastarchive.casework.v1"),
  );
  await p.setOfflineMode(true);
  await p.reload({ waitUntil: "networkidle0" });
  assert.ok(await p.$(".scene-objective"), "game resumes offline");
  assert.equal(
    await p.evaluate(() => localStorage.getItem("lastarchive.casework.v1")),
    saved,
    "offline save preserved",
  );
  await p.click("#phone");
  assert.ok(await p.$(".app-thread"), "phone restores offline");
  assert.ok(
    await p.evaluate(async () => {
      const manifest = await (await fetch("assets/audio/manifest.json")).json();
      const r = await fetch(manifest.clips.briefing.file);
      return r.ok && (await r.arrayBuffer()).byteLength > 1000;
    }),
    "actual recording cached offline",
  );
  const ranges=await p.evaluate(async()=>{const m=await(await fetch('assets/audio/manifest.json')).json();const file=m.clips.briefing.file;const full=new Uint8Array(await(await fetch(file)).arrayBuffer());const first=await fetch(file,{headers:{Range:'bytes=0-127'}});const data=new Uint8Array(await first.arrayBuffer());const suffix=await fetch(file,{headers:{Range:'bytes=-128'}});const invalid=await fetch(file,{headers:{Range:'bytes='+full.length+'-'}});return {first:first.status,contentRange:first.headers.get('Content-Range'),same:data.length===128&&data.every((v,i)=>v===full[i]),suffix:suffix.status,suffixBytes:(await suffix.arrayBuffer()).byteLength,invalid:invalid.status};});assert.equal(ranges.first,206);assert.ok(ranges.same);assert.equal(ranges.suffix,206);assert.equal(ranges.suffixBytes,128);assert.equal(ranges.invalid,416);
  await b.close();
  console.log(
    "Offline installation, cold reload, saved phone context and cached audio and byte-range seeking verified in Chromium.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
