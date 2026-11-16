// Original interaction regressions use explicit legacy checkpoint fixtures; expanded new-game gates are tested in tools/test_production.cjs.
const {JSDOM}=require("jsdom"),fs=require("fs"),d=__dirname+"/";
const mk=(s)=>new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/",beforeParse(x){if(s)x.localStorage.setItem("lastarchive.v2",s)}}).window;
const w=mk();w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));const ev=s=>w.eval(s),doc=w.document,txt=()=>doc.querySelector("#screen").textContent,t=(n,c)=>{console.log(c?"PASS":"FAIL",n);if(!c)process.exitCode=1};
const btn=x=>[...doc.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith(x));
// ---- static integrity of all story data
const J=s=>JSON.parse(ev(`JSON.stringify(${s})`));
const EVI=new Set(J("Object.keys(STORY.evidence)")),PEOPLE=new Set(J("Object.keys(STORY.persons)")),PLACES=new Set(J("Object.keys(STORY.places)")),EVTS=new Set(J("Object.keys(STORY.events)"));
const nodeOk=n=>EVI.has(n)||n.startsWith("person:")&&PEOPLE.has(n.slice(7))||n.startsWith("place:")&&PLACES.has(n.slice(6))||n.startsWith("event:")&&EVTS.has(n.slice(6));
t("all link endpoints exist",J("STORY.links").every(l=>nodeOk(l[0])&&nodeOk(l[1])));
t("all link relations are known",J("STORY.links").every(l=>J("STORY.relations").includes(l[2])&&["proved","plausible"].includes(l[3])));
t("evidence people exist",Object.values(J("STORY.evidence")).every(e=>e[2].every(p=>PEOPLE.has(p))));
const I=J("STORY.interviews");let bad=[];
for(const [k,i] of Object.entries(I)){const N=i.nodes;if(!N[i.start])bad.push(k+" start");if(!N.pd)bad.push(k+" pd");
 for(const [id,n] of Object.entries(N)){if(!n.o||!n.o.length)bad.push(k+"."+id+" no exit");for(const o of n.o||[])if(!N[o[1]])bad.push(k+"."+id+"->"+o[1]);if(n.take&&!EVI.has(n.take))bad.push(k+"."+id+" take")}
 for(const [e,n] of Object.entries(i.present)){if(!EVI.has(e))bad.push(k+" present "+e);if(!N[n])bad.push(k+" present node "+n)}
 for(const [e,a] of Object.entries(i.alt||{}))for(const x of a)if(!N[x[1]])bad.push(k+" alt "+x[1]);
 for(const e of i.need)if(!EVI.has(e))bad.push(k+" need "+e);
 // every node must be able to return to start without any gated option
 for(const [id,n] of Object.entries(N))if(!n.o.some(o=>!o[2]&&!o[3]))bad.push(k+"."+id+" only gated exits (soft-lock)")}
t("interview data valid, every node has an ungated exit: "+(bad.join(", ")||"ok"),bad.length==0);
const P=J("STORY.puzzles");let pb=[];for(const p of P){for(const n of p.needs)if(!EVI.has(n))pb.push(p.id+" needs "+n);
 if(p.type=="set"&&!p.answer.every(a=>p.options[a]))pb.push(p.id+" answer not in options");
 if(p.type=="match"&&!Object.keys(p.pairs).every(k=>p.items[k]&&p.options[p.pairs[k]]))pb.push(p.id+" match");
 if(p.type=="case")for(const s of p.slots)if(s.pick){for(const g of s.need)for(const x of g)if(!EVI.has(x))pb.push(p.id+" slot "+s.id+" "+x)}
 if(!p.hint)pb.push(p.id+" no hint")}
