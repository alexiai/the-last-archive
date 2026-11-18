/* Actual media/control/source-link regression, never a blind story playthrough. */
const assert=require('node:assert/strict'),puppeteer=require('puppeteer-core');
(async()=>{
 await import('./test_engine.mjs');const E=await import('../../casework/src/engine.js');const {CONTENT:C}=await import('../../casework/src/content.js');
 const fixture=structuredClone(E.state);fixture.intro=3;fixture.started=true;fixture.notes='Existing investigation notes.';
 const t={id:'t0',title:'A question to test',note:'Keep the evidence separate from the interpretation.',status:'testing',links:[{id:fixture.observations[0].id,role:'support'},{id:fixture.observations[1].id,role:'challenge'},{id:fixture.observations[2].id,role:'context'}]};fixture.theories=[t];
 const base=process.env.CASEWORK_URL||'http://localhost:8097/';let checks=0;
 const b=await puppeteer.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox',...(process.env.TEST_PROXY_TLS==='1'?['--ignore-certificate-errors']:[])]});
 try{for(const width of [1365,390]){
  const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width,height:900});await p.goto(base);await p.evaluate(()=>localStorage.removeItem('lastarchive.casework.v1'));await p.reload();await p.evaluate(()=>navigator.serviceWorker.ready);await p.waitForFunction(()=>navigator.serviceWorker.controller);await p.click('#begin');await p.waitForFunction(()=>document.querySelector('#opening-film')?.currentTime>.2);checks++;
  assert.equal(await p.$eval('#opening-film',v=>v.playsInline),true);checks++;if(process.env.CAPTURE_DIR)await p.screenshot({path:process.env.CAPTURE_DIR+`/cinema-review-${width}.png`});
  await p.click('#film-play');assert.equal(await p.$eval('#opening-film',v=>v.paused),true);checks++;
  await p.click('#film-mute');assert.equal(await p.$eval('#opening-film',v=>v.muted),true);checks++;
  await p.evaluate(()=>{document.querySelector('#opening-film').currentTime=23;});await p.waitForFunction(()=>document.querySelector('#film-kicker').textContent.includes('ALEX DIMA'));checks++;
  await p.click('#film-transcript');assert.ok(await p.$('dialog article'));await p.click('dialog .close-dialog');checks++;
  await p.click('#film-read');assert.equal(await p.$('.opening-cinema'),null);assert.ok(await p.$('#briefing-play'));checks++;
  for(let i=0;i<3;i++)await p.click('#continue');assert.ok(await p.$('#casebook'));checks++;
  await p.evaluate(raw=>localStorage.setItem('lastarchive.casework.v1',JSON.stringify(raw)),fixture);await p.reload();await p.click('#records');await p.click('dialog[open] [data-source="hotel-camera"]');
  assert.equal(await p.$$eval('#frame option',opts=>opts.length),9);checks++;
  await p.click('#cctv-play');await p.waitForFunction(()=>{const v=document.querySelector('#cctv-film');return v&&!v.paused&&v.currentTime>4.2});checks++;
  await p.click('#cctv-capture');assert.equal(await p.$eval('#cctv-film',v=>v.paused),true);checks++;
  await p.select('#frame','0');assert.ok(await p.$eval('#original-image',el=>el.src.includes('surveillance/hotel-0.jpg')));assert.ok(await p.$eval('#cctv-time',el=>el.textContent==='00:24:56'));checks++;
  await p.click('#cctv-next');assert.equal(await p.$eval('#cctv-position',el=>el.value),'1');checks++;
  await p.click('.surveillance-console summary');await p.click('[data-cctv-sample="6"]');await p.select('#reading','crossing');await p.click('#text-location');await p.click('#retain');
  const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('lastarchive.casework.v1')));const o=saved.observations.find(o=>o.source==='hotel-camera'&&o.frame===6);assert.ok(o,JSON.stringify({camera:saved.observations.filter(o=>o.source==='hotel-camera'),source:await p.$eval('#cctv-position',el=>el.value),toast:await p.$eval('#toast',el=>el.textContent)}));checks++;
  await p.evaluate(()=>{[...document.querySelectorAll('dialog')].reverse().forEach(d=>d.close())});await p.click('#casebook');await p.click('#open-evidence-wall');
  assert.ok(await p.$('.wall-strings .string-support'));assert.ok(await p.$('.wall-strings .string-challenge'));assert.ok(await p.$('.wall-strings .string-context'));checks++;
  const handle=await p.$('.wall-pin.theory .pin-handle');await handle.scrollIntoView();const rect=await handle.boundingBox();const oldPin=await p.$eval('[data-wall-id="theory0"]',el=>[parseFloat(el.style.left),parseFloat(el.style.top)]);
  if(width===390){const client=await p.createCDPSession();await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+30,y:rect.y+20}]});await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x+60,y:rect.y+40}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await client.detach();}else{await p.mouse.move(rect.x+30,rect.y+20);await p.mouse.down();await p.mouse.move(rect.x+60,rect.y+40,{steps:4});await p.mouse.up();}
  assert.notDeepEqual(await p.$eval('[data-wall-id="theory0"]',el=>[parseFloat(el.style.left),parseFloat(el.style.top)]),oldPin);checks++;
  assert.ok(await p.$eval(`[data-wall-id="${o.id}"] .wall-photo`,el=>el.style.backgroundImage.includes('hotel-6.jpg')));checks++;await p.select('#wall-selection',o.id);const before=await p.$eval(`[data-wall-id="${o.id}"]`,el=>parseFloat(el.style.left));await p.click('[data-nudge="-30,0"]');const after=await p.$eval(`[data-wall-id="${o.id}"]`,el=>parseFloat(el.style.left));assert.notEqual(before,after);checks++;
  await p.click(`[data-pin-source="${o.id}"]`);assert.equal(await p.$eval('#cctv-position',el=>el.value),'6');checks++;
  await p.reload();await p.click('#casebook');await p.click('#open-evidence-wall');assert.equal(await p.$eval(`[data-wall-id="${o.id}"]`,el=>parseFloat(el.style.left)),after);checks++;
  const final=await p.evaluate(()=>JSON.parse(localStorage.getItem('lastarchive.casework.v1')));assert.equal(final.notes,fixture.notes);assert.equal(final.chapter,9);assert.ok(final.findings.confrontation);checks++;
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);checks++;await p.close();
 }
 const p=await b.newPage();await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.goto(base);await p.evaluate(()=>localStorage.removeItem('lastarchive.casework.v1'));await p.reload();await p.click('#begin');assert.equal(await p.$eval('#opening-film',v=>v.paused),true);checks++;await p.click('#film-read');assert.ok(await p.$('#continue'));checks++;await p.close();
 console.log(`${checks} cinematic playback, CCTV controls, exact-frame source links, movable evidence wall, existing-save and mobile checks passed. Not blind testing.`);
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
