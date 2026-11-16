// UI layer. Reads STORY (data) and E (engine).
const $=s=>document.querySelector(s),scr=$("#screen"),S=E.S;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
$("#nb").value=S.nb;$("#nb").oninput=e=>{S.nb=e.target.value;E.save()};
$("#reset").onclick=()=>{if(confirm("Erase all progress and start over?")){E.wipe();location.reload()}};
$("#homebar").onclick=()=>S.unlocked?home():lock();
const bar=(t,back)=>`<div class="bar"><button onclick="${back}">‹</button><h3 style="margin:0">${t}</h3></div>`;
const take=id=>{E.take(id)};
const saveBtn=(id,re)=>STORY.evidence[id]?`<div class="row"><button class="btn red" onclick="take('${id}');${re}" ${S.ev.includes(id)?"disabled":""}>${S.ev.includes(id)?"Saved to evidence":"Save as evidence"}</button></div>`:"";
function lock(){scr.innerHTML=`<div class="lock"><div class="big">02:14</div><div>19 October</div>
<div class="notif" onclick="S.unlocked=true;E.save();thread('moth')"><b>MOTH</b><br>You do this for a living. Iris's backup is attached.</div>
<small style="color:var(--dim)">Iris Vasilescu · recovered device</small></div>`}
function home(){scr.innerHTML=`<h1>Vespera</h1>${banner()}<div class="grid">`+
[...STORY.apps.filter(a=>E.vis({ch:a[3]})),["nb","Notebook"]].map(([id,n,on])=>`<button ${on===0?"disabled":`onclick="open_('${id}')"`} class="${on===0?"dis":""}"><div class="ic ${id=="ev"&&S.ev.length?"on":""}">${n[0]}</div>${n}${on===0?"<br>soon":""}</button>`).join("")+`</div>`}
function open_(id){({msg:()=>msgs(),con:cons,call:calls,mail:()=>mail(),gal:gal,note:notes,ev:board,nb:nbk,soc:soc,aud:aud,vault:()=>pz('p7'),cal:cal,file:files,web:web,map:maps,int:ints,pz:pzs})[id]()}
function nbk(){scr.innerHTML=bar("Notebook","home()")+`<textarea id="nb2" style="width:100%;height:60vh;background:var(--panel);color:inherit;border:1px solid var(--line);border-radius:10px;padding:12px;font:inherit">${esc(S.nb)}</textarea>`;
 $("#nb2").oninput=e=>{S.nb=e.target.value;$("#nb").value=S.nb;E.save()}}
// --- Messages (with search; hidden threads need a discovered flag)
const msgOk=m=>(!m[4]||E.vis({ch:m[4]}))&&(!m[5]||E.has(m[5]));
function visible(t){return E.vis(t)&&(!t.need||E.has(t.need))}
function msgs(q=""){const L=q.toLowerCase(),hits=[];
 Object.entries(STORY.threads).filter(([k,t])=>visible(t)).forEach(([k,t])=>t.m.filter(msgOk).forEach(m=>{if(L&&m[2].toLowerCase().includes(L))hits.push([k,t.name,m])}));
 scr.innerHTML=bar("Messages","home()")+`<input id="q" class="in" placeholder="Search messages" value="${esc(q)}">`+(L?(hits.map(([k,n,m])=>`<button class="th" onclick="thread('${k}')"><b>${n}</b><small>${m[1]} · ${esc(m[2])}</small></button>`).join("")||"<p>No matches.</p>"):
 Object.entries(STORY.threads).filter(([k,t])=>visible(t)).map(([k,t])=>`<button class="th" onclick="thread('${k}')"><b>${t.name}</b><small>${t.sub}</small></button>`).join(""));
 const i=$("#q");i.oninput=()=>msgs(i.value);if(q){i.focus();i.setSelectionRange(q.length,q.length)}}
function thread(k){const t=STORY.threads[k];scr.innerHTML=bar(esc(t.name),"msgs()")+(t.m.some(m=>m[3])?`<small style="color:var(--dim)">Dashed messages can be saved as evidence.</small>`:"")+
 t.m.filter(msgOk).map(([f,ts,x,e])=>`<div class="m ${f=="me"?"me":""} ${e?"has":""} ${e&&S.ev.includes(e)?"saved":""}" ${e?`role="button" tabindex="0" onclick="saveMsg(this,'${e}')" onkeydown="if(event.key=='Enter')saveMsg(this,'${e}')"`:""}>${f!="me"&&f!="them"?`<b class="who">${esc(f)}</b>`:""}${esc(x)}<time>${ts}</time></div>`).join("")}
function saveMsg(el,e){take(e);el.classList.add("saved");el.classList.remove("has")}
// --- Contacts: some entries appear only once the player has learned the name
function cons(){scr.innerHTML=bar("Contacts","home()")+STORY.contacts.filter(c=>!c.need||E.has(c.need)).map(c=>`<button class="th" style="display:flex;gap:10px;align-items:center" onclick="con('${c.id}')">${avatar(c.id,c.n)}<span><b>${c.n}</b><small>${c.rel}</small></span></button>`).join("")+`<small style="color:var(--dim)">New contacts appear as you learn names elsewhere.</small>`}
function con(id){const c=STORY.contacts.find(x=>x.id==id),has=STORY.threads[id]&&visible(STORY.threads[id]);
 scr.innerHTML=bar(c.n,"cons()")+`<div class="meta">Phone: ${c.ph}\nRelationship: ${c.rel}${c.note?"\nNote: "+c.note:""}</div>${c.ev?saveBtn(c.ev,`con('${id}')`):""}<div class="row">${has?`<button class="btn" onclick="thread('${id}')">Open messages</button>`:""}</div>`}
