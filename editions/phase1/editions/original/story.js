// Player-facing content. Spoilers live outside this folder.
const STORY={
 persons:{adrian:"Adrian Popescu",mara:"Mara Ionescu",victor:"Victor Neagu",luca:"Luca Marin",j:"J. (surname unknown)"},
 apps:[["msg","Messages"],["con","Contacts"],["call","Phone"],["mail","Email"],["gal","Gallery"],["note","Notes"],["ev","Evidence"],["map","Maps"],["int","Interviews"],["pz","Challenges"],["cal","Calendar",1,2],["file","Files",1,2],["web","Browser",1,2],["soc","Social",1,3],["aud","Audio",1,3],["vault","Recovery",1,4]],
 threads:{
  moth:{name:"MOTH",sub:"anonymous",m:[
   ["them","Oct 19 · 02:14","You do this for a living. Iris's backup is attached. Read it carefully."],
   ["them","Oct 19 · 02:15","They say it was an accident. It wasn't. Start with the last night."]]},
  adrian:{name:"Adrian",sub:"boyfriend",m:[
   ["them","Oct 17 · 21:40","Party starts at 11, right? I'll bring wine. Don't be mad about earlier."],
   ["me","Oct 17 · 21:52","I'm not mad. I'm tired. Come, be nice."],
   ["them","Oct 18 · 00:31","Leaving soon. Traffic from the south.","E8"],
   ["them","Oct 18 · 03:05","I was home since 10, never even left the flat. Please don't let the police say otherwise.","E2"]]},
  mara:{name:"Mara",sub:"friend",m:[
   ["them","Oct 17 · 18:20","Did Luca text again? Just block him, Iris.","E9"],
   ["them","Oct 18 · 01:58","Home safe?? you vanished"],
   ["me","Oct 18 · 02:03","lights are off. don't wait up"],
   ["them","Oct 18 · 02:40","ok. call me tomorrow, love you"]]},
  luca:{name:"Luca",sub:"hidden until you learn who he is",need:"contact:luca",m:[
   ["them","Oct 9 · 23:12","Stop ignoring me. This isn't about us."],
   ["them","Oct 9 · 23:14","Ask V. about the money before you sign anything."],
   ["me","Oct 9 · 23:40","Leave me alone, Luca."]]}},
 photos:[
  {id:"E3",t:"Hotel corridor",ts:"Oct 18 · 00:52",meta:"File: IMG_4471.HEIC\nTaken: 2026-10-18 00:52:11\nPlace: Hotel Aurelia, Str. Lunii 14\nDevice: Iris's phone\nVisible: man in grey jacket, back to camera",c:"#34383c",art:'<rect x="120" y="40" width="50" height="110" fill="#777"/><circle cx="145" cy="30" r="14" fill="#555"/>'},
  {id:"E4",t:"Party table",ts:"Oct 17 · 23:20",meta:"File: IMG_4466.HEIC\nTaken: 2026-10-17 23:20:40\nPlace: Atelier Nord (venue)\nVisible: table, glasses, a grey jacket over a chair",c:"#3b3033",art:'<rect x="200" y="70" width="70" height="70" fill="#6a6a6e"/>'}],
 notes:[["Shopping","oat milk, lemon, call plumber"],["Gift","M's birthday gift — ask E. about size","E10"],["a.","he says he's home. check the hotel receipts?","E5"]],
 mails:[
  {id:"m1",box:"Inbox",from:"J.",to:"Iris",ts:"Oct 16 · 22:07",sub:"Q3 numbers",body:"Iris, I can't say this on the phone. The Q3 transfers don't match the invoices. Three payments of 4,000 to a private account. I'm not putting my name on this.",att:"transfers_q3.pdf",ev:"E7",doc:["TRANSFERS Q3 (extract)","12 Aug  4,000  ref INV-0 (no invoice on file)","02 Sep  4,000  ref INV-0 (no invoice on file)","24 Sep  4,000  ref INV-0 (no invoice on file)","Beneficiary account: holder not stated"]},
  {id:"m2",box:"Inbox",from:"Victor Neagu",to:"Iris",ts:"Oct 17 · 09:12",sub:"Re: audit question",body:"Drop the audit question. We talk in person from now on, not by email. Party tonight, we can sort it there.",ev:"E6"},
  {id:"m3",box:"Archived",from:"Atelier Nord",to:"Iris",ts:"Oct 12 · 14:30",sub:"Venue confirmation",body:"Your booking for Oct 17, 23:00 is confirmed. Guest list: 9 people."}],
 calls:[["in","J.","Oct 16 · 21:40","missed"],["out","Mara","Oct 17 · 18:05","6:12"],["in","Unknown +40 7xx xxx 019","Oct 17 · 23:58","0:07"],["out","Mara","Oct 18 · 02:31","0:09"]],
 contacts:[
  {id:"adrian",n:"Adrian Popescu",rel:"Boyfriend",ph:"+40 7xx xxx 114"},
  {id:"mara",n:"Mara Ionescu",rel:"Friend since university",ph:"+40 7xx xxx 207"},
  {id:"victor",n:"Victor Neagu",rel:"Business partner",ph:"+40 7xx xxx 330"},
  {id:"j",n:"J.",rel:"(not filled in)",ph:"+40 7xx xxx 602"},
  {id:"luca",n:"Luca Marin",rel:"Ex-boyfriend",ph:"+40 7xx xxx 845",need:"contact:luca"}],
 // evidence: [title, source, people, reveals-flags]
 evidence:{
  E2:["Adrian 03:05: 'home since 10, never left'","Messages",["adrian"]],
  E8:["Adrian 00:31: 'Leaving soon. Traffic from the south.'","Messages",["adrian"]],
  E3:["Photo, Hotel Aurelia 00:52, man in grey jacket","Gallery",[]],
  E4:["Photo, party table 23:20, grey jacket on chair","Gallery",[]],
  E5:["Note: 'he says he's home. check the hotel receipts?'","Notes",[]],
  E6:["Victor 09:12: 'Drop the audit question'","Email",["victor"]],
  E7:["J.: Q3 transfers don't match invoices","Email",["j"]],
  E9:["Mara 18:20: 'Did Luca text again?'","Messages",["luca","mara"],["contact:luca"]]},
 // links the engine can validate: [a,b,relation,strength,explanation]. strength: proved | plausible
 links:[
  ["E2","E8","contradicts","proved","At 00:31 he says he is about to travel; at 03:05 he says he never left home. Both cannot be true. This doesn't say where he went or why."],
  ["E3","E5","relates","plausible","Iris's phone was at the hotel at 00:52 and her own note mentions hotel receipts. That fits, but the note is undated and nothing shows whom she was following."],
  ["E6","E7","relates","plausible","Victor wants an 'audit question' dropped; J.'s email describes unexplained transfers. They may be the same issue, but Victor's email never names the transfers."],
  ["E3","E4","relates","plausible","Both photos show a grey jacket, but a jacket is not an identification. Nobody can be named from these two alone."]],
 limits:{"E2|adrian":"authored","E8|adrian":"authored","E6|victor":"authored","E7|j":"authored"}
};
// ---- Stage 3 data: Maps, puzzles, interviews ----
Object.assign(STORY.evidence,{
 M1:["Map: Iris's phone at Hotel Aurelia, 00:49","Maps",[],[]],
 M2:["Map: Adrian's shared location last at home 00:20, then paused","Maps",["adrian"],[]],
 M3:["Office door log: Victor's last exit 18:30 on Oct 17","Maps",["victor"],[]],
 I1:["Interview: Adrian admits he did leave his flat","Interview",["adrian"],[]]});
STORY.links.push(
 ["E3","M1","relates","proved","The photo metadata (00:52) and the phone ping (00:49) agree: Iris's phone was at Hotel Aurelia. This is about her phone's location, not whom she met."],
 ["E2","M2","relates","plausible","Adrian's last shared location is at home at 00:20, then sharing stops. It neither confirms nor refutes 'home since 10'."],
 ["E8","M2","relates","plausible","The location stops at 00:20, eleven minutes before he says he is leaving. After that there is no record of where he was."],
 ["E2","I1","contradicts","proved","In the interview he admits leaving the flat, which contradicts 'never even left the flat'. It does not say where he went."]);
