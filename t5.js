const {JSDOM}=require("jsdom"),fs=require("fs"),d=__dirname+"/";
const mk=(s)=>new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/",beforeParse(x){if(s)x.localStorage.setItem("lastarchive.v2",s)}}).window;
const w=mk();w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));const ev=s=>w.eval(s),doc=w.document,txt=()=>doc.querySelector("#screen").textContent,t=(n,c)=>console.log(c?"PASS":"FAIL",n);
const btn=x=>[...doc.querySelectorAll("button")].find(e=>e.textContent.trim().startsWith(x));
// jump to ch3 state
ev("S.unlocked=true;['E2','E8','E3','M1','F1','N1','C1','E7','E6','M3','S3','E4','B1','A1'].forEach(take);S.solved.push('p2','p3');home()");
t("in chapter 3",ev("E.chapter()")==3);
// Victor interview (different mechanic)
ev("open_('int')");btn("Victor").click();t("Victor uses Pressure meter",txt().includes("Pressure: calm"));
const pres=e=>{btn("Present evidence").click();btn(e).click()};
pres("E6");t("E6 admission saves V1",txt().includes("discipline")&&ev("S.ev.includes('V1')"));
pres("E6");t("repeat E6 changes nothing",ev("S.trust.victor||0")==0);
pres("E7");t("E7 raises pressure",ev("S.trust.victor")==1);
pres("E7");t("repeat E7 does not raise pressure",ev("S.trust.victor")==1);
pres("B1");t("second heavy item triggers stonewall",txt().includes("name someone")&&ev("S.trust.victor")==0);
t("stonewalled evidence not consumed",!ev("S.pres.victor.includes('B1')"));
btn("Come back later").click();pres("B1");t("returns later, B1 now answered",txt().includes("whose account"));
pres("A1");t("voice memo answered",txt().includes("Half the city"));
btn("Restart interview").click();t("restart ok",txt().includes("ten minutes"));
// social/audio apps
ev("open_('soc')");t("social lists posts",txt().includes("Atelier Nord")&&!txt().includes("Everyone I trust"));
ev("open_('aud');clip('a1')");t("audio transcript",txt().includes("Victor, not here")&&!!btn("Saved to evidence"));
t("deleted post hidden before vault",!ev("(open_('soc'),document.querySelector('#screen').textContent.includes('Deleted'))"));
// map drag suppression
ev("selP=null;maps()");ev("dragMoved=true;selectP('hotel')");t("drag does not select",ev("selP")===null&&ev("dragMoved")===false);ev("selectP('hotel')");t("tap selects",ev("selP")==='hotel');
const svg=doc.querySelector("#mp");const pe=(type,x)=>svg.dispatchEvent(Object.assign(new w.MouseEvent(type,{bubbles:true,clientX:x,clientY:10}),{pointerId:1}));
pe("pointerdown",100);pe("pointermove",130);t("pointer move >6px marks drag",ev("dragMoved")===true);pe("pointerup",130);
// ch4: vault
ev("['D1','D2','D3','H2','S1','S2','A2','A3'].length");ev("take('S1');take('S2');S.solved.push('p4','p5');home()");t("chapter 4",ev("E.chapter()")==4);
ev("open_('vault')");t("vault asks for PIN",!!doc.querySelector("input"));
ev("ans.p7='0000';chk('p7')");t("wrong PIN rejected, retry allowed",txt().includes("Not quite")&&!ev("E.has('unlock:vault')"));
ev("ans.p7=' 1709 ';chk('p7')");t("right PIN opens vault",ev("E.has('unlock:vault')")&&txt().includes("Correct"));
ev("open_('mail');mail('Trash')");t("trash visible after vault",txt().includes("sorry about earlier"));
ev("open_('gal')");t("hidden photos visible",txt().includes("Party table (copy)"));
ev("take('H2');take('E4');open_('ev')");
const c=(a,r,b)=>{ev("A=null;B=null;open_('ev')");ev(`pickN('${a}');pickN('${b}')`);btn(r).click();btn("Test connection").click();return txt()};
t("altered photo contradicts original (proved)",c("H2","contradicts","E4").includes("Supported"));
t("deleted-post link only plausible",(ev("take('D2')"),c("D2","relates","M1").includes("Plausible, not proven")));
// robustness: old-format save without pres, and malformed pres
const w2=mk(JSON.stringify({v:2,ev:["E2"],flags:[],nb:"",unlocked:true,made:[],trust:{},talk:{},solved:[]}));t("old save loads with pres default",w2.eval("typeof E.S.pres=='object'")&&w2.eval("E.S.ev.length")==1);
const w4=mk(JSON.stringify({v:2,ev:["E2"],pres:{victor:"bad",adrian:[1,"E8","NOPE"]}}));t("malformed pres sanitised",w4.eval("E.S.pres.adrian.join()")=="E8"&&!w4.eval("'victor' in E.S.pres"));
console.log("errors:",w.errs.length?w.errs:"none");