// --- Phone
function calls(){scr.innerHTML=bar("Phone","home()")+STORY.calls.map(([d,n,t,du,aud],i)=>`<button class="th" onclick="callD(${i})"><b style="${du=="missed"?"color:#e7bcbf":""}">${n.includes("019")&&E.has("num:019")?"Luca Marin (new number)":n}</b><small>${d=="in"?"Incoming":"Outgoing"} · ${t} · ${du=="missed"?"missed":du}${aud?" · voicemail":""}</small></button>`).join("")}
function callD(i){const [d,n,t,du,aud]=STORY.calls[i],cn=(STORY.callNotes||{})[i],a=aud&&STORY.audio.find(x=>x.id==aud);
 scr.innerHTML=bar("Call details","calls()")+`<div class="meta">Contact: ${n.includes("019")&&E.has("num:019")?"Luca Marin (new number)":n}\nDirection: ${d=="in"?"Incoming":"Outgoing"}\nTime: ${t}\nDuration: ${du=="missed"?"missed":du}${cn?"\nDetail: "+cn[1]:""}</div>`+
 (a&&E.vis(a)?`<button class="btn" onclick="clip('${a.id}')">🎧 Voicemail and transcript</button>`:a?`<small style="color:var(--dim)">A voicemail exists. It is not available yet.</small>`:"")+(cn?saveBtn(cn[0],`callD(${i})`):"")}
// --- Email: attachments open as documents
function mail(box="Inbox"){scr.innerHTML=bar("Email","home()")+`<div class="row">`+["Inbox","Archived","Trash"].filter(b=>b!="Trash"||E.has("unlock:vault")).map(b=>`<button class="btn ${b==box?"red":""}" onclick="mail('${b}')">${b}</button>`).join("")+`</div>`+
 STORY.mails.filter(m=>m.box==box&&E.vis(m)&&(!m.need||E.has(m.need))).map(m=>`<button class="th" onclick="mailOpen('${m.id}')"><b>${m.from}</b> ${m.att?"📎":""}<small>${m.sub} · ${m.ts}</small></button>`).join("")}