STORY.limits["M2|adrian"]="authored";STORY.limits["M3|victor"]="authored";STORY.limits["I1|adrian"]="authored";
STORY.places={
 apt:{n:"Iris's apartment",a:"Str. Teilor 8",x:90,y:70,who:["Iris"]},
 atelier:{n:"Atelier Nord (party venue)",a:"Calea Nord 21",x:230,y:60,who:["Party guests"]},
 hotel:{n:"Hotel Aurelia",a:"Str. Lunii 14",x:300,y:170,who:[]},
 office:{n:"Studio Vasilescu Neagu",a:"Bd. Unirii 40",x:150,y:200,who:["Iris","Victor"]},
 adrian:{n:"Adrian's flat",a:"Str. Salcamilor 3",x:50,y:190,who:["Adrian"]}};
// records: [id, who, place, ISO time, source, text, evidence]
STORY.records=[
 ["r1","Iris","apt","2026-10-17T22:48","Phone location","At home"],
 ["r2","Iris","atelier","2026-10-17T23:05","Phone location","Arrived"],
 ["r3","Iris","atelier","2026-10-17T23:50","Phone location","Still at venue"],
 ["r4","Iris","hotel","2026-10-18T00:49","Phone location","At hotel","M1"],
 ["r5","Iris","apt","2026-10-18T02:03","Phone location","At home"],
 ["r6","Adrian","adrian","2026-10-17T21:30","Shared location","At home"],
 ["r7","Adrian","adrian","2026-10-17T22:05","Shared location","At home"],
 ["r8","Adrian","adrian","2026-10-18T00:20","Shared location","At home. Sharing paused.","M2"],
 ["r9","Victor","office","2026-10-17T18:30","Door log","Exit badge scan","M3"]];
// general puzzle engine data (types: order, set). Narrative links live in STORY.links; these are reusable.
STORY.puzzles=[
 {id:"p1",type:"order",title:"Order Iris's night",needs:["E4","E3"],prompt:"Put these events in the order they happened.",
  items:{a:["Party table photo taken","2026-10-17T23:20"],b:["Hotel corridor photo taken","2026-10-18T00:52"],c:["Mara: 'you vanished'","2026-10-18T01:58"],d:["Iris: 'lights are off'","2026-10-18T02:03"],e:["Call to Mara","2026-10-18T02:31"]},
  hint:"Every item has a timestamp in Gallery, Messages or Phone."},
 {id:"p2",type:"set",title:"Where was Iris's phone?",needs:["M1"],prompt:"Select every record that puts Iris at a location other than her apartment.",
  options:{r1:"22:48 Phone location",r2:"23:05 Phone location",r4:"00:49 Phone location",r5:"02:03 Phone location",r8:"Adrian 00:20 shared location"},
  answer:["r2","r4"],hint:"Only Iris's own records count, and not the ones at home."}];
STORY.interviews={adrian:{name:"Adrian Popescu",need:["E2"],start:"a0",nodes:{
 a0:{t:"I already told the police. I was home. Why ask me again?",o:[["Walk me through your evening.","a1"],["Ask about the party.","a6"],["Is there anyone who can confirm that?","a10"]]},
 a1:{t:"Dinner. A film. I fell asleep on the sofa.",o:[["Go back.","a0"]]},
 a6:{t:"I was invited. I didn't go. Iris and I had argued that afternoon.",o:[["Go back.","a0"]]},
 a10:{t:"I live alone. Nobody. That's the whole point of staying in.",o:[["Go back.","a0"]]},
 a3:{t:"I said I was leaving. Then I changed my mind and drove around for a while.",set:["adrian:left"],trust:1,take:"I1",o:[["Where did you drive?","a7"],["Go back.","a0"]]},
 a7:{t:"I'd rather not say. It's personal.",o:[["Is there someone else?","a8",1],["Go back.","a0"]]},
 a8:{t:"...Yes. It has nothing to do with Iris. I won't give you a name yet.",set:["adrian:other"],trust:1,o:[["Go back.","a0"]]},
 a4:{t:"A grey jacket? Half the city owns one. You can't pin that on me.",trust:-1,o:[["I'm not accusing you.","a9"],["Go back.","a0"]]},
 a9:{t:"Fine. Ask what you need to ask.",trust:1,o:[["Go back.","a0"]]},
 a5:{t:"My phone paused it. Battery saver. It does that.",o:[["Go back.","a0"]]},
 pd:{t:"I don't see what that proves.",o:[["Go back.","a0"]]}},
 present:{E8:"a3",E3:"a4",M2:"a5"}}};
// ---- Stage 4: chapters, Calendar/Files/Browser, Chapter 2 content, generic nodes ----
STORY.persons.elena="Elena Vasilescu";
STORY.relations=["contradicts","relates","authored","located"];
STORY.events={party:"The party at Atelier Nord (Oct 17, 23:00)"};
STORY.chapters=[
 {id:1,title:"The recovered device",goal:"Establish what Adrian said, where Iris's phone was, and whether the two agree.",done:{ev:["E2","E8","E3","M1"],puz:["p2"]}},
 {id:2,title:"Private lives",goal:"Find out who paid for what, who Iris met that day, and who she was arguing with.",done:{ev:["F1","N1","C1","E7"],puz:["p3"]}}];
Object.assign(STORY.evidence,{
 E10:["Note: 'ask E. about size' (an E. in Iris's life)","Notes",[],["contact:elena"]],
 E11:["Elena 16:42: 'can't decide about Mum's flat without me'","Messages",["elena"]],
 C1:["Calendar: in-person meeting with V, Oct 17 17:30, office","Calendar",["victor"]],
 F1:["Receipt: Hotel Aurelia room, Oct 11, card ending 4417","Files",[]],
 N1:["Contact note: Adrian's card ends 4417","Contacts",["adrian"]],
 B1:["Registry lookup: transfer beneficiary is an individual, IBAN ends 2290","Browser",[]]});
STORY.evidence.E4[3]=["event:party"];
STORY.limits["E11|elena"]="authored";
STORY.links.push(
 ["E3","place:hotel","located","proved","The photo's metadata places it at Hotel Aurelia."],
 ["M1","place:hotel","located","proved","The phone ping is at Hotel Aurelia."],
 ["E4","place:atelier","located","proved","The photo's metadata places it at the party venue."],
 ["E4","event:party","relates","proved","The photo was taken at 23:20, shortly after the party began."],
 ["E7","B1","relates","plausible","J. describes transfers to a private account; the registry says the beneficiary is an individual. It does not say who."],
 ["F1","N1","relates","proved","The card on the hotel receipt matches the card noted for Adrian. That card paid for a room on Oct 11. It does not show he stayed there, or who else did."],
 ["F1","E5","relates","plausible","Iris's note suggests she looked at hotel receipts. This receipt is one, but the note is undated."],
 ["C1","E6","relates","plausible","Iris had an in-person meeting with Victor that afternoon, matching 'we talk in person'. What was said is unrecorded."],
 ["C1","M3","relates","plausible","Victor's door log shows he left the office at 18:30, an hour after the meeting was scheduled. It does not confirm the meeting happened."]);
STORY.threads.elena={name:"Elena",sub:"sister",need:"contact:elena",ch:2,m:[
 ["them","Oct 17 · 16:42","You can't just decide about Mum's flat without me.","E11"],
 ["me","Oct 17 · 16:58","It's not decided. Stop shouting at me over text."],
 ["them","Oct 17 · 17:01","Then answer your phone."]]};
STORY.contacts.push({id:"elena",n:"Elena Vasilescu",rel:"Younger sister",ph:"+40 7xx xxx 771",need:"contact:elena"});
STORY.contacts.find(c=>c.id=="adrian").note="Card: Visa ending 4417 (his)";STORY.contacts.find(c=>c.id=="adrian").ev="N1";
STORY.calendar=[
 ["Oct 14","19:00","Dinner with E.","Cancelled by Iris"],
 ["Oct 16","18:00","J. ?","No location"],
 ["Oct 17","17:30","V: numbers, in person","Studio Vasilescu Neagu","C1"],
 ["Oct 17","23:00","Party","Atelier Nord"]];
