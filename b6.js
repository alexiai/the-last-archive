const chromium=require("@sparticuz/chromium").default||require("@sparticuz/chromium"),p=require("puppeteer-core"),fs=require("fs");
const AUTOPLAY=fs.readFileSync("b4.js","utf8").match(/const AUTOPLAY=`([\s\S]*?)`;\nconst clickText/)[1];
const FILE="file:///mnt/user-data/outputs/last-archive/index.html",HTTP="http://localhost:8765/repo/index.html",sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const T=(n,c,extra="")=>{console.log(c?"PASS":"FAIL",n,c?"":extra);if(!c)fails++};
(async()=>{const b=await p.launch({args:chromium.args,executablePath:await chromium.executablePath(),headless:"shell"});
for(const [name,vp] of [["320",{width:320,height:568,isMobile:true,hasTouch:true,deviceScaleFactor:2}],["390",{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2}],["1280",{width:1280,height:800}]]){
 const mobile=vp.isMobile,pg=await b.newPage();await pg.setViewport(vp);const errs=[],asset404=[];
 pg.on("pageerror",e=>errs.push(e.message));pg.on("console",m=>{if(m.type()=="error"&&!/Failed to load resource|ERR_FILE_NOT_FOUND/.test(m.text()))errs.push(m.text())});
 pg.on("requestfailed",r=>{if(/assets\//.test(r.url()))asset404.push(r.url())});
 await pg.goto(FILE);await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.evaluate(AUTOPLAY);await pg.click(".notif");
 for(let n=1;n<=8;n++)await pg.evaluate(n=>autoplay(n),n);
 const ov=async()=>pg.evaluate(()=>{const sc=document.querySelector("#screen");return{sw:sc.scrollWidth,cw:sc.clientWidth,dw:document.documentElement.scrollWidth,iw:innerWidth}});
 const screens=["msgs()","msgs('lights')","cons()","calls()","callD(3)","mail()","mail('Trash')","mailOpen('m5')","doc('m1')","gal()","photo('P03')","photo('H2',2)","notes()","maps()","ints()","pzs()","pz('p17')","pz('p15')","pz('p12')","cal()","files()","fileOpen('f1')","fileOpen('f8')","fileOpen('f12')","fileOpen('f3')","web()","page(0)","soc()","aud()","clip('a5')","nbk()","objectives()","home()","thread('studio')","thread('sisters')","thread('rideapp')","thread('mara_del')","talk('mara')","talk('julia')","talk('elena')","board()"];
 const bad=[];for(const s of screens){const r=await pg.evaluate(s=>{try{eval(s)}catch(e){return{err:String(e)}}return{empty:document.querySelector("#screen").textContent.trim().length<3}},s);const o=await ov();if(r.err||r.empty||o.sw>o.cw+1||o.dw>o.iw+1)bad.push(s+" "+JSON.stringify({...r,...o}))}
 T(`${name}px: ${screens.length} screens render, none empty, none overflow horizontally`,bad.length==0,bad.join("; "));
 // touch target audit on a dense screen set
 const small=[];for(const s of ["home()","msgs()","board()","pz('p15')","pz('p17')","ints()","talk('mara')","gal()","files()"]){await pg.evaluate(s=>eval(s),s);const r=await pg.evaluate(()=>[...document.querySelectorAll("#screen button, #screen select, #screen input")].filter(e=>e.offsetParent&&!e.closest("svg")).map(e=>{const r=e.getBoundingClientRect();return[e.textContent.trim().slice(0,18)||e.tagName,Math.round(r.width),Math.round(r.height)]}).filter(([n,w,h])=>h<43||w<43&&n.length<2));if(r.length)small.push(s+": "+JSON.stringify(r.slice(0,4)))}
 T(`${name}px: interactive controls meet ~44px touch height`,small.length==0,small.join(" | "));
 // evidence board interactions
 await pg.evaluate(()=>{["E2~E8","E3~E5","E6~E7","B2~N3","AC2~AC1","IT1~AC1"].forEach(()=>{});E.check("E2","contradicts","E8");E.check("E6","relates","E7");E.check("B2","relates","N3");E.check("AC2","relates","AC1");E.check("IT1","relates","AC1");E.check("E3","relates","E5");board()});
 T(`${name}px: board shows both line styles with non-colour markers`,await pg.evaluate(()=>{const d=document.querySelector("#bd");return !!d.querySelector("line:not([stroke-dasharray])")&&!!d.querySelector("line[stroke-dasharray]")&&d.textContent.includes("✓")&&d.textContent.includes("?")}));
 const svgw=await pg.evaluate(()=>document.querySelector("#bd").getBoundingClientRect().width);T(`${name}px: board canvas fits the screen (${Math.round(svgw)}px wide)`,svgw<=vp.width&&svgw>=Math.min(vp.width,320)-40);
 await pg.evaluate(()=>{bvb=[110,60,380,380];board()});
 const nodeXY=async id=>pg.evaluate(id=>{const g=document.querySelector(`#bd g[data-id="${id}"]`).querySelectorAll("circle")[1].getBoundingClientRect();return[g.x+g.width/2,g.y+g.height/2]},id);
 const id0=await pg.evaluate(()=>Object.keys(S.board)[0]);const before=await pg.evaluate(id=>S.board[id].slice(),id0);const xy=await nodeXY(id0);
 if(mobile){const cdp=await pg.createCDPSession();const t=(type,pts)=>cdp.send("Input.dispatchTouchEvent",{type,touchPoints:pts});
  await t("touchStart",[{x:xy[0],y:xy[1],id:1}]);await sleep(40);for(let i=1;i<=8;i++){await t("touchMove",[{x:xy[0]+i*6,y:xy[1]+i*4,id:1}]);await sleep(16)}await t("touchEnd",[]);await sleep(120);
  pg._cdp=cdp}
 else{await pg.mouse.move(xy[0],xy[1]);await pg.mouse.down();await pg.mouse.move(xy[0]+48,xy[1]+32,{steps:8});await pg.mouse.up();await sleep(120)}
 const after=await pg.evaluate(id=>S.board[id].slice(),id0);T(`${name}px: dragging a node moves it (${before.map(Math.round)} -> ${after.map(Math.round)})`,Math.hypot(after[0]-before[0],after[1]-before[1])>8);
 T(`${name}px: dragging does not select the node`,await pg.evaluate(()=>!A&&!B));
 await pg.reload();T(`${name}px: node position persists after a real reload`,await pg.evaluate(([id,a])=>{return Math.abs(S.board[id][0]-a[0])<1&&Math.abs(S.board[id][1]-a[1])<1},[id0,after]));
 await pg.evaluate(()=>{S.unlocked=true;board()});
 if(mobile){const cdp=pg._cdp||await pg.createCDPSession();const t=(type,pts)=>cdp.send("Input.dispatchTouchEvent",{type,touchPoints:pts});const box=await (await pg.$("#bd")).boundingBox();const cx=box.x+box.width/2,cy=box.y+box.height/2;const w0=await pg.evaluate(()=>bvb[2]);
  await t("touchStart",[{x:cx-20,y:cy,id:1},{x:cx+20,y:cy,id:2}]);await sleep(30);for(let i=1;i<=8;i++){await t("touchMove",[{x:cx-20-i*8,y:cy,id:1},{x:cx+20+i*8,y:cy,id:2}]);await sleep(16)}await t("touchEnd",[]);
  T(`${name}px: pinch zooms the board`,(await pg.evaluate(()=>bvb[2]))<w0-20);
  const pxy=await nodeXY(await pg.evaluate(()=>Object.keys(S.board)[1]));await t("touchStart",[{x:pxy[0],y:pxy[1],id:1}]);await sleep(70);await t("touchEnd",[]);await sleep(150);
  T(`${name}px: tapping a node selects it`,await pg.evaluate(()=>!!A||!!B))}
 else{await pg.evaluate(()=>bzoom(.6));T(`${name}px: zoom button changes the view`,await pg.evaluate(()=>bvb[2])<380);const pxy=await nodeXY(await pg.evaluate(()=>Object.keys(S.board)[1]));await pg.mouse.click(pxy[0],pxy[1]);await sleep(100);T(`${name}px: clicking a node selects it`,await pg.evaluate(()=>!!A||!!B))}
 await pg.evaluate(()=>{A=null;B=null;board()});
 // list alternative reaches the same data without the canvas
 T(`${name}px: list alternative lists all saved items`,await pg.evaluate(()=>document.querySelectorAll("#screen .ev").length>=S.ev.length));
 // keyboard focus
 await pg.evaluate(()=>home());await pg.keyboard.press("Tab");const foc=await pg.evaluate(()=>{const e=document.activeElement;const cs=getComputedStyle(e);return{tag:e.tagName,outline:cs.outlineStyle+" "+cs.outlineWidth}});
 T(`${name}px: keyboard Tab reaches a button with a visible focus ring`,foc.tag=="BUTTON"&&!/none/.test(foc.outline),JSON.stringify(foc));
 // keyboard-only message saving
 await pg.evaluate(()=>{thread('mara')});const kb=await pg.evaluate(()=>{const m=document.querySelector("#screen .m[role=button]");m.focus();return document.activeElement===m});
 T(`${name}px: evidence messages are keyboard-focusable`,kb);
 // history back stays in the game
 await pg.evaluate(()=>{home()});await sleep(50);await pg.evaluate(()=>{open_('map')});await sleep(80);const hl=await pg.evaluate(()=>history.length);
 await pg.goBack().catch(()=>{});await sleep(150);const st=await pg.evaluate(()=>({url:location.pathname.slice(-10),home:!!document.querySelector(".grid")}));
 T(`${name}px: browser Back from an app returns to the phone home, not out of the game`,st.url=="index.html"&&st.home,JSON.stringify(st));
 T(`${name}px: no JS errors`,errs.length==0,errs.join("; "));
 console.log(`   (${name}px: ${asset404.length} asset requests failed because no image files are installed, as expected)`);
 await pg.close()}
// storage blocked and quota
for(const [label,script] of [["localStorage blocked",`Object.defineProperty(window,"localStorage",{get(){throw new DOMException("denied","SecurityError")}})`],["quota exceeded",`Storage.prototype.setItem=function(){throw new DOMException("full","QuotaExceededError")}`]]){
 const pg=await b.newPage();await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true});const errs=[];pg.on("pageerror",e=>errs.push(e.message));await pg.evaluateOnNewDocument(script);await pg.goto(FILE);
 await pg.evaluate(()=>{S.unlocked=true;take("E2");take("E8");home()});
 T(`${label}: boots, play works, user is told`,errs.length==0&&await pg.evaluate(()=>S.ev.length==2&&document.querySelector("#screen").textContent.includes("cannot be saved")),errs.join(";"));await pg.close()}
// subdirectory deployment with installed assets and deliberate gaps
{const pg=await b.newPage();await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});const errs=[],bad=[],ok=[];
 pg.on("pageerror",e=>errs.push(e.message));pg.on("response",r=>{if(/\/assets\//.test(r.url()))(r.status()>=400?bad:ok).push(r.url().replace(/.*\/repo\//,""))});
 await pg.goto(HTTP);await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.evaluate(AUTOPLAY);await pg.click(".notif");for(let n=1;n<=8;n++)await pg.evaluate(n=>autoplay(n),n);
 T("subdirectory /repo/ : page loads with relative paths",await pg.evaluate(()=>location.pathname)=="/repo/index.html"&&errs.length==0);
 await pg.evaluate(()=>gal());await sleep(900);
 const g=await pg.evaluate(()=>{const imgs=[...document.querySelectorAll("#screen .pic img")];const tiles=[...document.querySelectorAll("#screen .tile")].map(t=>t.textContent);return{n:imgs.length,loaded:imgs.filter(i=>i.complete&&i.naturalWidth>0).length,fit:imgs[0]&&getComputedStyle(imgs[0]).objectFit,tiles}});
 T(`installed photos load as real images (${g.loaded}) with object-fit: cover`,g.loaded>=10&&g.fit=="cover",JSON.stringify(g));
 await pg.evaluate(()=>photo('P03'));await sleep(300);T("photo viewer shows the real image with alt text and metadata",await pg.evaluate(()=>{const i=document.querySelector("#screen .pic img");return !!i&&i.naturalWidth==1200&&i.alt.length>5&&document.querySelector(".meta").textContent.includes("Taken")}));
 await pg.evaluate(()=>photo('P03',3));T("zoom keeps the image clipped inside its frame",await pg.evaluate(()=>{const f=document.querySelector("#screen .pic").getBoundingClientRect(),w=document.querySelector("#screen .pic").parentElement.getBoundingClientRect();return f.width<=w.width+1}));
 await pg.evaluate(()=>{for(let n=1;n<=9;n++)autoplay(n);gal()});await sleep(700);
 await pg.evaluate(async()=>{const sc=document.querySelector("#screen");for(let y=0;y<=sc.scrollHeight;y+=250){sc.scrollTop=y;await new Promise(r=>setTimeout(r,60))}});await sleep(1200);
 const miss=await pg.evaluate(()=>{const btns=[...document.querySelectorAll("#screen .photo-btn")];const byId=id=>btns.find(b=>b.getAttribute("onclick").includes("'"+id+"'"));const stat=id=>{const b=byId(id);return b?{img:!!b.querySelector("img"),tile:!!b.querySelector(".tile")}:null};return{P17:stat("P17"),P18:stat("P18"),P03:stat("P03"),broken:[...document.querySelectorAll("#screen img")].filter(i=>i.complete&&i.naturalWidth==0).length}});
 T("deliberately missing photos: image element removed, labelled fallback tile remains, no broken-image icons",miss.P17&&miss.P18&&!miss.P17.img&&!miss.P18.img&&miss.P17.tile&&miss.P03.img&&miss.broken==0,JSON.stringify(miss));
 await pg.evaluate(()=>cons());await sleep(500);const av=await pg.evaluate(()=>[...document.querySelectorAll("#screen .av")].map(a=>{const i=a.querySelector("img"),cs=getComputedStyle(a);return{img:!!i&&i.naturalWidth>0,radius:cs.borderRadius,clip:cs.overflow,fit:i?getComputedStyle(i).objectFit:null,alt:i?i.alt:null}}));
 T("portraits are clipped to circles, cover-fitted, with alt text; missing one falls back to initials",av.filter(a=>a.img).length>=5&&av.filter(a=>a.img).every(a=>a.radius.includes("50%")&&a.clip=="hidden"&&a.fit=="cover"&&a.alt.startsWith("Portrait of"))&&av.some(a=>!a.img),JSON.stringify(av));
 await pg.evaluate(()=>clip('a1'));await sleep(500);T("missing audio file: honest synthesized-voice label and full transcript remain",await pg.evaluate(()=>{const t=document.querySelector("#screen").textContent;return t.includes("synthesized")&&t.includes("Victor, not here")}));
 T("every request for an installed asset succeeded (no 404s for files that exist)",bad.filter(u=>!/P17|P18|julia|audio/.test(u)).length==0,bad.join(","));
 T("no JS errors on the subdirectory deployment",errs.length==0,errs.join(";"));await pg.close()}
console.log(fails?"FAILURES: "+fails:"all real-browser checks passed");await b.close()})().catch(e=>{console.log("ERR",e);process.exit(1)});