function mailOpen(id){const m=STORY.mails.find(x=>x.id==id);scr.innerHTML=bar(esc(m.sub),`mail('${m.box}')`)+`<div class="mailhead"><div class="subj">${esc(m.sub)}</div><div><span>From</span>${esc(m.from)}</div><div><span>To</span>${esc(m.to)}</div><div><span>Date</span>${m.ts}</div></div><div class="mailbody">${esc(m.body)}</div>`+(m.att?`<button class="btn" onclick="doc('${id}')">📎 ${esc(m.att)}</button>`:"")+saveBtn(m.ev,`mailOpen('${id}')`)}
function doc(id){const m=STORY.mails.find(x=>x.id==id);scr.innerHTML=bar(m.att,`mailOpen('${id}')`)+`<div class="meta">${m.doc.map(esc).join("\n")}</div>`}
// --- Gallery: tap image to zoom, metadata below
function gal(){scr.innerHTML=bar("Gallery","home()")+STORY.photos.filter(p=>E.vis(p)&&(!p.need||E.has(p.need))).map(p=>`<button class="th photo-btn" onclick="photo('${p.id}')" aria-label="Open ${esc(p.t)}">${pic(p)}<small>${esc(p.t)} · ${p.ts}</small></button>`).join("")}
// Photographs: a real file at assets/photos/<id>.jpg is shown with object-fit: cover; if it is missing the fallback stays.
const pic=(p,z=1)=>`<div class="pic"><div class="zoom" style="transform:scale(${z})">${p.art?`<svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Placeholder for: ${esc(p.alt||p.t)}"><rect width="300" height="160" fill="${p.c}"/>${p.art}</svg>`:`<div class="tile" style="background:${p.c}"><span>${esc(p.t)}</span><small>Photo not installed</small></div>`}<img src="assets/photos/${p.id}.jpg" alt="${esc(p.alt||p.t)}" loading="lazy" onload="this.parentElement.querySelectorAll('svg,.tile').forEach(e=>e.style.visibility='hidden')" onerror="this.remove()"></div></div>`;
// Portraits: circular, with initials as fallback; assets/portraits/<id>.png is layered on top when present.
const avatar=(id,n)=>{const f=id=="j"?"julia":id;return `<span class="av">${esc((n||id)[0])}<img src="assets/portraits/${f}.png" alt="Portrait of ${esc(n||id)}" onerror="this.remove()"></span>`};
function photo(id,z=1){const p=STORY.photos.find(x=>x.id==id);scr.innerHTML=bar(esc(p.t),"gal()")+`<div style="overflow:hidden;border-radius:8px">${pic(p,z)}</div><div class="row"><button class="btn" onclick="photo('${id}',${z>=3?1:z+1})">Zoom ${z>=3?"out":"in"}</button></div><div class="meta">${esc(p.meta)}</div>`+saveBtn(id,`photo('${id}',${z})`)}
function notes(){scr.innerHTML=bar("Notes","home()")+STORY.notes.filter(n=>E.vis({ch:n[3]})).map(([t,x,e])=>`<div class="m ${e?"has":""} ${e&&S.ev.includes(e)?"saved":""}" ${e?`onclick="take('${e}');this.classList.add('saved');this.classList.remove('has')"`:""}><b>${t}</b><br>${esc(x)}</div>`).join("")}
// --- Evidence board: build connections between evidence and people; the engine decides what is supported
let A=null,B=null,R="contradicts";
function board(){const nodes=[...S.ev,...S.flags.filter(f=>f.startsWith("place:")&&STORY.places[f.slice(6)]||f.startsWith("event:")&&STORY.events[f.slice(6)]),...Object.keys(STORY.persons).filter(p=>S.ev.some(e=>(STORY.evidence[e][2]||[]).includes(p))).map(p=>"person:"+p)];
 const lab=n=>n.startsWith("person:")?"👤 "+STORY.persons[n.slice(7)]:n.startsWith("place:")?"📍 "+STORY.places[n.slice(6)].n:n.startsWith("event:")?"⏱ "+STORY.events[n.slice(6)]:n+" · "+STORY.evidence[n][0];
 const nb=n=>`<div style="display:flex;gap:6px"><button class="ev ${n==A||n==B?"sel":""}" style="flex:1" onclick="pickN('${n}')">${esc(lab(n))}</button>${STORY.evidence[n]?`<button class="btn" onclick="evidenceDetail('${n}')" aria-label="Inspect ${n}">↗</button>`:""}<button class="btn" style="flex:none;margin:7px 0" onclick="toggleBoard('${n}')" aria-label="${S.board[n]?"Remove from":"Add to"} board">${S.board[n]?"−":"＋"}</button></div>`;
 scr.innerHTML=bar("Evidence board","home()")+(S.ev.length<2?"<p>Save at least two items from Messages, Email, Gallery or Notes.</p>":
 boardCanvas()+`<small style="color:var(--dim)">Pick two items (on the board or in the list), choose how they connect, then test it.</small><div class="row"><span class="msg" style="margin:0">${A?esc(lab(A)):"First item"} → ${B?esc(lab(B)):"second item"}</span></div>`+
 `<div class="row">${STORY.relations.map(r=>`<button class="btn ${r==R?"red":""}" onclick="R='${r}';board()">${r}</button>`).join("")}</div><div class="row"><button class="btn red" onclick="test()" ${A&&B?"":"disabled"}>Test connection</button></div><div id="res"></div><h3>All items</h3>`+nodes.map(nb).join(""))+
 decisions()+(S.made.length?`<h3>Established</h3>`+S.made.map(m=>`<div class="m"><small>${m[1]=="proved"?"✓ Proved":"? Plausible only"}</small><br>${esc(m[2])}<input class="in" placeholder="Your note" value="${esc(m[3]||"")}" onchange="E.note('${m[0]}',this.value)"><div class="row"><button class="btn" onclick="E.drop('${m[0]}');board()">Remove connection</button></div></div>`).join(""):"");
 bindBoard()}
let bvb=[110,60,380,380];
function short_(id){return id.startsWith("person:")?STORY.persons[id.slice(7)].split(" ")[0]:id.startsWith("place:")?"📍":id.startsWith("event:")?"⏱":id}
function boardCanvas(){return `<svg id="bd" viewBox="${bvb.join(" ")}" role="img" aria-label="Evidence board. The list below is an accessible alternative." style="width:100%;height:320px;background:#181a1c;border:1px solid var(--line);border-radius:8px;touch-action:none"></svg><div class="row"><button class="btn" onclick="bzoom(.8)" aria-label="Zoom in">＋</button><button class="btn" onclick="bzoom(1.25)" aria-label="Zoom out">−</button><button class="btn" onclick="bfit()">Fit all</button></div><small style="color:var(--dim)">Solid red line with ✓: proved. Dashed grey line with ?: plausible only. Drag nodes to arrange them; drag the background to pan.</small>`}
function drawBoard(){const sv=$("#bd");if(!sv)return;const positions=S.board;
 const edges=S.made.map(m=>{const [a,b]=m[0].split("~");if(!positions[a]||!positions[b])return "";const p=m[1]=="proved",mx=(positions[a][0]+positions[b][0])/2,my=(positions[a][1]+positions[b][1])/2;
  return `<line x1="${positions[a][0]}" y1="${positions[a][1]}" x2="${positions[b][0]}" y2="${positions[b][1]}" stroke="${p?"#c4424c":"#8a8b8c"}" stroke-width="${p?4:2.5}" ${p?"":'stroke-dasharray="8 6"'}/><text x="${mx}" y="${my+5}" text-anchor="middle" fill="${p?"#f0c8cb":"#cfcac2"}" font-size="16" font-weight="bold" paint-order="stroke" stroke="#181a1c" stroke-width="5">${p?"✓":"?"}</text>`}).join("");
 sv.innerHTML=edges+Object.keys(positions).map(id=>{const on=id==A||id==B;return `<g data-id="${id}" style="cursor:grab"><circle cx="${positions[id][0]}" cy="${positions[id][1]}" r="32" fill="transparent"/><circle cx="${positions[id][0]}" cy="${positions[id][1]}" r="${on?21:18}" fill="${on?"#a3323a":"#2c2f32"}" stroke="#8a8b8c" stroke-width="2"/><text x="${positions[id][0]}" y="${positions[id][1]+5}" text-anchor="middle" fill="#ddd" font-size="12" pointer-events="none">${short_(id)}</text></g>`}).join("")}