STORY.files=[
 {id:"f1",n:"receipt_aurelia_oct11.pdf",ev:"F1",lines:["HOTEL AURELIA, Str. Lunii 14","Date: 11 Oct","Room 214, 1 night, 2 guests","Paid: card ending 4417"]},
 {id:"f2",n:"atelier_invoice.pdf",lines:["ATELIER NORD","Venue hire, Oct 17","Paid in full"]}];
STORY.web={history:[
 ["hotel aurelia cancellation policy","Oct 11 · 21:15"],["duplicate invoices accounting how to check","Oct 15 · 08:40"]],
 pages:[{t:"Companies registry: beneficiary lookup",u:"registry.example/lookup",need:"E7",ev:"B1",lines:["Account lookup (reference from transfers_q3.pdf)","Beneficiary type: individual","Opened: Oct 2025","IBAN ends: 2290","Name: withheld"],lock:"This bookmark needs a reference number. Find one in your documents."}]};
STORY.puzzles.push({id:"p3",type:"match",title:"Whose record is it?",needs:["F1","N1","M3"],prompt:"Match each record to the person it is tied to.",
 items:{f:"Receipt card ending 4417",g:"Door log exit 18:30 on Oct 17",h:"Shared location paused at 00:20"},options:{adrian:"Adrian",victor:"Victor",iris:"Iris"},pairs:{f:"adrian",g:"victor",h:"adrian"},hint:"Each record names, or is noted against, its owner in another app."});
// ---- Stage 5: Chapters 3-4 (party reconstruction, recovered data), Social, Audio, second interview ----
STORY.chapters.push(
 {id:3,title:"The night of the party",goal:"Work out who was at the venue and when, using posts, voice recordings and records.",done:{ev:["S1","S2","S3","A1"],puz:["p4","p5"]}},
 {id:4,title:"Deleted",goal:"Open the recovered vault, then decide which recovered item is not what it appears to be.",done:{ev:["D1","D2","D3","H2"],puz:["p6","p7"]}});
STORY.persons.moth="MOTH (anonymous)";
Object.assign(STORY.evidence,{
 S1:["Mara's story 23:35, tagged at Atelier Nord","Social",["mara"]],
 S2:["Mara's story 00:41, 'last dance', Atelier Nord","Social",["mara"]],
 S3:["Victor's post 23:52, tagged at Atelier Nord with Iris","Social",["victor"]],
 A1:["Voice memo 23:42: Iris says 'Victor, not here'","Audio",["victor"]],
 A2:["Voicemail from J., Oct 16: 'call me from a phone that isn't yours'","Audio",["j"]],
 A3:["Voice note from Mara, Oct 17 18:30: 'did you talk to him?'","Audio",["mara"]],
 D1:["Deleted: Iris asks Mara why Victor asks what they talk about","Recovered messages",["mara","victor"]],
 D2:["Deleted post: 'Everyone I trust is in this room.' (removed 00:58)","Recovered social",[]],
 D3:["Trashed email from Elena: tea left in Iris's kitchen","Recovered email",["elena"]],
 H1:["Hidden photo, Oct 17 20:40: kitchen counter with a tea box","Gallery (hidden)",[]],
 H2:["Photo copy: party table, last modified 03:12 on Oct 18","Gallery (hidden)",[]],
 V1:["Interview: Victor admits telling Iris to drop it","Interview",["victor"]]});
STORY.limits["S1|mara"]=STORY.limits["S2|mara"]=STORY.limits["S3|victor"]=STORY.limits["D3|elena"]="authored";
STORY.limits["A2|j"]=STORY.limits["A3|mara"]="authored";
STORY.links.push(
 ["S1","place:atelier","located","proved","The story is tagged at Atelier Nord at 23:35."],
 ["S3","place:atelier","located","proved","The post is tagged at Atelier Nord at 23:52."],
 ["S3","E6","contradicts","plausible","Victor wrote 'we talk in person' and then posted from the party, so a conversation could have happened there. Nothing says it did."],
 ["A1","S3","relates","plausible","Iris says 'Victor, not here' at 23:42, ten minutes before his post. It suggests a tense exchange, but not what it was about."],
 ["A2","E7","relates","plausible","J. asks for a private phone; J.'s email says J. will not put a name on this. Both fit someone afraid of being traced."],
 ["D1","S3","relates","plausible","Victor asking about Iris's and Mara's conversations is odd for someone who says he was not involved in Iris's personal life. It is a question, not proof of anything."],
 ["D2","M1","relates","plausible","The post was removed at 00:58, nine minutes after Iris's phone was at the hotel. It might be connected, or not."],
 ["H2","E4","contradicts","proved","Both are the same party table photo, but one was modified at 03:12 on Oct 18, after the party and after Iris's last messages. The original and the copy do not match."]);
STORY.photos.push(
 {id:"H1",t:"Kitchen counter",ts:"Oct 17 · 20:40",meta:"File: IMG_4455.HEIC\nTaken: 2026-10-17 20:40:02\nPlace: Str. Teilor 8\nVisible: tea box, one glass",c:"#3a3630",art:'<rect x="70" y="60" width="40" height="60" fill="#6b5a3a"/><rect x="170" y="90" width="22" height="40" fill="#889"/>',ch:4,need:"unlock:vault"},
 {id:"H2",t:"Party table (copy)",ts:"Oct 17 · 23:20",meta:"File: IMG_4466 (1).HEIC\nTaken: 2026-10-17 23:20:40\nModified: 2026-10-18 03:12:09\nSoftware: PhotoEdit 4.2\nVisible: table, glasses, one chair now empty",c:"#3b3033",art:'<rect x="200" y="70" width="70" height="70" fill="#3b3033"/>',ch:4,need:"unlock:vault"});
STORY.social=[
 {id:"s0",who:"Adrian Popescu",h:"@adrian.p",ts:"Oct 12 · 20:15",kind:"post",text:"Three years with the best person I know. 💛",loc:"",likes:214,com:["mara.io: Cutest!","iris.v: ♥"]},
 {id:"s1",who:"Mara Ionescu",h:"@mara.io",ts:"Oct 17 · 23:35",kind:"story",text:"Atelier Nord, we are here ✨",loc:"Atelier Nord",ev:"S1",ch:3},
 {id:"s3",who:"Victor Neagu",h:"@victor.neagu",ts:"Oct 17 · 23:52",kind:"post",text:"Proud of this team. Tonight we celebrate.",loc:"Atelier Nord",tag:"Iris Vasilescu",likes:98,ev:"S3",ch:3},
 {id:"s2",who:"Mara Ionescu",h:"@mara.io",ts:"Oct 18 · 00:41",kind:"story",text:"last dance 🕺",loc:"Atelier Nord",ev:"S2",ch:3},
 {id:"s4",who:"Iris Vasilescu",h:"@iris.v",ts:"Oct 17 · 23:10",kind:"post",text:"Everyone I trust is in this room.",loc:"Atelier Nord",deleted:"Deleted Oct 18 · 00:58",ev:"D2",ch:4,need:"unlock:vault"}];
STORY.audio=[
 {id:"a1",n:"Voice memo",ts:"Oct 17 · 23:42",src:"Iris's phone, recorded at the venue",lines:[["Music","(loud music, voices)"],["Man","Iris, one minute, please."],["Iris","Victor, not here."],["Music","(a phone rings and is cut off)"]],ev:"A1",ch:3},
 {id:"a2",n:"Voicemail",ts:"Oct 16 · 21:40",src:"Missed call from J.",lines:[["J.","Iris, it's J. Don't use the office wifi for this."],["J.","Call me from a phone that isn't yours."]],ev:"A2",ch:3},
 {id:"a3",n:"Voice note",ts:"Oct 17 · 18:30",src:"From Mara",lines:[["Mara","Hey. Did you talk to him? I'll see you there. Wear the green one."]],ev:"A3",ch:3}];