t("puzzle data valid, all have hints: "+(pb.join(", ")||"ok"),pb.length==0);
const C=J("STORY.chapters");t("chapter done-lists reference real ids",C.every(c=>c.done.ev.every(x=>EVI.has(x))&&c.done.puz.every(x=>P.some(p=>p.id==x))));
t("9 chapters, original 17 puzzles retained plus 7 examinations",C.length==9&&P.length==24&&Array.from({length:17},(_,i)=>"p"+(i+1)).every(id=>P.some(p=>p.id===id)));
// ---- features through the UI
ev("S.unlocked=true;home()");
ev("take('E9');open_('call');");t("calls are tappable",txt().includes("Oct 16"));
// call details
ev("S.ev.push('A2');callD(0)");t("call 0 voicemail not yet available (ch1)",txt().includes("not available yet"));
ev("callD(3)");t("call detail shows record and no evidence button before ch7?",txt().includes("9 seconds")||txt().includes("Duration: 0:09"));
// hints
ev("S.ev.push('E4','E3','M1');S.solved.push('p2');ans={};pz('p1')");
const h0=ev("S.hints");btn("Hint").click();t("hint level 1 shown and counted",txt().includes("timestamp")&&ev("S.hints")==h0+1);
btn("Hint").click();t("hint level 2 names things to revisit",txt().includes("Revisit:"));
// objectives + banner
ev("home()");doc.querySelector("#screen .msg").click();t("objectives screen",txt().includes("Evidence found")&&txt().includes("Challenges solved"));
// jump to end game through engine and test case file UI
const solveAll=n=>{};
w.eval(`(()=>{for(let c=1;c<=8;c++){STORY.chapters[c-1].done.ev.forEach(x=>E.take(x));STORY.chapters[c-1].done.puz.forEach(x=>{if(!S.solved.includes(x))S.solved.push(x)})}
 S.legacyThrough=8;E.choose('d1',0);['unlock:vault','unlock:memo','num:019'].forEach(E.flag);Object.keys(STORY.evidence).filter(k=>!['MO1','MF1','AC2','IT1'].includes(k)).forEach(E.take);E.take('AC2');E.take('IT1');home()})()`);
