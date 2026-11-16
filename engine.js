// Engine: state, save validation, unlocks, connection validation, puzzle and interview engines. No UI here.
const KEY="lastarchive.v2";
// Storage that never throws: falls back to memory when localStorage is blocked (private modes) or full.
const Store=(()=>{const mem={};try{const s=window.localStorage;s.setItem("__t","1");s.removeItem("__t");return{ok:true,get:k=>s.getItem(k),set:(k,v)=>s.setItem(k,v),del:k=>s.removeItem(k)}}catch(e){return{ok:false,get:k=>(k in mem?mem[k]:null),set:(k,v)=>{mem[k]=v},del:k=>{delete mem[k]}}}})();
const blank=()=>({v:2,ev:[],flags:[],nb:"",unlocked:false,made:[],trust:{},talk:{},solved:[],pres:{},choices:{},hints:0,hintLvl:{},board:{}});
const isStr=x=>typeof x==="string",isObj=x=>!!x&&typeof x==="object"&&!Array.isArray(x),uniq=a=>[...new Set(a)];
const BOARD_W=600,BOARD_H=500;
const E={
 S:blank(),saveOk:true,
 nodeOk:n=>isStr(n)&&(!!STORY.evidence[n]||n.startsWith("person:")&&!!STORY.persons[n.slice(7)]||n.startsWith("place:")&&!!STORY.places[n.slice(6)]||n.startsWith("event:")&&!!STORY.events[n.slice(6)]),
 has:f=>E.S.flags.includes(f),
 // Validate every field and type; keep what is valid, drop the rest, and re-derive flags from authoritative state. Never throws.
 clean(r){const b=blank();try{if(!isObj(r)||r.v!==2)return b;const A=(x,f)=>Array.isArray(x)?x.filter(f):[];
  b.ev=uniq(A(r.ev,x=>isStr(x)&&STORY.evidence[x]));b.flags=uniq(A(r.flags,isStr).slice(0,500));b.nb=isStr(r.nb)?r.nb.slice(0,20000):"";b.unlocked=r.unlocked===true;
  b.solved=uniq(A(r.solved,x=>isStr(x)&&STORY.puzzles.some(p=>p.id==x)));
  if(isObj(r.choices))for(const k in r.choices){const d=(STORY.decisions||[]).find(x=>x.id==k),v=r.choices[k];if(d&&Number.isInteger(v)&&v>=0&&v<d.opts.length)b.choices[k]=v}
  if(isObj(r.trust))for(const k in r.trust)if(STORY.interviews[k]&&Number.isFinite(r.trust[k]))b.trust[k]=Math.max(0,Math.min(3,Math.round(r.trust[k])));
  if(isObj(r.talk))for(const k in r.talk)if(STORY.interviews[k]&&isStr(r.talk[k])&&STORY.interviews[k].nodes[r.talk[k]])b.talk[k]=r.talk[k];
  if(isObj(r.pres))for(const k in r.pres)if(STORY.interviews[k]&&Array.isArray(r.pres[k]))b.pres[k]=uniq(r.pres[k].filter(x=>isStr(x)&&(STORY.evidence[x]||x[0]=="!"&&STORY.evidence[x.slice(1)]||x[0]=="@"&&STORY.interviews[k].nodes[x.slice(1)])));
  if(Number.isInteger(r.hints)&&r.hints>=0)b.hints=Math.min(r.hints,9999);
  if(isObj(r.hintLvl))for(const k in r.hintLvl)if(STORY.puzzles.some(p=>p.id==k)&&Number.isInteger(r.hintLvl[k]))b.hintLvl[k]=Math.max(0,Math.min(2,r.hintLvl[k]));
  if(isObj(r.board))for(const k in r.board){const p=r.board[k];if(E.nodeOk(k)&&Array.isArray(p)&&p.length==2&&p.every(Number.isFinite))b.board[k]=[Math.max(0,Math.min(BOARD_W,p[0])),Math.max(0,Math.min(BOARD_H,p[1]))]}
  // connections are rebuilt from the story data, so edited or stale records cannot claim more than the evidence supports
  const seen=new Set();for(const m of A(r.made,m=>Array.isArray(m)&&isStr(m[0]))){const p=m[0].split("~");if(p.length!=3||seen.has(m[0]))continue;
   if(!b.ev.includes(p[0])&&!E.nodeOk(p[0])||!E.nodeOk(p[1]))continue;const res=E.resolve(p[0],p[2],p[1]);if(res.err)continue;seen.add(m[0]);b.made.push([m[0],res.s,res.t,isStr(m[3])?m[3].slice(0,500):""])}
  // derive flags that must hold given the saved state
  const F=f=>{if(!b.flags.includes(f))b.flags.push(f)};
  b.ev.forEach(e=>(STORY.evidence[e][3]||[]).forEach(F));
  b.solved.forEach(id=>{const p=STORY.puzzles.find(x=>x.id==id);if(p&&p.unlocks)F(p.unlocks)});
  for(const k in b.choices)F(STORY.decisions.find(x=>x.id==k).opts[b.choices[k]][1]);
  for(const k in b.pres)b.pres[k].filter(x=>x[0]=="@").forEach(x=>{const nd=STORY.interviews[k].nodes[x.slice(1)];(nd.set||[]).forEach(F);if(nd.take&&!b.ev.includes(nd.take)&&STORY.evidence[nd.take]){b.ev.push(nd.take);(STORY.evidence[nd.take][3]||[]).forEach(F)}});
  return b}catch(e){return blank()}},
 load(){try{return E.clean(JSON.parse(Store.get(KEY)))}catch(e){return blank()}},
 save(){try{Store.set(KEY,JSON.stringify(E.S));E.saveOk=Store.ok}catch(e){E.saveOk=false}},
 wipe(){try{Store.del(KEY)}catch(e){}},
 take(id){const d=STORY.evidence[id];if(!d||E.S.ev.includes(id))return;E.S.ev.push(id);(d[3]||[]).forEach(f=>E.S.flags.includes(f)||E.S.flags.push(f));E.save()},
 // Resolve a proposed connection against the story data without changing state.
 resolve(a,rel,b){const isP=x=>x.startsWith("person:"),m=(l,x,y)=>(l[0]==x&&l[1]==y)||(l[0]==y&&l[1]==x);
  if(!E.nodeOk(a)||!E.nodeOk(b)||a==b)return{err:"Pick two different items."};
  if(!STORY.relations.includes(rel))return{err:"Unknown kind of connection."};
  if(rel=="authored"){const [p,v]=isP(a)?[a,b]:[b,a];if(!isP(p)||isP(v))return{err:"Authorship links a person to something they wrote or sent."};
   return STORY.limits[v+"|"+p.slice(7)]=="authored"?{s:"proved",t:STORY.persons[p.slice(7)]+" wrote or sent this."}:{err:"Nothing in what you have shows this person is behind that item."}}
  const L=STORY.links.find(l=>m(l,a,b)&&l[2]==rel);if(L)return{s:L[3],t:L[4]};
  return{err:STORY.links.some(l=>m(l,a,b))?"These two do connect, but not in that way.":"Nothing in the evidence supports a connection between these two yet."}},
 check(a,rel,b){const r=E.resolve(a,rel,b);if(r.err)return{ok:false,t:r.err};return E.keep([a,b].sort().join("~")+"~"+rel,r.s,r.t)},
 drop(key){E.S.made=E.S.made.filter(m=>m[0]!=key);E.save()},
 note(key,t){const m=E.S.made.find(m=>m[0]==key);if(m){m[3]=String(t).slice(0,500);E.save()}},
 keep(key,s,t){if(!E.S.made.some(m=>m[0]==key))E.S.made.push([key,s,t,""]);key.split("~").slice(0,2).forEach(n=>E.place(n));E.save();return{ok:true,s,t}},
 // Board positions (saved). New nodes get a spiral slot unless a position is given.
 place(id,x,y){if(!E.nodeOk(id))return false;const B=E.S.board;if(B[id]&&x===undefined)return true;
  if(x===undefined){const n=Object.keys(B).length,t=n*2.4,r=40+n*9;x=BOARD_W/2+r*Math.cos(t);y=BOARD_H/2+r*Math.sin(t)}
  B[id]=[Math.max(0,Math.min(BOARD_W,Number(x))),Math.max(0,Math.min(BOARD_H,Number(y)))];return true},
 unplace(id){delete E.S.board[id];E.save()},
 hint(id){const p=STORY.puzzles.find(x=>x.id==id);if(!p)return 0;const l=Math.min(2,(E.S.hintLvl[id]||0)+1);E.S.hintLvl[id]=l;E.S.hints++;E.save();return l}};