STORY.mails.push({id:"m4",box:"Trash",from:"Elena",to:"Iris",ts:"Oct 17 · 20:02",sub:"sorry about earlier",body:"I'm sorry about earlier. I left the tea in your kitchen, the one that helps you sleep. Please use it. Don't be stubborn.",ev:"D3",ch:4,need:"unlock:vault"});
STORY.threads.mara_del={name:"Mara (deleted)",sub:"recovered conversation",need:"unlock:vault",ch:4,m:[
 ["me","Oct 15 · 19:03","Victor asked me what you and I talk about. Why would he?","D1"],["them","Oct 15 · 19:10","No idea. He's nosy. Ignore him."]]};
STORY.notes.push(["vault","pin: the night, then how many of us (2 digits each)",null,4]);
STORY.puzzles.push(
 {id:"p4",type:"set",ch:3,title:"Who was at the venue?",needs:["S1","S3","E4"],prompt:"Select the people with direct evidence of being at Atelier Nord that night, other than Iris.",
  options:{mara:"Mara",victor:"Victor",adrian:"Adrian",luca:"Luca",elena:"Elena"},answer:["mara","victor"],hint:"Direct evidence means a record of their own, not what someone says about them."},
 {id:"p5",type:"order",ch:3,title:"Order the evening",needs:["S1","S2","S3","M1"],prompt:"Put these events in order.",
  items:{a:["Iris's phone arrives at the venue","2026-10-17T23:05"],b:["Mara's first story","2026-10-17T23:35"],c:["Voice memo: 'Victor, not here'","2026-10-17T23:42"],d:["Victor's post","2026-10-17T23:52"],e:["Mara's 'last dance' story","2026-10-18T00:41"],f:["Iris's phone at the hotel","2026-10-18T00:49"]},hint:"Posts, memos and records all have timestamps."},
 {id:"p6",type:"set",ch:4,title:"Which photo was altered?",needs:["E4"],need:"unlock:vault",prompt:"Select the photo that was modified after it was taken.",options:{E4:"Party table (original)",H2:"Party table (copy)",H1:"Kitchen counter",E3:"Hotel corridor"},answer:["H2"],hint:"Compare the Taken and Modified lines in each photo's metadata."},
 {id:"p7",type:"code",ch:4,title:"Open the recovered vault",needs:[],prompt:"Enter the 4-digit PIN Iris hinted at in her notes.",answer:"1709",unlocks:"unlock:vault",hint:"Her note says: the night, then how many of us. Look for a date and a headcount in her email."});
STORY.interviews.victor={name:"Victor Neagu",ch:3,need:["E6"],meter:"Pressure",labels:["calm","calm","tense","hostile"],start:"v0",nodes:{
 v0:{t:"I have ten minutes. Iris was my partner in the company, not my keeper. I wasn't involved in her private life.",o:[["Ask about the business.","v1"],["Ask about the party.","v2"]]},
 v1:{t:"The company is fine. Seasonal cash flow. Every agency has it.",o:[["Go back.","v0"]]},
 v2:{t:"I went for an hour. I toasted her and left.",o:[["Go back.","v0"]]},
 v3:{t:"Yes, I told her to drop it. Numbers don't belong in email. That's discipline, not a threat.",take:"V1",set:["victor:admits_email"],o:[["Go back.","v0"]]},
 v4:{t:"We met at the office. We always did. I won't discuss what was said in a business meeting.",o:[["Go back.","v0"]]},
 v5:{t:"A post is a post. I was proud of her.",o:[["Go back.","v0"]]},
 v6:{t:"J. is a disgruntled contractor. You shouldn't trust anything from J.",trust:1,o:[["Go back.","v0"]]},
 v7:{t:"I don't know whose account that is. Why are you asking me?",trust:1,o:[["Go back.","v0"]]},
 v8:{t:"We're done until you can name someone. Show me something with a name on it.",trust:-3,o:[["Come back later.","v0"]]},
 v9:{t:"That's a voice in a loud room. Half the city says 'not here' to me.",o:[["Go back.","v0"]]},
 pd:{t:"I don't see the relevance.",o:[["Go back.","v0"]]}},
 present:{E6:"v3",C1:"v4",S3:"v5",E7:"v6",B1:"v7",A1:"v9"},stonewall:{B1:"v8",E7:"v8"}};
// ---- Stage 6: Chapters 5-6 (alibis; the wrong theory), third and fourth interviews, decision ----
STORY.chapters.push(
 {id:5,title:"Everyone has an alibi",goal:"Set what each person says against what the records allow, and find who has an unexplained window.",done:{ev:["K1","K2","K3","K5","L1","L2"],puz:["p8","p9"]}},
 {id:6,title:"The wrong theory",goal:"Test the theory you have been building. Something you treated as solid may mean something else.",done:{ev:["W1","MV1","LV1"],puz:["p10","p11"]}});
Object.assign(STORY.evidence,{
 K1:["Statement, Mara: left ~01:00 by taxi; Iris left with Victor ~00:45","Files",["mara"]],
 K2:["Statement, Victor: left ~00:30; Iris left alone ~00:15","Files",["victor"]],
 K3:["Statement, Luca: on shift at Nord depot 22:00 to 06:00","Files",["luca"]],
 K4:["Statement, Elena: at home all night, did not attend","Files",["elena"]],
 K5:["Atelier coat-check log: ticket 17 redeemed 00:22","Email",[]],
 T1:["Photo: coat-check ticket 17, 23:04","Gallery",[]],
 L1:["Luca 11 Oct: 'new number since you blocked the old one ... 019'","Messages",["luca"],["num:019"]],
 L2:["Depot shift log: Luca out 00:50, back 01:55","Files",["luca"]],
 L3:["Luca 9 Oct: 'Ask V. about the money before you sign anything'","Messages",["luca","victor"]],
 W1:["Vendor export: 'M. Ionescu (freelance)', account ends 2290","Files",["mara"]],
 LV1:["Interview: Luca says he warned Iris about the money","Interview",["luca"]],
 MV1:["Interview: Mara confirms Victor paid her and asked her to keep him informed","Interview",["mara","victor"]]});
Object.assign(STORY.limits,{"K1|mara":"authored","K2|victor":"authored","K3|luca":"authored","K4|elena":"authored","L1|luca":"authored","L3|luca":"authored","LV1|luca":"authored","MV1|mara":"authored"});
STORY.links.push(
 ["K1","K5","contradicts","plausible","Mara says Iris left with Victor around 00:45. The coat ticket was redeemed at 00:22 and Iris's phone was at the hotel at 00:49. Her version is hard to believe, but a redeemed ticket does not prove who left when."],
 ["K2","K5","relates","plausible","Victor says Iris left alone around 00:15; the coat was collected at 00:22. Close, though not exact."],
 ["T1","K5","relates","proved","Ticket 17 is the one in Iris's photo, and the log records ticket 17 as redeemed at 00:22. Who redeemed it is not recorded."],
 ["K1","K2","contradicts","proved","Mara says Iris left with Victor; Victor says she left alone. They cannot both be right. Neither statement settles which is true."],
 ["L2","K3","contradicts","plausible","Luca says he was on shift all night; the log shows him out for 65 minutes. That weakens the alibi but a break may be allowed."],
 ["L2","M1","relates","plausible","Luca's break (00:50 to 01:55) overlaps the period after Iris's phone reached the hotel. Overlap is not presence."],
 ["L1","L3","relates","proved","Both messages are from Luca; the 11 Oct message explains that the 019 number is his new one."],
 ["B1","W1","relates","proved","The account ending 2290 in the registry matches the vendor listed as 'M. Ionescu (freelance)'. Payments went to an account listed under that name. This does not show who approved them."],
 ["E7","W1","relates","plausible","J. described three transfers with no invoices to a private account; the vendor export lists that account under a freelance vendor. Consistent, but the export does not show who authorised the transfers."],
 ["D1","MV1","relates","proved","Mara confirms Victor asked about her conversations with Iris, which explains D1. It does not say what he did with her answers."],
 ["A3","MV1","relates","plausible","'Did you talk to him?' may have meant Victor, which Mara now confirms she was reporting to. It is her account, not independent proof."],
 ["LV1","L3","relates","proved","Luca confirms the 'ask V. about the money' message was a warning about Victor's handling of money."]);
