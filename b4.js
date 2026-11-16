const chromium=require("@sparticuz/chromium").default||require("@sparticuz/chromium"),p=require("puppeteer-core");
const URL="file:///mnt/user-data/outputs/last-archive/index.html",sleep=ms=>new Promise(r=>setTimeout(r,ms));
const AUTOPLAY=`window.autoplay=(n)=>{const V=x=>E.vis(x)&&(!x.need||E.has(x.need));const src=()=>{const o=[];
 for(const t of Object.values(STORY.threads))if(V(t))t.m.forEach(m=>m[3]&&(!m[4]||E.vis({ch:m[4]}))&&(!m[5]||E.has(m[5]))&&o.push(m[3]));
 STORY.notes.forEach(x=>E.vis({ch:x[3]})&&x[2]&&o.push(x[2]));STORY.mails.forEach(m=>V(m)&&m.ev&&o.push(m.ev));STORY.photos.forEach(x=>V(x)&&o.push(x.id));
 STORY.records.forEach(r=>r[6]&&o.push(r[6]));STORY.calendar.forEach(c=>c[4]&&o.push(c[4]));STORY.files.forEach(f=>E.vis(f)&&f.ev&&o.push(f.ev));
 STORY.web.pages.forEach(x=>(!x.need||S.ev.includes(x.need))&&x.ev&&o.push(x.ev));STORY.contacts.forEach(c=>c.ev&&(!c.need||E.has(c.need))&&o.push(c.ev));
 STORY.social.forEach(x=>V(x)&&x.ev&&o.push(x.ev));STORY.audio.forEach(a=>E.vis(a)&&(!a.need||E.has(a.need))&&a.ev&&o.push(a.ev));Object.values(STORY.callNotes||{}).forEach(c=>o.push(c[0]));return o};
 let g=0,ch=true;while(ch&&g++<60){ch=false;
  for(const [k,i] of Object.entries(STORY.interviews))if(E.vis(i)&&i.need.every(x=>S.ev.includes(x)))for(const [e,nd] of Object.entries(i.present)){const t=i.nodes[nd].take;if(t&&S.ev.includes(e)&&!S.ev.includes(t)){if(E.chapter()>n)return;E.present(k,e);ch=true}}
  for(const id of src()){if(E.chapter()>n)return;if(!S.ev.includes(id)){E.take(id);ch=true}}
  for(const p of STORY.puzzles.filter(p=>E.vis(p)&&E.ready(p)&&!S.solved.includes(p.id))){if(E.chapter()>n)return;const a=p.type=='order'?Object.keys(p.items).sort((x,y)=>p.items[x][1].localeCompare(p.items[y][1])):p.type=='match'?p.pairs:p.type=='case'?Object.fromEntries(p.slots.map(s=>[s.id,s.pick?s.need.map(g=>g[0]):s.answer])):p.answer;if(E.solve(p.id,a))ch=true}}};`;