E.S=E.load();
// ---- General puzzle engine: reusable types, separate from STORY.links (narrative-specific) ----
E.ready=p=>E.vis(p)&&p.needs.every(n=>E.S.ev.includes(n))&&(!p.need||E.has(p.need));
E.slotStatus=(s,v)=>{if(!s.pick)return v===s.answer?"ok":"wrong";const sel=Array.isArray(v)?v:[];
 if(new Set(sel).size!==sel.length)return"excess";const allowed=new Set(s.need.flat());if(!sel.every(x=>allowed.has(x)))return"excess";
 if(sel.length>s.need.length)return"excess";
 // every required group needs its own distinct item
 const used=new Set(),fit=g=>g==s.need.length||s.need[g].some(x=>sel.includes(x)&&!used.has(x)&&(used.add(x),fit(g+1)||(used.delete(x),false)));
 return fit(0)&&sel.length===s.need.length?"ok":"incomplete"};
E.caseDiagnose=(p,a)=>p.slots.map(s=>E.slotStatus(s,a&&a[s.id]));
E.caseReport=(p,a)=>E.caseDiagnose(p,a).map(x=>x==="ok");
E.types={
 order:(p,a)=>{if(!Array.isArray(a))return false;const want=Object.keys(p.items).sort((x,y)=>p.items[x][1].localeCompare(p.items[y][1]));return JSON.stringify(a)==JSON.stringify(want)},
 code:(p,a)=>String(a||"").trim()===p.answer,
 match:(p,a)=>Object.entries(p.pairs).every(([k,v])=>a&&a[k]===v),
 case:(p,a)=>E.caseReport(p,a).every(Boolean),
 set:(p,a)=>Array.isArray(a)&&new Set(a).size===a.length&&JSON.stringify([...a].sort())==JSON.stringify([...p.answer].sort())};