STORY.threads.luca.m.push(["them","Oct 11 · 12:02","This is my new number since you blocked the old one. 019. Please read before you delete.","L1",5]);
STORY.threads.luca.m[1][3]="L3";
STORY.threads.moth.m.push(
 ["them","Oct 20 · 10:12","Good. Mara's version doesn't match that. Look at Luca's depot hours next.","",5,"moth:shared"],
 ["them","Oct 20 · 10:12","You're holding back. Time matters. Look at Luca's depot hours.","",5,"moth:withheld"]);
STORY.decisions=[{id:"d1",ch:5,prompt:"MOTH wants your findings. You have the coat-check log. Do you share it?",opts:[["Share it with MOTH","moth:shared"],["Keep it to yourself","moth:withheld"]]}];
STORY.mails.push({id:"m5",box:"Inbox",from:"Atelier Nord",to:"Iris",ts:"Oct 18 · 09:00",sub:"Coat check log",body:"Following last night's event: coat check ticket 17 (Vasilescu) was redeemed at 00:22. Please contact us about any lost property.",ev:"K5",ch:5});
STORY.photos.push({id:"T1",t:"Coat-check ticket 17",ts:"Oct 17 · 23:04",meta:"File: IMG_4458.HEIC\nTaken: 2026-10-17 23:04:19\nPlace: Atelier Nord (venue)\nVisible: ticket no. 17 held in a hand",c:"#2f3336",art:'<rect x="110" y="40" width="80" height="70" fill="#8a8470"/><text x="130" y="85" fill="#222" font-size="22">17</text>',ch:5});
STORY.files.push(
 {id:"f3",n:"statement_mara.pdf",ev:"K1",ch:5,lines:["STATEMENT: Mara Ionescu","Left the party around 01:00 by taxi, home about 01:20.","Iris left with Victor around 00:45.","Texted Iris at 01:58 and 02:40."]},
 {id:"f4",n:"statement_victor.pdf",ev:"K2",ch:5,lines:["STATEMENT: Victor Neagu","Left the party about 00:30 and went home.","Iris left alone around 00:15."]},
 {id:"f5",n:"statement_luca.pdf",ev:"K3",ch:5,lines:["STATEMENT: Luca Marin","On shift at the Nord depot from 22:00 to 06:00."]},
 {id:"f6",n:"statement_elena.pdf",ev:"K4",ch:5,lines:["STATEMENT: Elena Vasilescu","At home all night. Did not attend the party."]},
 {id:"f7",n:"depot_shift_log.pdf",ev:"L2",ch:5,lines:["NORD DEPOT shift log: L. Marin","21:58 badge in","00:50 badge out (break, off-site permitted)","01:55 badge in","06:02 badge out"]},
 {id:"f8",n:"vendors_export.csv",ev:"W1",ch:6,lines:["vendor,account ends","Atelier Nord,1184","Print House,7761","M. Ionescu (freelance),2290","Studio Insurance,0042"]});
STORY.puzzles.push(
 {id:"p8",type:"set",ch:5,title:"Whose story is hardest to believe?",needs:["K1","K2","K5","M1"],prompt:"Select every statement that the coat-check log and Iris's phone make hard to believe.",options:{K1:"Mara: Iris left with Victor around 00:45",K2:"Victor: Iris left alone around 00:15",K3:"Luca: on shift 22:00 to 06:00",K4:"Elena: at home all night"},answer:["K1"],hint:"Something is hard to believe only if a record you hold cuts against it, not just because the person is a suspect."},
 {id:"p9",type:"match",ch:5,title:"Who is on the line?",needs:["L1","A2"],prompt:"Match each call record to the person on it.",items:{a:"Call 23:58, 7 seconds, unknown number ending 019",b:"Voicemail, Oct 16 21:40",c:"Iris's call, Oct 18 02:31, 9 seconds"},options:{luca:"Luca",j:"J.",mara:"Mara",victor:"Victor"},pairs:{a:"luca",b:"j",c:"mara"},hint:"One number is explained in a message; the others are labelled in the call log and audio."},
 {id:"p10",type:"match",ch:6,title:"Follow the account",needs:["B1","W1"],prompt:"Match each account ending to the vendor it belongs to.",items:{a:"Account ending 2290 (the transfers in Q3)",b:"Account ending 1184",c:"Account ending 7761"},options:{ion:"M. Ionescu (freelance)",atl:"Atelier Nord",prt:"Print House"},pairs:{a:"ion",b:"atl",c:"prt"},hint:"The vendor export lists every account ending."},
 {id:"p11",type:"set",ch:6,title:"What changes meaning?",needs:["MV1","D1","A3","W1"],prompt:"Now that you know about the payments and Mara's role, select the earlier items whose meaning changes.",options:{D1:"Deleted: Victor asks what Iris and Mara talk about",A3:"Mara's voice note: 'Did you talk to him?'",E11:"Elena: 'can't decide about Mum's flat without me'",E8:"Adrian: 'Leaving soon. Traffic from the south.'"},answer:["D1","A3"],hint:"Look for the items that involve both Victor and Mara."});
STORY.interviews.luca={name:"Luca Marin",ch:5,need:["L1"],meter:"Guard",labels:["open","wary","guarded","closed"],start:"l0",nodes:{
 l0:{t:"Did you come to accuse me too? Everyone else already has.",o:[["Ask about the messages he sent Iris.","l1"],["Ask where he was that night.","l2"]]},
 l1:{t:"I was angry. I wanted her to listen. I never laid a hand on her.",o:[["Go back.","l0"]]},
 l2:{t:"At the depot. Ten at night to six. Ask anyone.",o:[["Go back.","l0"]]},
 l3:{t:"That's what I told the police. It's true.",o:[["Go back.","l0"]]},
 l4:{t:"You read it. Good. Someone finally did.",trust:-1,o:[["Go back.","l0"]]},
 l5:{t:"A break is a break. It's allowed.",trust:1,o:[["Where did you go on the break?","l6"],["Go back.","l0"]]},
 l6:{t:"No.",set:["luca:refused"],o:[["Go back.","l0"]]},
 l7:{t:"...Fine. I found out Victor was moving money. I wanted her to know before she signed the new loan papers. She wouldn't listen.",trust:-1,set:["luca:warned"],take:"LV1",o:[["Ask again about the break.","l8",0,"luca:warned"],["Go back.","l0"]]},
 l8:{t:"I was meeting someone who knew about the money. I won't give you a name yet.",set:["luca:met_source"],o:[["Go back.","l0"]]},
 pd:{t:"I don't see what that has to do with me.",o:[["Go back.","l0"]]}},
 present:{K3:"l3",L1:"l4",L2:"l5",L3:"l7"}};
