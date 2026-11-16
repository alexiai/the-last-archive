const {JSDOM}=require("jsdom"),fs=require("fs"),d=__dirname+"/";
const html=fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>");
const mk=(s,pre)=>new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",beforeParse(x){if(s)x.localStorage.setItem("lastarchive.v2",typeof s=="string"?s:JSON.stringify(s));if(pre)pre(x)}}).window;
const t=(n,c)=>{console.log(c?"PASS":"FAIL",n);if(!c)process.exitCode=1};const J=(w,s)=>JSON.parse(w.eval(`JSON.stringify(${s})`));
const w=mk();w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));const ev=s=>w.eval(s);
// ---- p16 regression: question, evidence and answer agree
const p16=J(w,"STORY.puzzles.find(p=>p.id=='p16')");
t("p16 answer excludes anyone whose cover depends on a relative's word",JSON.stringify(p16.answer.sort())==JSON.stringify(["adrian","victor"])&&/not their own word or a relative's/.test(p16.prompt));
ev("['G1','R2','JV1','L2','K3'].forEach(E.take);S.solved.length");
const ch8=()=>ev("STORY.chapters.slice(0,7).forEach(c=>{c.done.ev.forEach(E.take);c.done.puz.forEach(x=>S.solved.includes(x)||S.solved.push(x))});E.chapter()");t("reach chapter 8",ch8()==8);
t("p16: correct answer accepted",ev("E.solve('p16',['victor','adrian'])"));
ev("S.solved=S.solved.filter(x=>x!='p16')");
t("p16: old answer (adding Luca) now rejected",ev("E.solve('p16',['victor','adrian','luca'])")===false);
t("p16: partial / duplicate / non-array rejected",ev("E.solve('p16',['victor'])")===false&&ev("E.solve('p16',['victor','victor','adrian'])")===false&&ev("E.solve('p16','victor')")===false);
// the sibling statement link must not claim more than it proves
t("JV1~L2 is plausible, not proved",J(w,"STORY.links.find(l=>l[0]=='JV1'&&l[1]=='L2')")[3]=="plausible");
// ---- case report strictness
const P=J(w,"STORY.puzzles.find(p=>p.id=='p17')");const ok={who:"mara",opp:["B2","SC1"],means:["SC1","D3"],cover:["E12","IS1","CD1"],manip:["AC1","H2"],ctrl:["AC2","IT1"]};
const rep=a=>J(w,`E.caseDiagnose(STORY.puzzles.find(p=>p.id=='p17'),${JSON.stringify(a)})`);
t("valid case: every slot ok",rep(ok).every(x=>x=="ok"));
t("alternative valid evidence choices accepted (N3 for SC1, H1 for D3)",rep({...ok,opp:["B2","N3"],means:["SC1","H1"]}).slice(1,3).every(x=>x=="ok"));
t("extra irrelevant item rejected (even if not on any 'bad' list)",rep({...ok,opp:["B2","SC1","K5"]})[1]=="excess");
t("an unrelated item with the right count is rejected",rep({...ok,opp:["B2","K5"]})[1]!="ok");
t("duplicate selections rejected",rep({...ok,opp:["B2","B2"]})[1]=="excess");
t("too many items for the slot rejected",rep({...ok,cover:["E12","IS1","IS2","CD1"]})[3]=="excess");
t("missing group reported as incomplete",rep({...ok,cover:["E12","CD1"]})[3]=="incomplete"&&rep({...ok,manip:[]})[4]=="incomplete");
t("the same item cannot satisfy two groups of one slot",rep({...ok,means:["SC1","SC1"]})[2]=="excess"&&rep({...ok,cover:["IS1","IS2","CD1"]})[3]=="incomplete");
t("wrong culprit marks only that slot",rep({...ok,who:"luca"})[0]=="wrong"&&rep({...ok,who:"luca"}).slice(1).every(x=>x=="ok"));
t("garbage input never throws",(()=>{try{return J(w,"[E.caseDiagnose(STORY.puzzles.find(p=>p.id=='p17'),null),E.caseDiagnose(STORY.puzzles.find(p=>p.id=='p17'),{opp:5,cover:'x',manip:{}})]").length==2}catch(e){return false}})());
// ---- save validation
const base=()=>({v:2,ev:["E2"],flags:[],made:[],solved:[],trust:{},talk:{},pres:{},choices:{}});
let w2=mk({...base(),choices:{d1:0,d2:7,zz:0,d3:-1,d9:"x"}});t("decisions: only valid id + valid option index kept",JSON.stringify(w2.eval("E.S.choices"))=='{"d1":0}'&&w2.eval("E.has('moth:shared')"));
w2=mk({...base(),solved:["p1","nope",5],ev:["E2","E2","E2","NOPE"],flags:["a","a","b",3]});t("unknown puzzle ids and duplicate evidence/flags removed",w2.eval("E.S.solved.join()")=="p1"&&w2.eval("E.S.ev.join()")=="E2"&&w2.eval("E.S.flags.filter(f=>f=='a').length")==1);
w2=mk({...base(),talk:{adrian:"ZZ",victor:"v3",nobody:"x"},pres:{adrian:["@a8","@ZZ","E8","!E8","!NOPE"]}});t("invalid interview node references dropped",w2.eval("'adrian' in E.S.talk")===false&&w2.eval("E.S.talk.victor")=="v3"&&w2.eval("E.S.pres.adrian.join()")=="@a8,E8,!E8");
t("a consumed node re-derives its effects (flag and evidence)",w2.eval("E.has('adrian:other')"));
w2=mk({...base(),ev:["E2","E8","E3"],made:[["E2~E8~contradicts","proved","FORGED TEXT","note"],["E2~E3~contradicts","proved","claims too much",""],["BAD","x","y"],["E2~E8~contradicts","proved","dup",""],[1,2,3],["E2~NOPE~relates","proved","",""],"junk"]});
t("connections are rebuilt from the story data; forged/unsupported/duplicate/malformed ones dropped",w2.eval("E.S.made.length")==1&&w2.eval("E.S.made[0][2]").startsWith("At 00:31")&&w2.eval("E.S.made[0][3]")=="note");
w2=mk({...base(),hintLvl:{p1:2,p2:9,zz:1,p3:"x"},hints:"many",board:{E2:[10,20],E8:[9999,-5],NOPE:[1,2],E3:"x","place:hotel":[5,5],"place:zzz":[1,1]}});
t("hint levels and board positions validated and clamped",JSON.stringify(w2.eval("E.S.hintLvl"))=='{"p1":2,"p2":2}'&&w2.eval("E.S.hints")===0&&JSON.stringify(w2.eval("E.S.board"))=='{"E2":[10,20],"E8":[600,0],"place:hotel":[5,5]}');
for(const bad of ["null","[]","42",'"str"',"{{","","{\"v\":3}",'{"v":2,"ev":{"a":1},"made":5,"talk":[],"pres":7,"choices":"x","board":[]}'])try{const x=mk(bad);if(!(Array.isArray(x.eval("E.S.ev"))))throw 1}catch(e){t("corrupt save '"+bad.slice(0,20)+"' recovers",false)}
t("all corrupt saves recovered without errors",true);
// storage unavailable and quota exceeded
const wb=mk(null,x=>{Object.defineProperty(x,"localStorage",{get(){throw new Error("SecurityError")}})});
t("localStorage blocked: game boots, in-memory play works, user is told",wb.eval("Store.ok")===false&&(wb.eval("take('E2');S.ev.includes('E2')"))&&(wb.eval("home()"),wb.document.querySelector("#screen").textContent.includes("cannot be saved")));
const wq=mk(null,x=>{const o=x.Storage.prototype.setItem;x.Storage.prototype.setItem=function(k,v){if(k=="lastarchive.v2")throw new x.DOMException("full","QuotaExceededError");return o.call(this,k,v)}});
t("quota exceeded: no crash, notice shown",(()=>{wq.eval("take('E2');take('E8');E.save()");wq.eval("home()");return wq.eval("E.saveOk")===false&&wq.document.querySelector("#screen").textContent.includes("cannot be saved")})());
// ---- hint persistence across reload
const wh=mk();wh.eval("S.unlocked=true;['E4','E3','M1'].forEach(take);S.solved.push('p2');ans={};pz('p1')");const bt=x=>[...wh.document.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith(x));
bt("Hint").click();bt("Hint").click();const lvl=wh.eval("S.hintLvl.p1");
const wh2=mk(wh.localStorage.getItem("lastarchive.v2"));wh2.eval("S.unlocked=true;ans={};pz('p1')");
t("hint level persists and reopening the puzzle shows the earned hint",lvl==2&&wh2.eval("S.hintLvl.p1")==2&&wh2.document.querySelector("#screen").textContent.includes("Revisit"));
wh2.eval("pz('p1')");[...wh2.document.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith("Hint")).click();t("hint level never exceeds 2 and global count still grows",wh2.eval("S.hintLvl.p1")==2&&wh2.eval("S.hints")==3);
// ---- interview alt reactions and stonewalls in both orders, from clean state
const I=J(w,"STORY.interviews");let altOK=true,altMsg=[];
for(const [k,iv] of Object.entries(I))for(const [e,alts] of Object.entries(iv.alt||{}))for(const [flag,node] of alts){
 for(const order of ["present-first","flag-first"]){const x=mk();x.eval(`S.unlocked=true;`);
  const nd=iv.nodes[node];x.eval(`take('${e}')`);
  if(order=="present-first"){x.eval(`E.present('${k}','${e}')`);x.eval(`E.flag('${flag}')`);x.eval(`E.present('${k}','${e}')`)}else{x.eval(`E.flag('${flag}')`);x.eval(`E.present('${k}','${e}')`)}
  const got=x.eval(`S.talk['${k}']`);const eff=(!nd.take||x.eval(`S.ev.includes('${nd.take}')`))&&(!(nd.set||[]).length||nd.set.every(f=>x.eval(`E.has('${f}')`)));
  if(got!=node||!eff){altOK=false;altMsg.push(`${k}.${e}.${flag} ${order} got ${got}`)}}}
t("every alternate reaction reachable and its effects delivered in both orders: "+(altMsg.join("; ")||"ok"),altOK);
let stoneOK=true,sm=[];
for(const [k,iv] of Object.entries(I))for(const e of Object.keys(iv.stonewall||{})){const x=mk();x.eval("S.unlocked=true");Object.keys(iv.present).forEach(q=>x.eval(`take('${q}')`));
 for(let i=0;i<30;i++){Object.keys(iv.present).forEach(q=>x.eval(`E.present('${k}','${q}')`))}
 const tr=x.eval(`S.trust['${k}']||0`),toks=J(x,`S.pres['${k}']`);
 const evTaken=Object.values(iv.nodes).filter(n=>n.take).every(n=>x.eval(`S.ev.includes('${n.take}')`)||Object.entries(iv.present).every(([q,nn])=>iv.nodes[nn].take!=n.take));
 if(tr<0||tr>3||new Set(toks).size!=toks.length||!Object.keys(iv.present).every(q=>toks.includes(q))){stoneOK=false;sm.push(k+" "+e)}}
t("stonewall: repeated and mixed presentations never lock an interview or break rapport limits: "+(sm.join(";")||"ok"),stoneOK);
// ---- content counts and integrity
const th=J(w,"STORY.threads");const names=Object.keys(th);
t("25 distinct conversation threads",names.length==25);
t("every thread has >=2 messages, a name and a valid evidence reference",names.every(k=>th[k].m.length>=2&&th[k].name&&th[k].m.every(m=>!m[3]||ev(`!!STORY.evidence['${m[3]}']`))));
t("group chats label speakers",th.studio.m.some(m=>m[0]=="Victor")&&th.sisters.m.some(m=>m[0]=="Mara"));
t("deleted/recovered threads are gated behind the vault",["luca_old","victor_old","mara_del"].every(k=>th[k].need=="unlock:vault"));
const ph=J(w,"STORY.photos");t("23 photograph records with alt text and unique ids",ph.length==23&&new Set(ph.map(p=>p.id)).size==23&&ph.every(p=>p.alt&&p.alt.length>10));
const wp=mk();const vis=()=>wp.eval("STORY.photos.filter(p=>E.vis(p)&&(!p.need||E.has(p.need))).length");const v1=vis();wp.eval("STORY.chapters.slice(0,3).forEach(c=>{c.done.ev.forEach(E.take);c.done.puz.forEach(x=>S.solved.includes(x)||S.solved.push(x))})");t("photos appear progressively by chapter ("+v1+" at start, "+vis()+" by chapter 4)",v1<vis()&&v1>=5);
ev("gal()");const g=w.document.querySelector("#screen");t("gallery uses <img> with object-fit cover source, alt and onerror fallback",!!g.querySelector("img[src^='assets/photos/'][alt][onerror]")&&g.querySelectorAll(".pic").length>=6);
t("asset paths are relative (GitHub Pages safe)",!/(src|href)="\//.test(html)&&ev("pic(STORY.photos[0])").indexOf('src="assets/')>0&&ev("avatar('mara','Mara')").indexOf('src="assets/portraits/mara.png"')>0&&ev("avatar('j','J.')").indexOf("julia.png")>0);
// board persistence
const wbd=mk();wbd.eval("S.unlocked=true;['E2','E8'].forEach(take);open_('ev');pickN('E2');pickN('E8');R='contradicts';test()");const pos=JSON.stringify(wbd.eval("S.board"));
t("connecting places both nodes on the board and saves positions",Object.keys(JSON.parse(pos)).length==2);
const wbd2=mk(wbd.localStorage.getItem("lastarchive.v2"));t("board positions survive reload",JSON.stringify(wbd2.eval("S.board"))==pos&&wbd2.eval("S.made.length")==1);
wbd2.eval("S.unlocked=true;open_('ev')");t("board draws proved line with a ✓ marker and a list alternative",wbd2.document.querySelector("#bd line")&&wbd2.document.querySelector("#bd").textContent.includes("✓")&&wbd2.document.querySelectorAll("#screen .ev").length>=2);
wbd2.eval("toggleBoard('E8')");t("a node can be removed from and re-added to the board",!wbd2.eval("'E8' in S.board")&&(wbd2.eval("toggleBoard('E8')"),wbd2.eval("'E8' in S.board")));
console.log("errors:",w.errs.length?w.errs:"none");
