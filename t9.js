const {JSDOM}=require("jsdom"),fs=require("fs"),d="/mnt/user-data/outputs/last-archive/";
const AUTOPLAY=fs.readFileSync("/tmp/br/b4.js","utf8").match(/const AUTOPLAY=`([\s\S]*?)`;\nconst clickText/)[1];
const html=fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>");
const mk=()=>new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/"}).window;
const t=(n,c)=>{console.log(c?"PASS":"FAIL",n);if(!c)process.exitCode=1};
let n=0,okc=0,msgs=[];
for(const d1 of [0,1])for(const d2 of [0,1])for(const d3 of [0,1,2]){n++;const w=mk();w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));
 w.eval(AUTOPLAY);w.eval(`S.unlocked=true;E.choose('d1',${d1});E.choose('d2',${d2});E.choose('d3',${d3});for(let c=1;c<=9;c++)autoplay(c);for(let c=1;c<=9;c++)autoplay(c);E.take('AC2');E.take('IT1');E.present('moth','IT1');E.present('moth','AC2');E.present('moth','IT1');E.take('A5');E.present('mara','A5');for(let c=1;c<=9;c++)autoplay(c)`);
 // finish ch9 steps a player must do: unmask, account, case file (autoplay does these through the same engine calls)
 const done=w.eval("E.complete()"),ep=w.eval("E.epilogue().map(p=>p.t).join(' | ')");
 const exp=[d2==0?"unopened box of tea":"tablets were named",d3==0?"gave the case to the police":d3==1?"told Elena first":"first word"];
 const good=done&&exp.every(x=>ep.includes(x))&&w.errs.length==0&&w.eval("E.epilogue().length")>=7;
 if(good)okc++;else msgs.push(`d1=${d1} d2=${d2} d3=${d3} complete=${done}`);
 // epilogue renders
 w.eval("epilogue()");if(!w.document.querySelector("#screen").textContent.includes("Epilogue"))msgs.push("no epilogue screen "+[d1,d2,d3])}
t(`all ${n} decision combinations finish the game and render the right epilogue lines (${okc}/${n}) ${msgs.join(";")}`,okc==n&&msgs.length==0);
// interview node reachability: every node is the target of an option, a presentation, an alternate or a stonewall
const w=mk();const I=JSON.parse(w.eval("JSON.stringify(STORY.interviews)"));let un=[];
for(const [k,iv] of Object.entries(I)){const tg=new Set([iv.start,"pd"]);for(const nd of Object.values(iv.nodes))for(const o of nd.o)tg.add(o[1]);Object.values(iv.present).forEach(x=>tg.add(x));Object.values(iv.alt||{}).forEach(a=>a.forEach(x=>tg.add(x[1])));Object.values(iv.stonewall||{}).forEach(x=>tg.add(x));
 for(const id of Object.keys(iv.nodes))if(!tg.has(id))un.push(k+"."+id)}
t("every interview node is reachable by some action: "+(un.join(",")||"ok"),un.length==0);
// every interview is completable: each evidence reward node can be reached with only evidence that exists in the game
let rew=[];for(const [k,iv] of Object.entries(I))for(const [id,nd] of Object.entries(iv.nodes))if(nd.take){const viaPresent=Object.entries(iv.present).some(([e,n_])=>n_==id)||Object.values(iv.alt||{}).some(a=>a.some(x=>x[1]==id));const viaOpt=Object.values(iv.nodes).some(n2=>n2.o.some(o=>o[1]==id));if(!viaPresent&&!viaOpt)rew.push(k+"."+id)}
t("every evidence-granting interview node has a path: "+(rew.join(",")||"ok"),rew.length==0);