STORY.interviews.mara={name:"Mara Ionescu",ch:6,need:["K1","K5"],meter:"Warmth",labels:["guarded","polite","open","open"],start:"m0",nodes:{
 m0:{t:"Anything. I want whoever did this found. Ask me whatever you need.",o:[["Walk me through your night.","m1"],["Who else might have wanted to hurt Iris?","m2"],["Ask about Iris's last messages.","m3"]]},
 m1:{t:"I left around one. Taxi, home, bed. I texted her when I got in.",o:[["Go back.","m0"]]},
 m2:{t:"Luca, honestly. The way he wrote to her. And Adrian was lying about something. I hate saying it.",set:["mara:steers"],o:[["Go back.","m0"]]},
 m3:{t:"She said the lights were off. I wasn't worried.",o:[["Go back.","m0"]]},
 m4:{t:"Atelier never gave us that log. Where did you get it?",trust:-1,set:["mara:slip"],o:[["Go back.","m0"]]},
 m10:{t:"I misremembered the time, that's all. Everyone is confused about that night.",o:[["Go back.","m0"]]},
 m5:{t:"I was there until just after one. Last dance. That fits.",o:[["Go back.","m0"]]},
 m6:{t:"Freelance work for the studio, social strategy. Victor paid me. It's not a secret.",trust:1,o:[["Go back.","m0"]]},
 m7:{t:"I don't know what that number is.",o:[["Go back.","m0"]]},
 m8:{t:"'Him' was Victor. He asked me to tell him how Iris was coping. He said he was worried about her stress. I didn't think it was wrong.",trust:1,take:"MV1",set:["mara:reported"],o:[["Go back.","m0"]]},
 m9:{t:"He asked what we talked about. I told her to ignore him. I didn't want her scared.",o:[["Go back.","m0"]]},
 pd:{t:"I'm not sure how that helps.",o:[["Go back.","m0"]]}},
 present:{K5:"m4",S2:"m5",W1:"m6",B1:"m7",A3:"m8",D1:"m9"},alt:{K5:[["moth:shared","m10"]]}};
// ---- Stage 7: Chapters 7-9, interviews, call details, case file, epilogue ----
STORY.persons.julia="J. Marin";
STORY.chapters.push(
 {id:7,title:"The unknown contact",goal:"Find out who J. is, what connects J. to the others, and who can really account for their night.",done:{ev:["J1","N2","JV1","EV1","G1","R2"],puz:["p12","p13"]}},
 {id:8,title:"The last night",goal:"Rebuild the hours after the party from records alone, and test who could have been where.",done:{ev:["B2","N3","E12","CD1","AC1","SC1"],puz:["p14","p15","p16"]}},
 {id:9,title:"The last archive",goal:"Decide who controlled this investigation, build the case from your own evidence, and face the person it points to.",done:{ev:["AC2","IT1","MO1","MF1"],puz:["p17"]}});
// tag existing messages as collectable evidence (text unchanged)
const _t=(k,i,id)=>{STORY.threads[k].m[i][3]=id};
_t("adrian",1,"IS1");_t("luca",2,"IS2");_t("elena",1,"IS3");_t("mara",1,"MR2");_t("mara",2,"E12");_t("mara",3,"MR1");
Object.assign(STORY.evidence,{
 IS1:["Iris to Adrian, 21:52: 'I'm not mad. I'm tired. Come, be nice.'","Messages",[]],
 IS2:["Iris to Luca, Oct 9: 'Leave me alone, Luca.'","Messages",[]],
 IS3:["Iris to Elena, Oct 17: 'It's not decided. Stop shouting at me over text.'","Messages",[]],
 MR2:["Mara, 01:58: 'Home safe?? you vanished'","Messages",["mara"]],
 E12:["From Iris's phone, 02:03: 'lights are off. don't wait up'","Messages",[]],
 MR1:["Mara, 02:40: 'ok. call me tomorrow, love you'","Messages",["mara"]],
 CD1:["Call detail: Iris's phone to Mara, 02:31, 9 seconds","Phone",[]],
 CD2:["Call detail: 23:58 from Luca's new number, 7 seconds, voicemail","Phone",["luca"]],
 N2:["Contact note: J.'s number ends 602, no name saved","Contacts",[]],
 N3:["Contact note: Mara's number ends 207","Contacts",["mara"]],
 J1:["Staff directory: 'J. Marin, accounts, ext. 602'","Files",["julia"]],
 JV1:["Interview: J. says Luca is her brother and met her 01:10 to about 01:50","Interview",["julia","luca"]],
 EV1:["Interview: Elena admits leaving a strip of her own tablets in the tea box","Interview",["elena"]],
 EV2:["Elena and Mara, Oct 17 21:10: Mara asks where Iris keeps the tea","Interview",["elena","mara"]],
 G1:["Garage log: Victor in 00:58, no exit until 07:40","Files",["victor"]],
 R2:["Hotel key-card log, room 214: entry 00:41, exit 06:10","Files",["adrian"]],
 V2:["Victor to Iris, Oct 17: 'Sign the loan papers Monday'","Messages",["victor"]],
 A4:["Voicemail, 23:58, Luca's new number","Audio",["luca"]],
 A5:["Voice memo auto-saved 01:36 in Iris's apartment","Audio",[]],
 B2:["Building notice: guest number ending 207 admitted to Apt 8 at 01:12","Email",[]],
 AC1:["Account alert: new sign-in from device WS-1124, 03:09 to 03:21","Email",[]],
 AC2:["Account alert: backup shared at 02:09 on Oct 19 from device WS-1124","Email",[]],
 IT1:["Studio asset list: WS-1124 assigned to M. Ionescu (freelance)","Files",["mara"]],
 SC1:["Scene inventory: two mugs (one rinsed), tea box opened, strip with six of ten missing","Files",[]],
 ND1:["Iris's unsent note to M., 01:30","Notes",["mara"]],
 MO1:["MOTH confrontation: MOTH is the person behind WS-1124","Interview",[]],
 MF1:["Interview: Mara's account of the night","Interview",["mara"]]});
Object.assign(STORY.limits,{"MR2|mara":"authored","MR1|mara":"authored","V2|victor":"authored","EV1|elena":"authored","JV1|julia":"authored","ND1|iris":"authored"});
STORY.persons.iris="Iris Vasilescu";
STORY.contacts.find(c=>c.id=="j").note="Number ends 602. No surname saved.";STORY.contacts.find(c=>c.id=="j").ev="N2";
STORY.contacts.find(c=>c.id=="mara").note="Number ends 207.";STORY.contacts.find(c=>c.id=="mara").ev="N3";
STORY.threads.victor={name:"Victor",sub:"business partner",ch:7,m:[["them","Oct 17 · 17:55","Sign the loan papers Monday. Don't make this harder than it is.","V2"],["me","Oct 17 · 18:02","Not until I see the Q3 transfers."],["them","Oct 17 · 18:03","We'll talk tonight."]]};
STORY.threads.julia={name:"J.",sub:"no surname saved",ch:7,m:[["them","Oct 16 · 22:20","Did you read it?"],["me","Oct 16 · 22:31","Yes. I won't use your name. Thank you."],["them","Oct 16 · 22:32","Delete this chat."]]};
STORY.links.push(
 ["E12","IS1","contradicts","plausible","The 02:03 message is lowercase while Iris's other messages are capitalised and punctuated. Style alone cannot show who wrote it."],
 ["E12","MR1","relates","plausible","The 02:03 message and Mara's 02:40 reply share the same lowercase habit. A shared habit is weak evidence."],
 ["CD1","MR1","contradicts","plausible","Mara's 02:40 text says 'call me tomorrow' nine minutes after a call from Iris's phone to hers. She may simply not have picked up."],
 ["CD1","K1","contradicts","plausible","Mara's statement lists texts at 01:58 and 02:40 but not the 02:31 call."],
 ["B2","N3","relates","plausible","The guest number ends 207, like Mara's. Only three digits are shown, so this fits but does not prove it."],
 ["B2","K1","contradicts","plausible","Mara says she left about 01:00 and was home by 01:20. A guest number ending 207 was admitted to Iris's building at 01:12."],
 ["SC1","B2","relates","plausible","Two mugs and a guest admitted at 01:12 fit together: a second person was likely in the kitchen. Neither says who."],
 ["SC1","EV1","relates","plausible","Elena says she left a strip of her tablets in the tea box; the inventory lists an opened box and a strip with six missing. It does not say who removed them."],
 ["AC1","H2","relates","proved","H2 was modified at 03:12, inside the unfamiliar sign-in session (03:09 to 03:21)."],
 ["AC2","AC1","relates","proved","Both alerts name the same device, WS-1124."],
 ["IT1","AC1","relates","proved","WS-1124 is assigned to M. Ionescu (freelance). That shows whose machine it is, not who was sitting at it."],
 ["A5","A3","relates","plausible","The woman in the memo opens with the same 'Hey.' and uses 'love' as Mara does in her voice note. Speech habits are suggestive, not conclusive."],
 ["J1","N2","relates","proved","The staff directory lists 'J. Marin' with extension 602; Iris's contact J. has a number ending 602."],
 ["J1","K3","relates","plausible","J. Marin and Luca Marin share a surname. That fits a family link but does not prove one."],
 ["EV2","D3","relates","proved","Mara asked about the tea the evening before the party, after Elena's email. This shows Mara knew about the tea, not why she asked."],
 ["G1","K2","relates","proved","The garage log supports Victor's account that he went home after the party."],
 ["R2","E3","relates","plausible","The key-card log puts Adrian in room 214 from 00:41, which fits the man in the corridor photo at 00:52. The photo does not show a face."],
 ["JV1","L2","relates","plausible","J., his sister, says Luca was with her from about 01:10 during his break (00:50 to 01:55). It is a relative's statement, so it explains the break without independently proving it."]);
