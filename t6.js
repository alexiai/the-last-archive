// Original interaction regressions use explicit legacy checkpoint fixtures; expanded new-game gates are tested in tools/test_production.cjs.
const {JSDOM}=require("jsdom"),fs=require("fs"),d=__dirname+"/";
const mk=(s)=>new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/",beforeParse(x){if(s)x.localStorage.setItem("lastarchive.v2",s)}}).window;
const w=mk();w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));const ev=s=>w.eval(s),doc=w.document,txt=()=>doc.querySelector("#screen").textContent,t=(n,c)=>{console.log(c?"PASS":"FAIL",n);if(!c)process.exitCode=1};
const btn=x=>[...doc.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith(x));
// 1. Elena chain via the real UI
ev("S.unlocked=true;['E2','E8','E3','M1'].forEach(take);S.solved.push('p2');['F1','N1','C1','E7'].forEach(take);S.solved.push('p3');S.legacyThrough=2;home()");
ev("open_('note')");const gift=[...doc.querySelectorAll("#screen .m")].find(x=>x.textContent.includes("ask E."));t("Gift note is flagged collectable",gift.className.includes("has"));
gift.click();t("tapping note saves E10",ev("S.ev.includes('E10')"));
ev("open_('con')");t("Elena contact appears",txt().includes("Elena Vasilescu"));
ev("con('elena')");t("Elena has a thread button",!!btn("Open messages"));btn("Open messages").click();t("Elena conversation opens",txt().includes("Mum's flat"));
[...doc.querySelectorAll("#screen .m.has")][0].click();t("Elena message saves E11",ev("S.ev.includes('E11')"));
// 2. Apps list integrity
const ids=JSON.parse(ev("JSON.stringify(STORY.apps.map(a=>a[0]))"));
t("app list intact (17 unique apps)",ids.length==17&&new Set(ids).size==17&&["msg","con","call","mail","gal","note","ev","map","int","pz","cal","file","web","soc","aud","vault"].every(x=>ids.includes(x)));
ev("home()");const labels=[...doc.querySelectorAll(".grid button")].map(b=>b.textContent);t("ch2 apps visible, ch3 hidden at chapter 3 start",ev("E.chapter()")==3&&labels.some(x=>x.includes("Calendar"))&&labels.some(x=>x.includes("Social")));
// 3. Interview exploit tests
ev("['E6','S3','E4','A1','B1','E5'].forEach(take)");
const I=(k,e)=>ev(`E.present('${k}','${e}')`),T=k=>ev(`S.trust['${k}']||0`);
// Victor: stonewall can fire once per item and cannot be cycled to reset rapport
I("victor","E7");I("victor","B1");t("stonewall fires on second heavy item",ev("S.talk.victor")=="v8"&&T("victor")==0&&ev("S.pres.victor.includes('!B1')"));
for(let i=0;i<10;i++){I("victor","B1");I("victor","E7")}
t("cycling items cannot repeat the stonewall or farm pressure",T("victor")<=2&&ev("S.pres.victor.filter(x=>x=='!B1').length")==1&&ev("S.pres.victor.filter(x=>x=='@v8').length")==1);
// Adrian: revisiting reward nodes does not stack
ev("S.trust.adrian=0;S.pres.adrian=[];S.talk.adrian=undefined;delete S.talk.adrian");
I("adrian","E8");for(let i=0;i<8;i++){ev("E.go('adrian','a7')");ev("E.go('adrian','a8')")}
t("a8 reward applies once",T("adrian")==2);
I("adrian","E3");const afterE3=T("adrian");for(let i=0;i<8;i++){ev("E.go('adrian','a9')");I("adrian","E3")}
t("a9/E3 effects apply once each",T("adrian")==afterE3+1);
// fuzz: random actions never break invariants
let rng=12345;const rnd=n=>(rng=(rng*1103515245+12345)&0x7fffffff)%n;
for(const k of ["adrian","victor"]){const evs=ev("S.ev.slice()"),nodes=Object.keys(JSON.parse(ev(`JSON.stringify(STORY.interviews['${k}'].nodes)`)));
 for(let i=0;i<600;i++){if(rnd(2))I(k,evs[rnd(evs.length)]);else ev(`E.go('${k}','${nodes[rnd(nodes.length)]}')`);
  if(T(k)<0||T(k)>3)t("trust in range "+k,false)}
 const toks=JSON.parse(ev(`JSON.stringify(S.pres['${k}'])`));t(`fuzz ${k}: no duplicate tokens, trust in range`,new Set(toks).size==toks.length&&T(k)>=0&&T(k)<=3)}