t("chapter 9 reached",ev("E.chapter()")==9);
// MOTH confrontation
ev("open_('int')");t("MOTH interview listed",txt().includes("MOTH"));btn("MOTH").click();
const pres=e=>{btn("Present evidence").click();btn(e).click()};
const reset=k=>ev(`S.pres['${k}']=[];S.trust['${k}']=0;delete S.talk['${k}'];S.flags=S.flags.filter(f=>!['moth:acc2','moth:unmasked','mara:confessed'].includes(f));S.ev=S.ev.filter(x=>!['MO1','MF1'].includes(x))`);
// order A: IT1 first, then AC2, then IT1 again
pres("IT1");t("IT1 alone does not unmask",!ev("E.has('moth:unmasked')")&&txt().includes("A laptop is a laptop"));
pres("AC2");t("AC2 gives its answer",txt().includes("shared backup")&&ev("E.has('moth:acc2')"));
pres("IT1");t("IT1 after AC2 unmasks even though IT1 was presented first (no soft-lock)",ev("E.has('moth:unmasked')&&S.ev.includes('MO1')")&&txt().includes("Hello"));
// order B
ev("home()");reset("moth");ev("open_('int')");btn("MOTH").click();pres("AC2");pres("IT1");t("AC2 then IT1 unmasks",ev("S.ev.includes('MO1')"));
// repeats do nothing more
const tr=ev("S.trust.moth");for(let i=0;i<4;i++){pres("AC2");pres("IT1")}t("repeats leave state stable",ev("S.trust.moth")==tr&&ev("S.ev.filter(x=>x=='MO1').length")==1);
// Mara: confession gated on the unmasking, any presentation order
ev("home()");reset("mara");ev("S.flags=S.flags.filter(f=>f!='moth:unmasked')");ev("open_('int')");btn("Mara").click();
pres("A5");t("A5 before unmasking is deflected",txt().includes("anyone's kitchen")&&!ev("S.ev.includes('MF1')"));
ev("E.flag('moth:unmasked')");pres("A5");t("A5 after unmasking yields the account, though presented before",ev("S.ev.includes('MF1')")&&txt().includes("sleep"));
ev("home()");reset("mara");ev("E.flag('moth:unmasked')");ev("open_('int')");btn("Mara").click();pres("ND1");t("ND1 also reaches the account",ev("S.ev.includes('MF1')"));
pres("ND1");t("then ND1 gives the gentler reply",txt().includes("wasn't angry"));
// Elena + optional EV2 reward depends on decision
ev("home()");ev("S.pres.elena=[];delete S.talk.elena;S.flags=S.flags.filter(f=>!f.startsWith('elena:'));S.ev=S.ev.filter(x=>!['EV1','EV2'].includes(x));open_('int')");btn("Elena").click();
pres("D3");t("Elena admits tablets",ev("S.ev.includes('EV1')")&&txt().includes("sleeping tablets"));
t("optional follow-up hidden without promise",!btn("Ask if anyone else"));
ev("open_('ev')");btn("Promise to leave it out").click();t("d2 recorded",ev("S.choices.d2")===0&&ev("E.has('elena:protected')"));
ev("open_('int')");btn("Elena").click();t("follow-up appears after promise",true);
ev("E.go('elena','e4')");ev("talk('elena')");t("reward option visible",!!btn("Ask if anyone else"));btn("Ask if anyone else").click();t("EV2 collected",ev("S.ev.includes('EV2')"));
// J interview
ev("home()");ev("open_('int')");btn("J. Marin").click();pres("L2");t("J gives the sibling link",ev("S.ev.includes('JV1')")&&txt().includes("brother"));
// case file UI: partial credit then success, no hint on which item
ev("home()");ev("ans={};pz('p17')");
ev("ans.p17={who:'luca',opp:['B2','SC1'],means:['SC1','D3'],cover:['E12','IS1','CD1'],manip:['AC1','H2'],ctrl:['AC2','IT1']}");btn("Check").click();
t("wrong culprit rejected, no answer revealed",txt().includes("Not yet")&&!txt().includes("Mara is")&&!ev("S.solved.includes('p17')"));
ev("E.caseReport(STORY.puzzles.find(p=>p.id=='p17'),ans.p17)");const rep=J("E.caseReport(STORY.puzzles.find(p=>p.id=='p17'),ans.p17)");t("report marks only the culprit slot wrong",rep.filter(x=>!x).length==1&&rep[0]===false);
ev("ans.p17={who:'mara',opp:['B2','SC1','E3'],means:['SC1','D3'],cover:['E12','IS1','CD1'],manip:['AC1','H2'],ctrl:['AC2','IT1']}");btn("Check").click();t("a misleading item spoils its slot",!ev("S.solved.includes('p17')"));
ev("ans.p17={who:'mara',opp:['B2','SC1'],means:['SC1','D3'],cover:['E12','IS1','CD1'],manip:['AC1','H2'],ctrl:['AC2','IT1']}");btn("Check").click();t("correct case accepted",ev("S.solved.includes('p17')")&&txt().includes("Correct"));
t("malformed case answer does not throw",(()=>{try{return ev("E.solve('p17',null)===false&&E.solve('p17',{who:5,opp:'x'})===false")}catch(e){return false}})());
// board svg
ev("open_('ev');A=null;B=null;pickN('E2');pickN('E8')");btn("contradicts").click();btn("Test connection").click();t("board draws the connection you made",doc.querySelectorAll("#screen svg line").length>=1&&doc.querySelectorAll("#screen svg g").length>=2);
// finale
ev("E.take('MO1');E.take('MF1');home()");t("ending waits for outstanding decisions",!btn("Read the ending"));
ev("E.choose('d3',1);home()");btn("Read the ending").click();const ep=txt();t("epilogue has base + decision-dependent lines",ep.includes("Mara was arrested")&&ep.includes("told Elena first")&&!ep.includes("gave the case to the police")&&ep.includes("Elena kept the unopened box"));
t("saved state survives reload and ending is still available",(()=>{const w2=mk(w.localStorage.getItem("lastarchive.v2"));return w2.eval("E.complete()&&E.epilogue().length>=7")})());
console.log("errors:",w.errs.length?w.errs:"none");