STORY.mails.push(
 {id:"m6",box:"Archived",from:"Teilor 8 building",to:"Iris",ts:"Oct 18 · 01:12",sub:"Visitor admitted",body:"Guest access was granted at 01:12 to a visitor whose number ends 207 for Apt 8. If this was not you, contact building management.",ev:"B2",ch:8},
 {id:"m7",box:"Inbox",from:"Cloud account",to:"Iris",ts:"Oct 18 · 03:09",sub:"New sign-in",body:"A new device (WS-1124) signed in to your account from Vespera at 03:09 and was active until 03:21. If this wasn't you, change your password.",ev:"AC1",ch:8},
 {id:"m8",box:"Inbox",from:"Cloud account",to:"Iris",ts:"Oct 19 · 02:09",sub:"Backup shared",body:"Your account backup was shared by device WS-1124 at 02:09.",ev:"AC2",ch:9});
STORY.files.push(
 {id:"f9",n:"garage_log.pdf",ev:"G1",ch:7,lines:["RESIDENCE GARAGE, Victor Neagu","Oct 18 00:58 entry","No exit recorded until 07:40"]},
 {id:"f10",n:"hotel_keycard_log.pdf",ev:"R2",ch:7,lines:["HOTEL AURELIA, room 214","Oct 18 00:41 card entry","Oct 18 06:10 card exit","Booked under A. Popescu"]},
 {id:"f11",n:"staff_directory.pdf",ev:"J1",ch:7,lines:["STUDIO STAFF DIRECTORY","Accounts: J. Marin, ext. 602","Creative: I. Vasilescu","Partner: V. Neagu"]},
 {id:"f12",n:"scene_inventory.pdf",ev:"SC1",ch:8,lines:["APT 8 INVENTORY (Oct 18)","Kitchen: two mugs in sink, one rinsed","Tea box opened; blister strip, 6 of 10 missing","No forced entry","Found on sofa 07:40 by a neighbour","Estimated time window: 01:30 to 03:00"]},
 {id:"f13",n:"it_assets.csv",ev:"IT1",ch:9,lines:["device,assigned to","WS-1120,V. Neagu","WS-1124,M. Ionescu (freelance)","WS-1130,I. Vasilescu"]});
STORY.audio.push(
 {id:"a4",n:"Voicemail",ts:"Oct 17 · 23:58",src:"From Luca's new number (7 seconds)",lines:[["Luca","Iris, it's me. Don't sign anything tonight."]],ev:"A4",ch:7},
 {id:"a5",n:"Voice memo (auto-saved)",ts:"Oct 18 · 01:36",src:"Iris's phone, at the apartment",lines:[["Music","(kettle, a spoon on a cup)"],["Woman","Hey. Drink it, love. It'll help you sleep."],["Iris","I can't believe he was there. I trusted him."],["Woman","I know. Drink."]],ev:"A5",ch:8,need:"unlock:memo"});
STORY.calls=[["in","J.","Oct 16 · 21:40","missed","a2"],["out","Mara","Oct 17 · 18:05","6:12"],["in","Unknown +40 7xx xxx 019","Oct 17 · 23:58","0:07","a4"],["out","Mara","Oct 18 · 02:31","0:09"]];
STORY.callNotes={3:["CD1","Placed from Iris's phone. Ended by the other side after 9 seconds."],2:["CD2","Rang for 7 seconds, then went to voicemail."]};
STORY.notes.push(["draft","(unsent) M. — I know you weren't telling me everything about V. I'm not angry. I'm going to the auditors Monday. Please come with me.","ND1",9]);
STORY.decisions.push(
 {id:"d2",ch:7,prompt:"Elena begs you not to put the tablets in anything official. Do you promise?",opts:[["Promise to leave it out","elena:protected"],["Say you can't promise","elena:exposed"]]},
 {id:"d3",ch:9,prompt:"You have your case. Who hears it first?",opts:[["The police, with everything","end:police"],["Elena, before anyone else","end:elena"],["Mara, to give her the chance to speak first","end:mara"]]});
STORY.puzzles.push(
 {id:"p12",type:"set",ch:7,title:"Who is J.?",needs:["N2","J1","A2","E7","K3"],prompt:"Select the records that together identify who J. is. Ignore the ones that only say J. exists.",options:{N2:"Contact note: number ends 602",J1:"Staff directory: J. Marin, ext. 602",A2:"Voicemail: 'it's J.'",E7:"Email: 'I'm not putting my name on this'",K3:"Luca's statement"},answer:["N2","J1"],hint:"An identification needs a link between a number or name in the phone and a name somewhere else."},
 {id:"p13",type:"match",ch:7,title:"Voices",needs:["A1","A2","A3","A4","J1"],prompt:"Match each recording to its speaker.",items:{a:"Voice memo at the party (the man)",b:"Voicemail, Oct 16",c:"Voicemail, 23:58",d:"Voice note, Oct 17 18:30"},options:{victor:"Victor",julia:"J. Marin",luca:"Luca",mara:"Mara"},pairs:{a:"victor",b:"julia",c:"luca",d:"mara"},hint:"Some speakers name themselves; for the others, check who is spoken to or who is labelled."},
 {id:"p14",type:"set",ch:8,title:"Whose typing is that?",needs:["E12","IS1","IS2","MR1","MR2"],prompt:"Select the messages whose typing habits resemble the 02:03 message (lowercase start, no capitals).",options:{IS1:"Iris, 21:52",IS2:"Iris, Oct 9",MR1:"Mara, 02:40",MR2:"Mara, 01:58"},answer:["MR1"],hint:"Look at how each message begins and ends, not at what it says."},
 {id:"p15",type:"order",ch:8,title:"Rebuild the night",needs:["K5","M1","D2","B2","E12","CD1","AC1","H2"],prompt:"Put these events in order.",unlocks:"unlock:memo",items:{a:["Coat ticket redeemed","2026-10-18T00:22"],b:["Phone at the hotel","2026-10-18T00:49"],c:["Post removed","2026-10-18T00:58"],d:["Guest admitted to Apt 8","2026-10-18T01:12"],e:["Message from Iris's phone","2026-10-18T02:03"],f:["Call from Iris's phone","2026-10-18T02:31"],g:["Unfamiliar sign-in begins","2026-10-18T03:09"],h:["Photo modified","2026-10-18T03:12"]},hint:"Each item has an exact time in the email, call, message or metadata it comes from."},
 {id:"p16",type:"set",ch:8,title:"Who has an alibi?",needs:["G1","R2","JV1","L2"],prompt:"Select everyone whose whereabouts for the whole of 01:12 to 02:31 are covered by a record that is not their own word or a relative's.",options:{victor:"Victor",adrian:"Adrian",luca:"Luca",elena:"Elena",mara:"Mara"},answer:["victor","adrian"],hint:"Check what each record actually covers, minute by minute. A record that covers only part of the interval, or a statement from family, does not cover all of it."},
 {id:"p17",type:"case",ch:9,title:"Build the case",needs:["B2","E12","SC1","AC1","H2","AC2","IT1"],prompt:"Fill each part of the case with evidence you hold. Each part needs the right kinds of support.",
  slots:[
   {id:"who",label:"Who",answer:"mara",options:{mara:"Mara",victor:"Victor",adrian:"Adrian",luca:"Luca",elena:"Elena",julia:"J. Marin"}},
   {id:"opp",label:"Someone else was in the apartment",pick:1,need:[["B2"],["SC1","N3"]],bad:["E3","L2","K3","E2","E8"]},
   {id:"means",label:"How Iris was incapacitated",pick:1,need:[["SC1"],["D3","H1","EV1"]],bad:["E3","L2","K3","E2","E8"]},
   {id:"cover",label:"Iris's phone was used when she could not use it",pick:1,need:[["E12"],["IS1","IS2","IS3"],["CD1","AC1"]],bad:["E3","K3","E2","E8"]},
   {id:"manip",label:"Her records were altered afterwards",pick:1,need:[["AC1"],["H2"]],bad:["E3","L2","K3","E2","E8"]},
   {id:"ctrl",label:"Who controlled the account and this investigation",pick:1,need:[["AC2"],["IT1"]],bad:["E3","L2","K3","E2","E8"]}],
  hint:"Every part rests on something you have saved. Wrong items count against a part even if they feel suspicious."});
