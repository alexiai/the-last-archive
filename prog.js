// Fresh-save progression + reachability. Plays the game through engine/data only, respecting visibility and unlock flags.
const {JSDOM}=require("jsdom"),fs=require("fs"),d=__dirname+"/";
const mk=(s)=>new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/",beforeParse(x){if(s)x.localStorage.setItem("lastarchive.v2",s)}}).window;
const w=mk();w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));const ev=s=>w.eval(s),t=(n,c)=>{console.log(c?"PASS":"FAIL",n);if(!c)process.exitCode=1};
t("fresh save is chapter 1, banner renders",ev("E.chapter()")==1&&(ev("home()"),w.document.querySelector("#screen").textContent.includes("Chapter 1")));
// evidence sources respecting gating (ch + need flag)
ev(`window.SRC=()=>{const o=[],V=x=>E.vis(x)&&(!x.need||E.has(x.need));
 for(const t of Object.values(STORY.threads))if(V(t))t.m.forEach(m=>m[3]&&(!m[4]||E.vis({ch:m[4]}))&&(!m[5]||E.has(m[5]))&&o.push(m[3]));
 STORY.notes.forEach(n=>E.vis({ch:n[3]})&&n[2]&&o.push(n[2]));
 STORY.mails.forEach(m=>V(m)&&m.ev&&o.push(m.ev));STORY.photos.forEach(p=>V(p)&&o.push(p.id));
 STORY.records.forEach(r=>r[6]&&o.push(r[6]));STORY.calendar.forEach(c=>c[4]&&o.push(c[4]));
 STORY.files.forEach(f=>E.vis(f)&&f.ev&&o.push(f.ev));STORY.web.pages.forEach(p=>(!p.need||E.S.ev.includes(p.need))&&p.ev&&o.push(p.ev));
 STORY.contacts.forEach(c=>c.ev&&(!c.need||E.has(c.need))&&o.push(c.ev));
 STORY.social.forEach(p=>V(p)&&p.ev&&o.push(p.ev));STORY.audio.forEach(a=>E.vis(a)&&(!a.need||E.has(a.need))&&a.ev&&o.push(a.ev));Object.values(STORY.callNotes||{}).forEach(c=>E.vis({ch:7})&&o.push(c[0]));
 return o}`);
function play(n){let changed=true,g=0;while(changed&&g++<50){changed=false;
 {const before=ev('S.ev.length+S.flags.length+JSON.stringify(S.talk)');if(ev('E.chapter()')>n)return;ev(`for(const [k,i] of Object.entries(STORY.interviews))if(E.vis(i)&&i.need.every(x=>S.ev.includes(x)))for(const e of Object.keys(i.present))if(S.ev.includes(e))E.present(k,e)`);if(ev('S.ev.length+S.flags.length+JSON.stringify(S.talk)')!=before)changed=true}
 for(const [k,i] of Object.entries(JSON.parse(ev('JSON.stringify(Object.fromEntries(Object.entries(STORY.interviews).filter(([k,i])=>E.vis(i)&&i.need.every(x=>E.S.ev.includes(x))).map(([k,i])=>[k,i.present])))')))){const nodes=JSON.parse(ev(`JSON.stringify(STORY.interviews['${k}'].nodes)`));for(const [e,nd] of Object.entries(i))if(nodes[nd].take&&ev(`E.S.ev.includes('${e}')`)&&!ev(`E.S.ev.includes('${nodes[nd].take}')`)){if(ev('E.chapter()')>n)return;ev(`E.present('${k}','${e}')`);changed=true}}
 for(const id of ev("SRC()")){if(ev("E.chapter()")>n)return;if(!ev(`E.S.ev.includes('${id}')`)){ev(`take('${id}')`);changed=true}}
 for(const p of ev("STORY.puzzles.filter(E.ready)").map?[]:[]){}
 const ps=JSON.parse(ev("JSON.stringify(STORY.puzzles.filter(p=>E.vis(p)&&E.ready(p)&&!E.S.solved.includes(p.id)).map(p=>p.id))"));
 for(const id of ps){if(ev("E.chapter()")>n)return;const a=JSON.parse(ev(`JSON.stringify((()=>{const p=STORY.puzzles.find(x=>x.id=='${id}');return p.type=='order'?Object.keys(p.items).sort((x,y)=>p.items[x][1].localeCompare(p.items[y][1])):p.type=='match'?p.pairs:p.type=='case'?Object.fromEntries(p.slots.map(s=>[s.id,s.pick?s.need.map(g=>g[0]):s.answer])):p.answer})())`));
  if(ev(`E.solve('${id}',${JSON.stringify(a)})`))changed=true}}}
const marks=[];
const N=ev('STORY.chapters.length');for(let n=1;n<=N;n++){play(n);const done=ev(`E.done(${n})`);t(`chapter ${n} objectives completable from available content`,done);
 // every done.ev must be reachable (checked by play), and no objective references a missing id
 t(`chapter ${n} objective ids all exist`,ev(`STORY.chapters[${n-1}].done.ev.every(x=>STORY.evidence[x])&&STORY.chapters[${n-1}].done.puz.every(x=>STORY.puzzles.some(p=>p.id==x))`));
 if(n<N)t(`chapter ${n+1} unlocked after chapter ${n}`,ev("E.chapter()")==n+1&&!ev("E.complete()")); }
t("completed state: banner is graceful",(ev("home()"),w.document.querySelector("#screen").textContent.includes("The investigation is complete")&&ev("E.complete()")));
t("every evidence id has a source or interview",ev("(()=>{const s=new Set(SRC());Object.values(STORY.interviews).forEach(i=>Object.values(i.nodes).forEach(n=>n.take&&s.add(n.take)));return Object.keys(STORY.evidence).filter(k=>!s.has(k)&&!E.S.ev.includes(k)).length})()")==0);
t("every puzzle solved",ev("STORY.puzzles.every(p=>E.S.solved.includes(p.id))"));
// out-of-order safety: a puzzle gated by a flag is unavailable until the flag exists
const w3=mk();const e3=s=>w3.eval(s);e3("['E4'].forEach(take);E.S.ev.push('E4')");t("vault puzzle unavailable early",e3("E.ready(STORY.puzzles.find(p=>p.id=='p6'))")===false);
// save/reload mid-game
const w2=mk(w.localStorage.getItem("lastarchive.v2"));t("reload keeps completed state",w2.eval("E.complete()")&&w2.eval("E.S.solved.includes('p7')")&&w2.eval("E.has('unlock:vault')"));
console.log("errors:",w.errs.length?w.errs:"none");