function clampB(){bvb[2]=bvb[3]=Math.max(120,Math.min(760,bvb[2]));bvb[0]=Math.max(-150,Math.min(750-bvb[2],bvb[0]));bvb[1]=Math.max(-150,Math.min(650-bvb[2],bvb[1]))}
function bzoom(f,quiet){const w=bvb[2],nw=Math.max(120,Math.min(760,w*f));bvb[0]+=(w-nw)/2;bvb[1]+=(w-nw)/2;bvb[2]=bvb[3]=nw;clampB();const sv=$("#bd");if(sv)sv.setAttribute("viewBox",bvb.join(" "))}
function bfit(){const P=Object.values(S.board);if(!P.length)return;const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),w=Math.max(160,Math.max(...xs)-Math.min(...xs)+120,Math.max(...ys)-Math.min(...ys)+120);bvb=[(Math.min(...xs)+Math.max(...xs))/2-w/2,(Math.min(...ys)+Math.max(...ys))/2-w/2,w,w];clampB();const sv=$("#bd");if(sv)sv.setAttribute("viewBox",bvb.join(" "))}
function bindBoard(){const sv=$("#bd");if(!sv)return;drawBoard();const P=new Map();let drag=null,pan=false,d0=0,moved=0;const k=()=>bvb[2]/Math.min(sv.clientWidth||320,sv.clientHeight||320);
 sv.addEventListener("pointerdown",e=>{P.set(e.pointerId,[e.clientX,e.clientY]);moved=0;const g=e.target.closest&&e.target.closest("g[data-id]");
  if(P.size==2){drag=null;pan=false;const [a,b]=[...P.values()];d0=Math.hypot(a[0]-b[0],a[1]-b[1]);return}if(g)drag=g.dataset.id;else pan=true});
 sv.addEventListener("pointermove",e=>{if(!P.has(e.pointerId))return;const o=P.get(e.pointerId),n=[e.clientX,e.clientY];P.set(e.pointerId,n);const dx=n[0]-o[0],dy=n[1]-o[1];moved+=Math.hypot(dx,dy);
  if(P.size==2){const [a,b]=[...P.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d0&&d){bzoom(d0/d);d0=d}return}
  if(moved<6)return;try{sv.setPointerCapture(e.pointerId)}catch(x){}
  if(drag&&S.board[drag]){const p=S.board[drag];p[0]=Math.max(0,Math.min(600,p[0]+dx*k()));p[1]=Math.max(0,Math.min(500,p[1]+dy*k()));drawBoard()}
  else if(pan){bvb[0]-=dx*k();bvb[1]-=dy*k();clampB();sv.setAttribute("viewBox",bvb.join(" "))}});
 const up=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(P.size==0){if(drag&&moved<6)pickN(drag);else if(drag)E.save();drag=null;pan=false;d0=0}};
 sv.addEventListener("pointerup",up);sv.addEventListener("pointercancel",e=>{P.delete(e.pointerId);drag=null;pan=false})}
function toggleBoard(n){if(S.board[n])E.unplace(n);else{E.place(n);E.save()}board()}
function pickN(n){E.place(n);if(A==n)A=null;else if(B==n)B=null;else if(!A)A=n;else B=n;board()}
function test(){const r=E.check(A,R,B);board();$("#res").innerHTML=`<div class="msg">${r.ok?(r.s=="proved"?"Supported. ":"Plausible, not proven. "):"Not supported. "}${esc(r.t)}</div>`}


// --- Maps: select a place, compare people's records on one timeline, spot gaps, save records as evidence
let vb=[0,0,360,260],who=["Iris"],selP=null;
const hm=iso=>iso.slice(5,10).replace("-","/")+" "+iso.slice(11);
function maps(){const P=STORY.places;
 scr.innerHTML=bar("Maps","home()")+`<svg id="mp" viewBox="${vb.join(" ")}" style="width:100%;background:#181a1c;border:1px solid var(--line);border-radius:8px;touch-action:none">
 <path d="M0 130H360M180 0V260M60 0L150 260M0 40L360 220" stroke="#2c2f32" stroke-width="3" fill="none"/>`+
 Object.entries(P).map(([k,p])=>`<g onclick="selectP('${k}')" style="cursor:pointer"><circle cx="${p.x}" cy="${p.y}" r="18" fill="transparent" pointer-events="all"/><circle cx="${p.x}" cy="${p.y}" r="${selP==k?9:6}" fill="${selP==k?"#a3323a":"#777"}"/><text x="${p.x+10}" y="${p.y+4}" fill="#bbb" font-size="9">${p.n.split(" (")[0]}</text></g>`).join("")+`</svg>
 <div class="row"><button class="btn" onclick="zoom(.7)">+</button><button class="btn" onclick="zoom(1.4)">−</button><button class="btn" onclick="pan(-40,0)">←</button><button class="btn" onclick="pan(40,0)">→</button><button class="btn" onclick="pan(0,-30)">↑</button><button class="btn" onclick="pan(0,30)">↓</button></div>`+
 (selP?`<h3>${P[selP].n}</h3><div class="meta">${P[selP].a}\nAssociated: ${P[selP].who.join(", ")||"no one recorded"}</div>`:"")+
 `<h3>Movement records</h3><div class="row">`+["Iris","Adrian","Victor"].map(w=>`<button class="btn ${who.includes(w)?"red":""}" onclick="who=who.includes('${w}')?who.filter(x=>x!='${w}'):[...who,'${w}'];maps()">${w}</button>`).join("")+`</div>`+timeline();bindMap()}