STORY.interviews.julia={name:"J. Marin",ch:7,need:["J1"],meter:"Fear",labels:["steady","uneasy","afraid","terrified"],start:"j0",nodes:{
 j0:{t:"I shouldn't be talking to you. If he finds out, I lose my job. Maybe worse.",o:[["Ask about the transfers.","j1"],["Ask about that night.","j2"]]},
 j1:{t:"I found three payments with no invoices. I told Iris because she was the only one who'd read it.",o:[["Go back.","j0"]]},
 j2:{t:"I was home most of the night. I'd rather not say more.",o:[["Go back.","j0"]]},
 j3:{t:"Yes. That's me. I work in accounts.",trust:1,o:[["Go back.","j0"]]},
 j4:{t:"I wrote that email. I didn't sign it because I was scared.",o:[["Go back.","j0"]]},
 j5:{t:"I told her to call from another phone. The office wifi is watched.",o:[["Go back.","j0"]]},
 j6:{t:"...Luca is my brother. He used his break to meet me behind the depot at about ten past one. I gave him a copy of the transfers. We were there until nearly two.",trust:-1,take:"JV1",set:["julia:brother"],o:[["Go back.","j0"]]},
 pd:{t:"I don't know anything about that.",o:[["Go back.","j0"]]}},
 present:{J1:"j3",E7:"j4",A2:"j5",L2:"j6"}};
STORY.interviews.elena={name:"Elena Vasilescu",ch:7,need:["E11","D3"],meter:"Guilt",labels:["composed","tense","shaken","breaking"],start:"e0",nodes:{
 e0:{t:"I told the police. I was home. I wasn't at the party.",o:[["Ask about the argument.","e1"],["Ask about the tea.","e2"]]},
 e1:{t:"Iris wanted to sell our mother's flat to keep the studio afloat. I said no. We shouted. That's all it was.",o:[["Go back.","e0"]]},
 e2:{t:"I just wanted her to sleep. She never sleeps.",o:[["Go back.","e0"]]},
 e3:{t:"The flat. She wanted the money. I told her she was being used.",trust:1,o:[["Go back.","e0"]]},
 e4:{t:"I left tea... and a strip of my own sleeping tablets in the box, for emergencies. I never told anyone. It would look terrible.",trust:1,take:"EV1",set:["elena:pills"],o:[["Ask if anyone else knew about the tea.","e7",0,"elena:protected"],["Go back.","e0"]]},
 e5:{t:"That's the box. Still sealed at twenty to nine. She hadn't touched it.",o:[["Go back.","e0"]]},
 e6:{t:"I wasn't there. I was home. Nobody saw me, I know how that sounds.",o:[["Go back.","e0"]]},
 e7:{t:"Mara asked me where Iris kept the tea. The night before. I thought she was being kind. I showed her the message... here.",trust:1,take:"EV2",o:[["Go back.","e0"]]},
 pd:{t:"I'm not sure that matters.",o:[["Go back.","e0"]]}},
 present:{E11:"e3",D3:"e4",H1:"e5",K4:"e6"},alt:{}};
STORY.interviews.elena.present.IS3="pd";
STORY.interviews.moth={name:"MOTH",ch:9,need:["AC2","IT1"],meter:"Guard",labels:["open","wary","guarded","closed"],start:"o0",nodes:{
 o0:{t:"You found me faster than I expected. What do you want to know?",o:[["Who are you?","o1"],["Why send me the archive?","o2"]]},
 o1:{t:"Someone who wants justice.",o:[["Go back.","o0"]]},
 o2:{t:"Because someone had to read it properly.",o:[["Go back.","o0"]]},
 o3:{t:"A shared backup. Anyone could have done that.",trust:1,set:["moth:acc2"],o:[["Go back.","o0"]]},
 o4:{t:"A laptop is a laptop.",o:[["Go back.","o0"]]},
 o5:{t:"...I wanted you to find it. Just not this fast. Hello. You were meant to follow the wrong person.",take:"MO1",set:["moth:unmasked"],o:[["Go back.","o0"]]},
 pd:{t:"That tells me nothing.",o:[["Go back.","o0"]]}},
 present:{AC2:"o3",IT1:"o4"},alt:{IT1:[["moth:acc2","o5"]]}};
// Mara: new reactions once the night has been reconstructed
Object.assign(STORY.interviews.mara.nodes,{
 m11:{t:"I went to check on her. She was fine when I left. Before two.",set:["mara:visit"],o:[["Go back.","m0"]]},
 m12:{t:"Two mugs? She had visitors. Not me.",o:[["Go back.","m0"]]},
 m13:{t:"That could be anyone's kitchen. Anyone's voice.",o:[["Go back.","m0"]]},
 m14:{t:"She called me and I didn't answer. I don't remember. It was a mess.",o:[["Go back.","m0"]]},
 m15:{t:"She texted me. That's what the phone says.",o:[["Go back.","m0"]]},
 m16:{t:"I only wanted her to sleep, to miss the auditors on Monday. I put what was left of the strip in her tea. She drank it and then she wouldn't wake. I was so frightened. So I made it look as if she was alive, and I made sure it wasn't me. I wrote to you from her account because I needed you to look anywhere else.",take:"MF1",set:["mara:confessed"],o:[["Go back.","m0"]]},
 m17:{t:"That's private. Where did you get that?",o:[["Go back.","m0"]]},
 m18:{t:"She wasn't angry. She still asked me to come with her. I couldn't.",o:[["Go back.","m0"]]}});
Object.assign(STORY.interviews.mara.present,{B2:"m11",SC1:"m12",A5:"m13",CD1:"m14",E12:"m15",ND1:"m17",MO1:"m17"});
STORY.interviews.mara.alt.A5=[["moth:unmasked","m16"]];STORY.interviews.mara.alt.ND1=[["mara:confessed","m18"],["moth:unmasked","m16"]];
STORY.epilogue=[
 {t:"Mara was arrested two days later. She gave a full statement before her lawyer arrived."},
 {t:"Victor was charged with fraud and unlawful surveillance. The company was dissolved."},
 {t:"Adrian told his family the truth himself. Some of them did not forgive him."},
 {t:"Luca and his sister gave their evidence together. They have not spoken to the company since."},
 {t:"Elena kept the unopened box of tea. She asked that it be thrown away with her own.",if:"elena:protected"},
 {t:"Elena's tablets were named in the report. She stood by it. 'I should have told them at the start,' she said.",if:"elena:exposed"},
 {t:"You gave the case to the police. It was thorough, and it held.",if:"end:police"},
 {t:"You told Elena first. She sat very still, and then asked to see the note Iris never sent.",if:"end:elena"},
 {t:"You offered Mara the first word. She used it to say Iris's name, and nothing else, for a long time.",if:"end:mara"},
 {t:"Iris's last message to Mara was never sent. It was found in the archive, exactly where she left it."}];