E.supported=p=>typeof E.types[p.type]==="function";
E.solve=(id,a)=>{const p=STORY.puzzles.find(x=>x.id==id);let ok=false;try{ok=!!p&&E.supported(p)&&E.ready(p)&&E.types[p.type](p,a)}catch(x){ok=false}if(ok&&!E.S.solved.includes(id)){E.S.solved.push(id);if(p.unlocks)E.flag(p.unlocks);E.save()}return ok};
// ---- Interview engine: nodes + evidence presentation; trust is a soft modifier, never a lock ----
E.node=(id,n)=>STORY.interviews[id].nodes[n];
// Effects (rapport, flags, evidence) apply only the first time a node is reached in an interview. Revisits replay text only.
E.go=(id,n,quiet)=>{const nd=E.node(id,n);if(!nd)return;E.S.talk[id]=n;const P=E.S.pres[id]=E.S.pres[id]||[],k="@"+n;
 if(quiet||P.includes(k)){E.save();return}P.push(k);
 if(nd.trust)E.S.trust[id]=Math.max(0,Math.min(3,(E.S.trust[id]||0)+nd.trust));(nd.set||[]).forEach(f=>E.S.flags.includes(f)||E.S.flags.push(f));if(nd.take)E.take(nd.take);E.save()};
// Presenting evidence: a stonewall can fire at most once per item and does not consume it; effects are gated per node inside E.go,
// so a changed answer (via alt flags) can still deliver its effects once, in whatever order the evidence is shown.
E.present=(id,ev)=>{const I=STORY.interviews[id],P=E.S.pres[id]=E.S.pres[id]||[],consumed=P.includes(ev);
 let node=I.present[ev]||"pd";const alt=(I.alt&&I.alt[ev]||[]).find(a=>E.has(a[0]));if(alt)node=alt[1];
 const st=I.stonewall&&I.stonewall[ev];
 if(!consumed&&st&&!P.includes("!"+ev)&&(E.S.trust[id]||0)>=1){P.push("!"+ev);E.go(id,st);return}
 if(!consumed&&I.present[ev])P.push(ev);
 E.go(id,node)};
// ---- Chapters: chapter n+1 opens when chapter n's goals are met. Content with ch:n stays hidden until then.
E.done=n=>{const c=STORY.chapters[n-1];return !!c&&c.done.ev.every(x=>E.S.ev.includes(x))&&c.done.puz.every(x=>E.S.solved.includes(x))};
E.chapter=()=>{let n=1;while(STORY.chapters[n]&&E.done(n))n++;return n};
E.vis=o=>(o.ch||1)<=E.chapter();
E.flag=f=>{if(!E.S.flags.includes(f)){E.S.flags.push(f);E.save()}};
E.complete=()=>E.done(STORY.chapters.length);
E.choose=(id,i)=>{const d=(STORY.decisions||[]).find(x=>x.id==id);if(!d||!d.opts[i]||E.S.choices[id]!==undefined)return false;E.S.choices[id]=i;E.flag(d.opts[i][1]);E.save();return true};
E.epilogue=()=>(STORY.epilogue||[]).filter(p=>!p.if||E.has(p.if));