function timeline(){const R=STORY.records.filter(r=>who.includes(r[1])&&(!selP||r[2]==selP)).sort((a,b)=>a[3].localeCompare(b[3]));let out="",last={};
 R.forEach(r=>{const prev=last[r[1]];if(prev){const g=(new Date(r[3])-new Date(prev))/60000;if(g>=60)out+=`<div class="msg">No record for ${r[1]} between ${prev.slice(11)} and ${r[3].slice(11)} (${Math.round(g)} min). No record was found in this dataset; this does not establish what happened.</div>`}last[r[1]]=r[3];
  out+=`<div class="m ${r[6]?"has":""} ${r[6]&&S.ev.includes(r[6])?"saved":""}" ${r[6]?`onclick="take('${r[6]}');this.classList.add('saved');this.classList.remove('has')"`:""}><b>${r[1]}</b> · ${STORY.places[r[2]].n}<br>${r[5]}<time>${hm(r[3])} · ${r[4]}</time></div>`});return (selP?`<div class="row"><button class="btn" onclick="selP=null;maps()">Show all places</button></div>`:"")+(out||(selP?"<p>No records at this place for the selected people. Add people above.</p>":"<p>Select a person.</p>"))}
function zoom(f){const [x,y,w,h]=vb,nw=Math.max(90,Math.min(360,w*f)),nh=nw*260/360;vb=[Math.max(0,Math.min(360-nw,x+(w-nw)/2)),Math.max(0,Math.min(260-nh,y+(h-nh)/2)),nw,nh];maps()}
function pan(dx,dy){vb=[Math.max(0,Math.min(360-vb[2],vb[0]+dx)),Math.max(0,Math.min(260-vb[3],vb[1]+dy)),vb[2],vb[3]];maps()}
// --- Interviews: evidence you present changes what the suspect says; trust is soft
function ints(){scr.innerHTML=bar("Interviews","home()")+Object.entries(STORY.interviews).filter(([k,i])=>E.vis(i)).map(([k,i])=>{const ok=i.need.every(n=>S.ev.includes(n));return `<button class="th" ${ok?`onclick="talk('${k}')"`:"disabled"}><b>${i.name}</b><small>${ok?"Available":"Save more evidence first: "+i.need.join(", ")}</small></button>`}).join("")}
function talk(k,pick=false){const I=STORY.interviews[k];if(!S.talk[k])E.go(k,I.start);const n=E.node(k,S.talk[k]),tr=S.trust[k]||0;
 scr.innerHTML=bar(I.name,"ints()")+`<div style="display:flex;gap:10px;align-items:center;margin-bottom:6px">${avatar(k,I.name)}</div><small style="color:var(--dim)">${I.meter||"Rapport"}: ${(I.labels||["low","low","medium","high"])[tr]}</small><div class="m">${esc(n.t)}</div>`+(pick?`<p>Present which evidence?</p>`+(S.ev.length?S.ev.map(e=>`<button class="ev" onclick="E.present('${k}','${e}');talk('${k}')">${e} · ${esc(STORY.evidence[e][0])}</button>`).join(""):"<p>No evidence saved.</p>")+`<button class="btn" onclick="talk('${k}')">Cancel</button>`:
 n.o.filter(o=>(!o[2]||tr>=o[2])&&(!o[3]||E.has(o[3]))).map(o=>`<button class="ev" onclick="E.go('${k}','${o[1]}');talk('${k}')">${esc(o[0])}</button>`).join("")+`<div class="row"><button class="btn red" onclick="talk('${k}',true)">Present evidence</button><button class="btn" onclick="E.go('${k}','${I.start}');talk('${k}')">Restart interview</button></div>`)}
// --- Challenges: general puzzle types
let ans={};
function draftAnswer(id,v){ans[id]=v;E.draft(id,v)}
function draftField(id,k,v){ans[id][k]=v;E.draft(id,ans[id])}

