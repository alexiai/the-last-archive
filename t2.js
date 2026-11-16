const {JSDOM}=require("jsdom"),fs=require("fs"),d="/mnt/user-data/outputs/last-archive/";
function load(save){const dom=new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/",beforeParse(w){if(save!==undefined)w.localStorage.setItem("lastarchive.v2",save)}});const w=dom.window;w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));return w}
const t=(n,c)=>console.log(c?"PASS":"FAIL",n);
// save validation
for(const [n,s] of [["garbage","{{{"],["wrong types",'{"v":2,"ev":"x","flags":5,"nb":9,"made":[1,[2]],"trust":{"adrian":"a"},"talk":{"adrian":"zzz"},"solved":[7]}'],["unknown ids",'{"v":2,"ev":["NOPE","E2"],"flags":[1,"ok"],"nb":"hi","unlocked":true,"made":[["k","proved","t"]],"trust":{"adrian":99},"talk":{"adrian":"a1"},"solved":["p1","zz"]}'],["null","null"]]){
 const w=load(s);const S=w.eval("E.S");t("save "+n+" loads, no errors",w.errs.length==0&&Array.isArray(S.ev)&&typeof S.nb=="string"&&S.made.every(m=>m.length==4));
 if(n=="unknown ids")t("sanitised values",S.ev.length==1&&S.flags.join()=="ok"&&S.trust.adrian==3&&S.talk.adrian=="a1"&&S.solved.join()=="p1")}
const w=load();const doc=w.document,txt=()=>doc.querySelector("#screen").textContent,btn=x=>[...doc.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith(x));
w.eval("S.unlocked=true;['E2','E8','E3','E4'].forEach(take);open_('map')");
t("map renders",!!doc.querySelector("#mp")&&txt().includes("Hotel Aurelia"));
w.eval("who=['Iris'];maps()");t("gap flagged",txt().includes("No record for Iris between 00:49 and 02:03"));
w.eval("who=['Iris','Adrian'];maps()");t("compare two people",txt().includes("Adrian")&&txt().includes("Iris"));
w.eval("zoom(.7);pan(40,0)");t("zoom/pan",w.eval("vb[2]")<360);
w.eval("take('M1');take('M2')");
const c=(a,r,b)=>{w.eval("open_('ev')");w.eval(`A=null;B=null;pickN('${a}');pickN('${b}')`);btn(r).click();btn("Test connection").click();return txt()};
t("photo~ping proved",c("E3","relates","M1").includes("Supported"));
t("M2~E2 plausible only",c("E2","relates","M2").includes("Plausible, not proven"));
w.eval("open_('ev')");t("remove connection",(btn("Remove connection").click(),w.eval("S.made.length")<2));
// interview
w.eval("open_('int')");t("interview available",!btn("Adrian").disabled);btn("Adrian").click();
btn("Present evidence").click();btn("E3").click();t("weak evidence deflected",txt().includes("Half the city"));
btn("I'm not accusing").click();t("recover rapport",w.eval("S.trust.adrian")==1);
btn("Present evidence").click();btn("E8").click();t("E8 draws admission",txt().includes("drove around")&&w.eval("S.ev.includes('I1')"));
btn("Where did you drive").click();t("follow-up",txt().includes("personal"));
btn("Is there someone else").click();t("trust-gated option works",txt().includes("Yes."));
w.eval("S.trust.adrian=0;talk('adrian')");btn("Restart interview").click();t("restart works (no soft-lock)",txt().includes("already told"));
// puzzles
w.eval("open_('pz');pz('p1')");
w.eval("ans.p1=['a','b','c','d','e']");btn("Check answer").click();t("order puzzle accepts correct",txt().includes("Correct"));
w.eval("pz('p2');ans.p2=['r2']");btn("Check answer").click();t("set puzzle rejects partial",txt().includes("Not quite"));
w.eval("ans.p2=['r2','r4']");btn("Check answer").click();t("set puzzle accepts correct",txt().includes("Correct")&&w.eval("S.solved.length")==2);
t("progress persists to storage",JSON.parse(w.localStorage.getItem("lastarchive.v2")).solved.length==2);
console.log("errors:",w.errs.length?w.errs:"none");