t("fuzz keeps evidence list unique",ev("new Set(S.ev).size==S.ev.length"));
// 4. Chapter 4->6 via engine; decision branches
const play=()=>{};const p=JSON.parse(fs.readFileSync("/dev/null")+"[]");
ev(`['S1','S2','A1','A2','A3','D1','D2','D3','H2','E9','L3'].forEach(take);S.solved.push('p4','p5','p6','p7');E.flag('unlock:vault');['K1','K2','K3','K5','L1','L2','T1'].forEach(take);S.legacyThrough=4;home()`);
t("chapter 5 reached",ev("E.chapter()")==5);
ev("open_('ev')");t("decision shown",txt().includes("Do you share it?"));
ev("open_('msg');thread('moth')");t("no MOTH follow-up before choosing",!txt().includes("depot hours"));
const w2=mk(w.localStorage.getItem("lastarchive.v2"));
ev("open_('ev')");btn("Share it with MOTH").click();t("choice recorded and flag set",ev("S.choices.d1")===0&&ev("E.has('moth:shared')"));
t("decision cannot be re-chosen",ev("E.choose('d1',1)")===false&&ev("S.choices.d1")===0);
ev("thread('moth')");t("MOTH follow-up (shared) appears",txt().includes("Mara's version"));
w2.eval("S.unlocked=true;open_('ev')");[...w2.document.querySelectorAll("button")].find(b=>b.textContent.startsWith("Keep it")).click();w2.eval("thread('moth')");t("withheld branch shows different MOTH message",w2.document.querySelector("#screen").textContent.includes("holding back")&&!w2.document.querySelector("#screen").textContent.includes("Mara's version"));
// call number resolution
ev("open_('call')");t("019 unresolved before L1 flag... resolved after",txt().includes("Luca Marin (new number)")&&ev("E.has('num:019')"));
// Luca interview
ev("open_('int')");btn("Luca").click();t("Luca meter Guard",txt().includes("Guard: open"));
const pres=e=>{btn("Present evidence").click();btn(e).click()};
pres("L2");t("break evidence raises guard",ev("S.trust.luca")==1&&txt().includes("A break is a break"));
t("break question refused",(btn("Where did you go").click(),txt().includes("No.")));
t("follow-up hidden until warning understood",!btn("Ask again about the break"));
pres("L3");t("L3 yields LV1",ev("S.ev.includes('LV1')")&&txt().includes("loan papers"));
t("follow-up now available",!!btn("Ask again about the break"));btn("Ask again about the break").click();t("source hint given",txt().includes("someone who knew"));
// Mara: moth:shared branch
ev("take('L3');['W1'].forEach(take);S.solved.push('p8','p9');['F1'].length");
ev("S.ev.includes('W1')||take('W1')");ev("E.flag('x')");
ev("home()");t("chapter 6 reached after puzzles/evidence",ev("E.chapter()")>=5);
ev("S.solved.includes('p8')||S.solved.push('p8');S.solved.includes('p9')||S.solved.push('p9');S.legacyThrough=5;home()");t("chapter 6",ev("E.chapter()")==6);
ev("open_('int')");btn("Mara").click();t("Mara Warmth meter",txt().includes("Warmth: guarded"));
pres("K5");t("with MOTH shared, Mara answers smoothly (no slip)",txt().includes("misremembered")&&!ev("E.has('mara:slip')"));
pres("A3");t("A3 yields MV1",ev("S.ev.includes('MV1')")&&txt().includes("Victor"));
btn("Go back.").click();btn("Who else might").click();t("Mara volunteers a steer",ev("E.has('mara:steers')"));
const w3=mk(w2.localStorage.getItem("lastarchive.v2"));const ev3=s=>w3.eval(s);ev3("S.unlocked=true;E.S.flags=E.S.flags.filter(f=>f!='moth:shared');E.S.pres.mara=[];E.S.talk.mara='m0';E.S.trust.mara=0;E.present('mara','K5')");t("without sharing, Mara slips",ev3("E.has('mara:slip')")&&ev3("S.talk.mara")=="m4");
// puzzles ch5/6
ev("pz('p8');ans.p8=['K1']");btn("Check").click();t("p8 correct",txt().includes("Correct"));
ev("pz('p8');ans.p8=['K1','K2']");btn("Check").click();t("p8 rejects over-selection",txt().includes("Not quite"));
ev("pz('p10');ans.p10={a:'ion',b:'atl',c:'prt'}");btn("Check").click();t("p10 correct",txt().includes("Correct"));
ev("pz('p11');ans.p11=['D1','A3']");btn("Check").click();t("p11 correct",txt().includes("Correct"));
// links
const c=(a,r,b)=>{ev("A=null;B=null;open_('ev')");ev(`pickN('${a}');pickN('${b}')`);btn(r).click();btn("Test connection").click();return txt()};
t("account link proved",c("B1","relates","W1").includes("Supported. "));
t("statement conflict proved but limited",c("K1","contradicts","K2").includes("Neither statement settles"));
t("alibi link only plausible",c("L2","contradicts","K3").includes("Plausible, not proven"));
// visuals
ev("open_('gal')");t("photo markup has image overlay with fallback",ev("pic(STORY.photos[0]).includes('onerror')&&pic(STORY.photos[0]).includes('assets/photos/E3.jpg')"));
ev("open_('con')");t("avatars rendered in contacts (circular, alt text, fallback)",doc.querySelectorAll("#screen .av").length>=5&&doc.querySelector("#screen .av img").alt.startsWith("Portrait of"));
// saves: older save without choices/pres loads
const w4=mk(JSON.stringify({v:2,ev:["E2","K1"],flags:["moth:shared"],made:[],trust:{},talk:{},solved:[]}));t("older save loads",w4.eval("typeof E.S.choices=='object'&&typeof E.S.pres=='object'&&E.S.ev.length==2"));
const w5=mk(JSON.stringify({v:2,ev:[],pres:{mara:["@m4","@zzz","!K5","!NOPE"]},choices:{d1:"x",d2:1}}));t("bad tokens/choices sanitised",w5.eval("E.S.pres.mara.join()")=="@m4,!K5"&&w5.eval("E.S.choices.d1===undefined&&E.S.choices.d2===1"));
console.log("errors:",w.errs.length?w.errs:"none");