function pzs(){scr.innerHTML=bar("Challenges","home()")+STORY.puzzles.filter(p=>E.vis(p)).map(p=>`<button class="th" ${E.ready(p)?`onclick="pz('${p.id}')"`:"disabled"}><b>${p.title}</b> ${S.solved.includes(p.id)?"✓":""}<small>${E.ready(p)?p.type:"Needs more evidence: "+p.needs.join(", ")}</small></button>`).join("")}
function pz(id,msg=""){const p=STORY.puzzles.find(x=>x.id==id);if(ans[id]===undefined)ans[id]=E.initialAnswer(p);const a=ans[id];
 if(!E.supported(p)){scr.innerHTML=bar(p.title,"pzs()")+"<p>This kind of challenge is not available in this version.</p>";return}
 scr.innerHTML=bar(p.title,"pzs()")+`<p>${p.prompt}</p>`+(p.type=="case"?caseUI(p):p.type=="code"?`<input class="in" inputmode="numeric" maxlength="8" value="${esc(ans[id])}" oninput="draftAnswer('${id}',this.value)" placeholder="PIN">`:p.type=="match"?Object.entries(p.items).map(([k,t])=>`<div class="ev">${esc(t)}<select class="in" onchange="draftField('${id}','${k}',this.value)"><option value="">Choose</option>${Object.entries(p.options).map(([v,l])=>`<option value="${v}" ${ans[id][k]==v?"selected":""}>${l}</option>`).join("")}</select></div>`).join(""):p.type=="order"?a.map((k,i)=>`<div class="ev">${esc(p.items[k][0])}<div class="row"><button class="btn" onclick="mv('${id}',${i},-1)">▲</button><button class="btn" onclick="mv('${id}',${i},1)">▼</button></div></div>`).join(""):
 Object.entries(p.options).map(([k,t])=>`<button class="ev ${a.includes(k)?"sel":""}" onclick="tg('${id}','${k}')">${esc(t)}</button>`).join(""))+
 `<div class="row"><button class="btn red" onclick="chk('${id}')">Check answer</button><button class="btn" onclick="hint('${id}')">Hint</button></div><div id="pm">${msg||(S.hintLvl[id]?hintHtml(p,S.hintLvl[id]):"")}</div>`}
function mv(id,i,d){const a=ans[id],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];E.draft(id,a);pz(id)}
function tg(id,k){const a=ans[id];ans[id]=a.includes(k)?a.filter(x=>x!=k):[...a,k];E.draft(id,ans[id]);pz(id)}
function chk(id){const p=STORY.puzzles.find(x=>x.id==id),ok=E.solve(id,ans[id]);let m;
 if(ok)m="Correct. This reasoning is supported by your evidence.";
 else if(p.type=="case"){const d=E.caseDiagnose(p,ans[id]),T={ok:"holds",excess:"something chosen does not belong here, or too much is chosen",incomplete:"needs more or different support",wrong:"reconsider this"};m="Not yet.<br>"+p.slots.map((s,i)=>`${d[i]=="ok"?"✓":"✗"} ${esc(s.label)}: ${T[d[i]]}`).join("<br>")}
 else m="Not quite. Use the Hint button if you are stuck.";
 pz(id,`<div class="msg">${m}</div>`)}
function banner(){const warn=(!Store.ok||!E.saveOk)?`<div class="msg">Progress cannot be saved in this browser mode. Playing still works, but closing the page will lose it.</div>`:"";return warn+banner_()}
function banner_(){const n=Math.min(E.chapter(),STORY.chapters.length),c=STORY.chapters[n-1];if(!c)return "";
 if(E.complete())return `<div class="msg"><b>The investigation is complete</b><br><button class="btn red" onclick="epilogue()">Read the ending</button></div>`;
 const left=c.done.ev.filter(x=>!S.ev.includes(x)).length+c.done.puz.filter(x=>!S.solved.includes(x)).length;
 return `<div class="msg" onclick="objectives()" style="cursor:pointer"><b>Chapter ${n}: ${c.title}</b><br>${c.goal}<br><small>${left} objective(s) remaining</small></div>`}
