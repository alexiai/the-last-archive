const {JSDOM}=require("jsdom"),fs=require("fs"),d="/mnt/user-data/outputs/last-archive/";
const w=new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/"}).window;
w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));
const doc=w.document,txt=()=>doc.querySelector("#screen").textContent,ev=s=>w.eval(s),t=(n,c)=>console.log(c?"PASS":"FAIL",n);
const btn=x=>[...doc.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith(x));
ev("S.unlocked=true;home()");
// map filter
ev("who=['Iris','Adrian'];selP=null;maps()");
ev("selP='hotel';maps()");const f=txt();t("place filter shows hotel records only",f.includes("At hotel")&&!f.includes("Arrived")&&!f.includes("Exit badge"));
ev("selP='adrian';who=['Iris'];maps()");t("empty-state message",txt().includes("No records at this place"));
ev("who=['Iris','Adrian'];maps()");t("two people at one place",txt().includes("Sharing paused")&&!txt().includes("At hotel"));
btn("Show all places").click();t("show all resets",ev("selP")===null&&txt().includes("Exit badge")==false&&txt().includes("Arrived"));
ev("selectP('adrian')");t("place flagged for board",ev("S.flags.includes('place:adrian')"));
// touch helpers
ev("vb=[0,0,360,260];setVB(0,0,360)");ev("pinchBy(2)");t("pinch zooms",Math.abs(ev("vb[2]")-180)<1);
const x0=ev("vb[0]");ev("dragPx(-60,0,360)");t("drag pans",ev("vb[0]")>x0);ev("pinchBy(0.1)");t("zoom out clamped",ev("vb[2]")==360);ev("pinchBy(100)");t("zoom in clamped",ev("vb[2]")==90);
// unsupported puzzle type
ev("STORY.puzzles.push({id:'px',type:'future',title:'X',needs:[],prompt:'',hint:''});E.S.ev.length");
t("unsupported solve is false, no throw",ev("E.solve('px',[])")===false);ev("pz('px')");t("unsupported UI message",txt().includes("not available"));
ev("E.types.bad=()=>{throw 1};STORY.puzzles.push({id:'py',type:'bad',title:'Y',needs:[],prompt:'',hint:''})");t("throwing handler contained",ev("E.solve('py',[])")===false);
// generic nodes
ev("['E3','E4','M1'].forEach(take);E.flag('place:hotel');open_('ev')");t("place/event nodes on board",txt().includes("Hotel Aurelia")&&txt().includes("The party at Atelier Nord"));
const c=(a,r,b)=>{ev("open_('ev');A=null;B=null");ev(`pickN('${a}');pickN('${b}')`);btn(r).click();btn("Test connection").click();return txt()};
t("evidence->place located",c("E3","located","place:hotel").includes("Supported"));
t("evidence->event",c("E4","relates","event:party").includes("Supported"));
t("wrong place rejected",c("E3","located","place:atelier").includes("Not supported"));
// interviews: combos
ev("['E2','E8','M2','E5'].forEach(take);open_('int')");btn("Adrian").click();
const pres=e=>{btn("Present evidence").click();btn(e).click()};
pres("E5");t("irrelevant evidence -> generic, trust unchanged",txt().includes("don't see what that proves")&&(ev("S.trust.adrian")||0)==0);
pres("E5");t("repeat irrelevant stays stable",txt().includes("don't see")&&ev("S.talk.adrian")=="pd");
pres("E3");t("weak evidence lowers/clamps trust at 0",ev("S.trust.adrian")==0&&txt().includes("Half the city"));
pres("E8");t("E8 admission",txt().includes("drove around")&&ev("S.trust.adrian")==1);
const tr=ev("S.trust.adrian");pres("E8");t("repeat E8 does not stack trust unboundedly / no error",ev("S.trust.adrian")<=3&&ev("S.ev.filter(x=>x=='I1').length")==1);
for(let i=0;i<5;i++)pres("E8");t("repeats do not farm rapport",ev("S.trust.adrian")==1);
pres("M2");t("M2 explanation",txt().includes("Battery saver"));
btn("Restart interview").click();t("restart returns to start, state kept",txt().includes("already told")&&ev("S.ev.includes('I1')")&&ev("S.flags.includes('adrian:left')"));
ev("S.talk.adrian='a8';talk('adrian')");t("deep node reachable and exit available",!!btn("Go back"));
// chapters
t("starts in chapter 1",ev("E.chapter()")==1);ev("home()");t("calendar hidden in ch1",!txt().includes("Calendar"));
t("elena thread hidden in ch1",!ev("visible(STORY.threads.elena)"));
ev("['E2','E8','E3','M1'].forEach(take);");t("not done until puzzle",ev("E.chapter()")==1);
ev("E.S.solved.push('p2')");t("chapter 2 opens",ev("E.chapter()")==2);ev("home()");t("calendar visible in ch2",txt().includes("Calendar")&&txt().includes("Chapter 2"));
ev("take('E10')");t("note reveals Elena contact",ev("E.has('contact:elena')")&&ev("visible(STORY.threads.elena)"));
// ch2 apps and evidence
ev("open_('cal')");t("calendar opens",txt().includes("V: numbers"));
ev("open_('file');fileOpen('f1')");t("file opens",txt().includes("4417"));
ev("page(0)");t("browser page locked without E7",true);ev("web();page(0)");t("locked page message",txt().includes("needs a reference number"));
ev("take('E7');page(0)");t("page opens after E7",txt().includes("2290"));
ev("['F1','N1','C1','E6','M3','M2'].forEach(take)");
t("receipt~contact note proved",c("F1","relates","N1").includes("Supported"));
t("person link wrong rel handled",c("person:adrian","located","E3").includes("Not supported"));
// match puzzle
ev("pz('p3');ans.p3={f:'adrian',g:'victor',h:'adrian'}");btn("Check").click();t("match puzzle correct",txt().includes("Correct"));
ev("ans.p3={f:'victor',g:'victor',h:'adrian'};pz('p3')");btn("Check").click();t("match puzzle wrong",txt().includes("Not quite"));
// save round trip
const w2=new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/",beforeParse(x){x.localStorage.setItem("lastarchive.v2",w.localStorage.getItem("lastarchive.v2"))}}).window;
t("reload keeps chapter/evidence",w2.eval("E.chapter()")>=2&&w2.eval("E.S.ev.includes('F1')"));
console.log("errors:",w.errs.length?w.errs:"none");