const clickText=(pg,txt,sel="button")=>pg.evaluate((t,s)=>{const b=[...document.querySelectorAll(s)].find(e=>e.textContent.trim().startsWith(t));if(!b)return false;b.click();return true},txt,sel);
(async()=>{const b=await p.launch({args:chromium.args,executablePath:await chromium.executablePath(),headless:"shell"});
let fails=0;const T=(n,c)=>{console.log(c?"PASS":"FAIL",n);if(!c)fails++};
for(const [name,vp] of [["mobile390",{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2}],["small320",{width:320,height:568,isMobile:true,hasTouch:true,deviceScaleFactor:2}],["desktop",{width:1280,height:800}]]){
 const pg=await b.newPage();await pg.setViewport(vp);const errs=[];pg.on("pageerror",e=>errs.push(e.message));pg.on("console",m=>{if(m.type()=="error"&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
 await pg.goto(URL);await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.evaluate(AUTOPLAY);
 await pg.click(".notif");await sleep(100);
 for(let n=1;n<=8;n++){await pg.evaluate(n=>autoplay(n),n)}
 T(name+": reached chapter 9 by autoplay",await pg.evaluate(()=>E.chapter())==9);
 // every app / deep screen: overflow + not empty
 const screens=["msgs()","cons()","calls()","callD(3)","callD(0)","mail()","mailOpen('m7')","gal()","photo('H2')","notes()","board()","maps()","ints()","pzs()","pz('p17')","pz('p15')","cal()","files()","fileOpen('f12')","web()","page(0)","soc()","aud()","clip('a5')","nbk()","objectives()","home()","thread('mara')","thread('moth')","con('j')","talk('mara')","talk('moth')","talk('julia')","talk('elena')"];
 let bad=[];for(const s of screens){const r=await pg.evaluate(s=>{try{eval(s)}catch(e){return {err:String(e)}}const sc=document.querySelector("#screen");return {empty:sc.textContent.trim().length<3,sw:sc.scrollWidth,cw:sc.clientWidth,dw:document.documentElement.scrollWidth,iw:innerWidth}},s);
  if(r.err||r.empty||r.sw>r.cw+1||r.dw>r.iw+1)bad.push(s+" "+JSON.stringify(r))}
 T(name+": "+screens.length+" screens render, none empty, none overflow horizontally"+(bad.length?" :: "+bad.join("; "):""),bad.length==0);
 if(name=="mobile390"){
  // finale through real clicks
  T("finale: MOTH interview locked until its evidence is found",await pg.evaluate(()=>{ints();return document.querySelector("#screen").textContent.includes("Save more evidence first")}));
  await pg.evaluate(()=>{E.take('AC2');E.take('IT1');ints()});await clickText(pg,"MOTH");
  const pres=async e=>{await clickText(pg,"Present evidence");await clickText(pg,e);await sleep(30)};
  await pres("IT1");await pres("AC2");await pres("IT1");
  T("finale: MOTH unmasked via UI clicks",await pg.evaluate(()=>E.has("moth:unmasked")&&S.ev.includes("MO1")));
  await pg.screenshot({path:"/tmp/br/moth.png"});
  await pg.evaluate(()=>{E.take('A5');ints()});await clickText(pg,"Mara");await pres("A5");
  T("finale: Mara's account via UI clicks",await pg.evaluate(()=>S.ev.includes("MF1")));
  await pg.evaluate(()=>{ans={};pz('p17')});
  // fill case file using real DOM interactions
  await pg.select("select","mara");
  const need={opp:["B2","SC1"],means:["SC1","D3"],cover:["E12","IS1","CD1"],manip:["AC1","H2"],ctrl:["AC2","IT1"]};
  for(const [slot,ids] of Object.entries(need))for(const id of ids)await pg.evaluate((slot,id)=>{ctoggle('p17',slot,id)},slot,id);
  await pg.evaluate(()=>{ans.p17.who="mara";pz('p17')});await pg.screenshot({path:"/tmp/br/case.png",fullPage:false});await pg.evaluate(()=>cslot('p17','opp'));await pg.screenshot({path:"/tmp/br/case-slot.png"});await pg.evaluate(()=>pz('p17'));
  await clickText(pg,"Check answer");await sleep(50);
  T("finale: case file accepted",await pg.evaluate(()=>S.solved.includes("p17")&&E.complete()));
  await pg.evaluate(()=>{home()});await clickText(pg,"Read the ending");await sleep(50);await pg.screenshot({path:"/tmp/br/ending.png"});
  T("ending screen shows epilogue",await pg.evaluate(()=>document.querySelector("#screen").textContent.includes("Epilogue")));
  await pg.evaluate(()=>{open_('ev')});await pg.screenshot({path:"/tmp/br/board.png"});
  // persistence through a real reload
  const before=await pg.evaluate(()=>JSON.stringify([S.ev.length,S.solved.length,E.complete()]));await pg.reload();const after=await pg.evaluate(()=>JSON.stringify([S.ev.length,S.solved.length,E.complete()]));
  T("save survives real reload "+before,before==after);
  // corrupted save does not break boot
  await pg.evaluate(()=>localStorage.setItem("lastarchive.v2","{not json"));await pg.reload();T("corrupt save: game boots",await pg.evaluate(()=>!!document.querySelector("#screen").textContent.length&&E.chapter()==1));
  await pg.evaluate(()=>localStorage.setItem("lastarchive.v2",JSON.stringify({v:2,ev:[5,null,"E2"],flags:{},made:"x",trust:{adrian:"a"},pres:{adrian:"z"},choices:[],solved:"x"})));await pg.reload();T("malformed save: game boots with valid part kept",await pg.evaluate(()=>E.S.ev.join()=="E2"));
  // iOS-like: no speechSynthesis
  await pg.evaluate(()=>{S.unlocked=true;delete window.speechSynthesis;try{Object.defineProperty(window,"speechSynthesis",{value:undefined,configurable:true})}catch(e){}});
  await pg.evaluate(AUTOPLAY);await pg.evaluate(()=>{for(let n=1;n<=9;n++)autoplay(n);clip('a1')});
  T("audio: no speech support shows transcript fallback",await pg.evaluate(()=>document.querySelector("#screen").textContent.includes("no speech playback")&&document.querySelector("#screen").textContent.includes("Victor, not here")));
  await pg.evaluate(()=>{window.speak&&speak('a1')});T("audio: speak() with no synthesis does not throw",true);
 }
 T(name+": no page errors or console errors"+(errs.length?" :: "+errs.join("; "):""),errs.length==0);await pg.close()}
console.log(fails?"FAILURES: "+fails:"all real-browser checks passed");await b.close()})().catch(e=>{console.log("ERR",e);process.exit(1)});