// --- Calendar / Files / Browser
function cal(){scr.innerHTML=bar("Calendar","home()")+STORY.calendar.map(([d,t,n,l,e],i)=>`<div class="m ${e?"has":""} ${e&&S.ev.includes(e)?"saved":""}" ${e?`onclick="take('${e}');this.classList.add('saved');this.classList.remove('has')"`:""}><b>${esc(n)}</b><br>${esc(l)}<time>${d} · ${t}</time></div>`).join("")}
function files(){scr.innerHTML=bar("Files","home()")+STORY.files.filter(f=>E.vis(f)).map(f=>`<button class="th" onclick="fileOpen('${f.id}')">📄 ${f.n}</button>`).join("")}
function fileOpen(id){const f=STORY.files.find(x=>x.id==id),csv=/\.csv$/.test(f.n),kind=/receipt|invoice/.test(f.n)?"receipt":/log|inventory/.test(f.n)?"log":/statement/.test(f.n)?"stmt":"list";
 const body=csv?`<table class="tbl">${f.lines.map((l,i)=>`<tr>${l.split(",").map(c=>i?`<td>${esc(c)}</td>`:`<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</table>`:kind=="receipt"?`<div class="r-head">${esc(f.lines[0])}</div>`+f.lines.slice(1).map(l=>`<div class="r-line">${esc(l)}</div>`).join(""):f.lines.map((l,i)=>`<div class="${i==0?"p-head":"p-line"}">${esc(l)}</div>`).join("");
 scr.innerHTML=bar(esc(f.n),"files()")+`<div class="paper ${kind}" role="document">${body}</div>`+(f.ev?saveBtn(f.ev,`fileOpen('${id}')`):"")}
function web(){scr.innerHTML=bar("Browser","home()")+`<h3>Bookmarks</h3>`+STORY.web.pages.map((p,i)=>`<button class="th" onclick="page(${i})">🔖 ${p.t}<small>${p.u}</small></button>`).join("")+`<h3>History</h3>`+STORY.web.history.map(h=>`<div class="th">${esc(h[0])}<small>${h[1]}</small></div>`).join("")}
function page(i){const p=STORY.web.pages[i],ok=!p.need||S.ev.includes(p.need);scr.innerHTML=bar(p.t,"web()")+(ok?`<div class="meta">${p.lines.map(esc).join("\n")}</div>`+saveBtn(p.ev,`page(${i})`):`<div class="msg">${p.lock}</div>`)}

// --- Map touch: one finger drags, two fingers pinch. Pure helpers are separate so they can be tested.
function setVB(x,y,w){w=Math.max(90,Math.min(360,w));const h=w*260/360;vb=[Math.max(0,Math.min(360-w,x)),Math.max(0,Math.min(260-h,y)),w,h];const s=$("#mp");if(s)s.setAttribute("viewBox",vb.join(" "))}
function dragPx(dx,dy,pxW){const k=vb[2]/pxW;setVB(vb[0]-dx*k,vb[1]-dy*k,vb[2])}
function pinchBy(f){const [x,y,w]=vb;setVB(x+(w-w/f)/2,y+(w-w/f)*260/360/2,w/f)}
let dragMoved=false;
function selectP(k){if(dragMoved){dragMoved=false;return}selP=k;E.flag('place:'+k);maps()}
function bindMap(){const s=$("#mp");if(!s||!s.addEventListener)return;const P=new Map();let d0=0,tot=0;
 s.addEventListener("pointerdown",e=>{P.set(e.pointerId,[e.clientX,e.clientY]);dragMoved=false;tot=0;if(P.size==2){const [a,b]=[...P.values()];d0=Math.hypot(a[0]-b[0],a[1]-b[1])}});
 s.addEventListener("pointermove",e=>{if(!P.has(e.pointerId))return;const o=P.get(e.pointerId),n=[e.clientX,e.clientY];tot+=Math.hypot(n[0]-o[0],n[1]-o[1]);
  if(tot>6&&!dragMoved){dragMoved=true;try{s.setPointerCapture(e.pointerId)}catch(x){}}
  if(P.size==1&&dragMoved)dragPx(n[0]-o[0],n[1]-o[1],s.clientWidth||360);P.set(e.pointerId,n);
  if(P.size==2){const [a,b]=[...P.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d0&&d){pinchBy(d/d0);d0=d}}});
 const up=e=>{P.delete(e.pointerId);d0=0;try{s.releasePointerCapture(e.pointerId)}catch(x){}};s.addEventListener("pointerup",up);s.addEventListener("pointercancel",up)}
function soc(){scr.innerHTML=bar("Social","home()")+STORY.social.filter(p=>E.vis(p)&&(!p.need||E.has(p.need))).sort((a,b)=>0).map(p=>`<div class="m ${p.ev?"has":""} ${p.ev&&S.ev.includes(p.ev)?"saved":""}" ${p.ev?`onclick="take('${p.ev}');this.classList.add('saved');this.classList.remove('has')"`:""}><b>${p.who}</b> <small>${p.h}</small><br>${esc(p.text)}${p.loc?`<br><small>📍 ${p.loc}</small>`:""}${p.tag?`<br><small>Tagged: ${p.tag}</small>`:""}${p.com?p.com.map(c=>`<br><small>${esc(c)}</small>`).join(""):""}${p.deleted?`<br><small style="color:#e7bcbf">${p.deleted}</small>`:""}<time>${p.kind} · ${p.ts}${p.likes?" · "+p.likes+" likes":""}</time></div>`).join("")}
function aud(){scr.innerHTML=bar("Audio","home()")+STORY.audio.filter(a=>E.vis(a)).map(a=>`<button class="th" onclick="clip('${a.id}')">🎧 ${a.n}<small>${a.ts} · ${a.src}</small></button>`).join("")}
function clip(id){const a=STORY.audio.find(x=>x.id==id),can=typeof speechSynthesis!=="undefined"&&!!speechSynthesis;
 scr.innerHTML=bar(esc(a.n),"aud()")+`<small style="color:var(--dim)">${a.ts} · ${a.src}</small><audio id="au" controls preload="none" src="assets/audio/${id}.mp3" style="width:100%;margin:8px 0"></audio><small id="aun" style="color:var(--dim)"></small>`+a.lines.map(l=>`<div class="m"><b>${esc(l[0])}</b><br>${esc(l[1])}</div>`).join("")+
 `<div class="row">${can?`<button class="btn" onclick="speak('${id}')">▶ Play synthesized voice</button>`:"<small>This device has no speech playback. Read the transcript.</small>"}</div>`+saveBtn(a.ev,`clip('${id}')`);
 const au=$("#au");if(au)au.onerror=()=>{au.remove();const n=$("#aun");if(n)n.textContent="Recorded audio is not installed. The voice here is synthesized; the transcript is complete."}}
function speak(id){const a=STORY.audio.find(x=>x.id==id);try{speechSynthesis.cancel();a.lines.forEach(l=>{if(l[0]=="Music")return;const u=new SpeechSynthesisUtterance(l[1]);u.pitch=/Iris|Mara|J\./.test(l[0])?1.25:.7;u.rate=.95;speechSynthesis.speak(u)})}catch(x){}}
S.unlocked?home():lock();

function decisions(){return (STORY.decisions||[]).filter(d=>E.vis(d)).map(d=>{const c=S.choices[d.id];return `<h3>Decision</h3><div class="m">${esc(d.prompt)}</div>`+(c===undefined?d.opts.map((o,i)=>`<button class="ev" onclick="E.choose('${d.id}',${i});board()">${esc(o[0])}</button>`).join(""):`<small style="color:var(--dim)">You chose: ${esc(d.opts[c][0])}</small>`)}).join("")}

// --- Hints: first hint is a nudge, a second names what to revisit. Used hints are counted, never required.
function hint(id){const p=STORY.puzzles.find(x=>x.id==id),l=E.hint(id);pz(id);$("#pm").innerHTML=hintHtml(p,l)}
const hintHtml=(p,l)=>`<div class="msg">${esc(p.hint)}${l>1?"<br><small>Revisit: "+p.needs.filter(n=>STORY.evidence[n]).map(n=>esc(STORY.evidence[n][0])).join("; ")+"</small>":""}</div>`
// --- Case file: each part needs the right kinds of support; feedback says which parts hold, never which item to pick
function caseUI(p){const a=ans[p.id];return p.slots.map(s=>{if(!s.pick)return `<div class="ev"><b>${s.label}</b><select class="in" onchange="draftField('${p.id}','${s.id}',this.value)"><option value="">Choose</option>${Object.entries(s.options).map(([v,l])=>`<option value="${v}" ${a[s.id]==v?"selected":""}>${l}</option>`).join("")}</select></div>`;
 const sel=a[s.id]||[];return `<div class="ev"><b>${s.label}</b><br><small style="color:var(--dim)">${sel.map(e=>esc(STORY.evidence[e][0])).join("<br>")||"No evidence chosen"}</small><div class="row"><button class="btn" onclick="cslot('${p.id}','${s.id}')">Choose evidence (${sel.length})</button></div></div>`}).join("")}
function cslot(pid,sid){const p=STORY.puzzles.find(x=>x.id==pid),s=p.slots.find(x=>x.id==sid),sel=ans[pid][sid]||[];
 scr.innerHTML=bar(esc(s.label),`pz('${pid}')`)+`<small style="color:var(--dim)">Tap items to add or remove them. Include only what truly supports this part.</small>`+S.ev.map(e=>`<button class="ev ${sel.includes(e)?"sel":""}" onclick="ctoggle('${pid}','${sid}','${e}')"><b>${e}</b> ${esc(STORY.evidence[e][0])}<br><small>${STORY.evidence[e][1]}</small></button>`).join("")}
function ctoggle(pid,sid,e){const a=ans[pid],sel=a[sid]||[];a[sid]=sel.includes(e)?sel.filter(x=>x!=e):[...sel,e];E.draft(pid,a);const y=scr.scrollTop;cslot(pid,sid);scr.scrollTop=y}
function cpick(pid,sid,e){const a=ans[pid],sel=a[sid]||[];a[sid]=sel.includes(e)?sel.filter(x=>x!=e):[...sel,e];E.draft(pid,a);pz(pid)}
// --- Objectives screen
function objectives(){const n=Math.min(E.chapter(),STORY.chapters.length),c=STORY.chapters[n-1],ev=c.done.ev.filter(x=>S.ev.includes(x)).length,pz_=c.done.puz.filter(x=>S.solved.includes(x)).length;
 scr.innerHTML=bar("Objectives","home()")+`<div class="m"><b>Chapter ${n}: ${esc(c.title)}</b><br>${esc(c.goal)}</div><div class="m">Evidence found: ${ev} of ${c.done.ev.length}<br>Challenges solved: ${pz_} of ${c.done.puz.length}</div><small style="color:var(--dim)">Use Challenges and Interviews to make progress. Hints are optional.</small>`}
// --- Ending
function epilogue(){scr.innerHTML=bar("The Last Archive","home()")+`<h1>Epilogue</h1>`+E.epilogue().map(p=>`<div class="m">${esc(p.t)}</div>`).join("")+`<small style="color:var(--dim)">Hints used: ${S.hints}</small>`}

// Browser Back: from any app screen it returns to the phone home screen instead of leaving the game.
(()=>{let pushed=false,skip=false;const sub=()=>!!scr.querySelector(".bar");
 new MutationObserver(()=>{const s_=sub();if(s_&&!pushed){try{history.pushState({la:1},"")}catch(e){}pushed=true}else if(!s_&&pushed&&history.state&&history.state.la){pushed=false;skip=true;try{history.back()}catch(e){skip=false}}}).observe(scr,{childList:true});
 window.addEventListener("popstate",()=>{if(skip){skip=false;return}if(sub()){pushed=false;S.unlocked?home():lock()}else pushed=false})})();
