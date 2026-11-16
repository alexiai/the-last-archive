// Stage 8 content: more conversations, photographs and optional evidence. Loaded after story.js. Data only.
// Message tuple: [sender ("me", "them", or a name in group chats), time, text, evidenceId?, minChapter?, requiredFlag?]
Object.assign(STORY.threads,{
 studio:{name:"Studio team",sub:"group, 5 members",ch:2,m:[
  ["Victor","Oct 14 · 09:41","Venue is confirmed for the 17th. Nine on the list, no plus-ones."],
  ["Mara","Oct 14 · 09:55","I'll do the playlist. Iris, send me your no-go songs."],
  ["me","Oct 14 · 10:02","No-go songs: anything with a saxophone solo."],
  ["Teo","Oct 14 · 10:10","I'll bring the projector. Please nobody touch the cables."],
  ["Victor","Oct 14 · 10:31","Iris, we'll go through the numbers after the party. Not before.","ST1"]]},
 venue:{name:"Atelier Nord",sub:"venue manager",ch:3,m:[
  ["them","Oct 16 · 11:02","Hi Iris, Dana from Atelier Nord. Coat check opens at 23:00 and closes at 00:30. Last orders at 01:00, we close at 02:00.","VN1"],
  ["me","Oct 16 · 11:10","Perfect. Nine guests, a couple may arrive late."],
  ["them","Oct 16 · 11:12","Noted. Our photographer will shoot the main table around 23:20, if that works."],
  ["me","Oct 16 · 11:15","Yes, thank you."]]},
 aunt:{name:"Aunt Rodica",sub:"family",ch:2,m:[
  ["them","Oct 16 · 20:12","Elena called me again, sweetheart. She says you want to sell the flat."],
  ["me","Oct 16 · 20:30","I want to keep the studio alive. The flat is the only way. I haven't decided."],
  ["them","Oct 16 · 20:34","Your mother would want you two to talk, not shout. Come on Sunday."],
  ["me","Oct 16 · 20:40","I'll try. I'm not sleeping well and everything is on top of me.","AN1"]]},
 clinic:{name:"Sleep Clinic Vespera",sub:"appointments",ch:3,m:[
  ["them","Oct 15 · 08:00","Your appointment is confirmed for Oct 22 at 14:00. Please bring your sleep diary.","CL1"],
  ["me","Oct 15 · 08:20","Thank you. Is there anything earlier?"],
  ["them","Oct 15 · 08:25","The earliest slot is Oct 22. If you feel unwell before then, please call your GP."]]},
 auditor:{name:"Costin & Partners",sub:"auditors",ch:3,m:[
  ["them","Oct 13 · 15:20","Ms. Vasilescu, confirming our meeting on Monday Oct 20 at 09:00. Please bring the Q3 transfer records you mentioned.","AU1"],
  ["me","Oct 13 · 15:41","I will. I'd rather this stays between us until then."],
  ["them","Oct 13 · 15:44","Understood. Confidential until you authorise otherwise."]]},
 bank:{name:"Vespera Credit",sub:"business banking",ch:3,m:[
  ["them","Oct 16 · 10:03","The credit line agreement for Studio V&N is ready for co-signature. Appointment: Monday at 11:00, branch Unirii."],
  ["me","Oct 16 · 10:30","I won't sign before I've seen the Q3 transfers."],
  ["them","Oct 16 · 10:34","Both partners must sign for the facility to be released. Mr. Neagu has already signed.","BK1"]]},
 sisters:{name:"Sisters & M.",sub:"group: Elena, Mara",ch:2,m:[
  ["Elena","Oct 12 · 18:10","I found the sleep tea you liked. Buying three boxes."],
  ["Mara","Oct 12 · 18:14","Buy four. She never sleeps.","TA1"],
  ["me","Oct 12 · 18:20","Stop mothering me, both of you."],
  ["Mara","Oct 12 · 18:21","Never. ❤"]]},
 tudor:{name:"Tudor",sub:"Adrian's friend",ch:3,m:[
  ["them","Oct 12 · 22:05","Hey Iris. Adrian asked me to say he was at mine on the 11th. I don't love it.","TU1"],
  ["me","Oct 12 · 22:20","What happened on the 11th?"],
  ["them","Oct 12 · 22:21","Ask him. I'm not in the middle of this. Sorry."]]},
 luca_old:{name:"Luca (old number)",sub:"recovered conversation",ch:4,need:"unlock:vault",m:[
  ["them","Aug 28 · 22:10","I'm sorry I shouted yesterday. It's not you. It's V. and his promises."],
  ["me","Aug 28 · 22:30","Luca, he's my partner. I can't just walk away."],
  ["them","Aug 29 · 07:14","Then keep a copy of everything. Please.","LD1"]]},
 victor_old:{name:"Victor (deleted)",sub:"recovered conversation",ch:4,need:"unlock:vault",m:[
  ["them","Oct 6 · 17:05","We keep freelancers off the quarterly summary. Standard."],
  ["me","Oct 6 · 17:12","Standard for whom? I've never seen the freelance ledger."],
  ["them","Oct 6 · 17:14","Because it's boring. Leave it with me.","VD1"]]},
 neighbour:{name:"Mrs. Dobre",sub:"neighbour, Apt 7",ch:3,m:[
  ["them","Oct 17 · 19:30","Iris dear, could you keep the music down tonight? I go to bed early. Thank you."],
  ["me","Oct 17 · 19:41","Of course, I'm going out tonight anyway."],
  ["them","Oct 18 · 07:12","Iris? Your door isn't closed properly. Are you alright?","NB1",8]]},
 printhouse:{name:"Print House",sub:"supplier",ch:5,m:[
  ["them","Oct 9 · 10:15","Invoice 2291 for the invitation cards. Account on the invoice ends 7761.","PR1"],
  ["me","Oct 9 · 10:40","Received, paid today."]]},
 bianca:{name:"Bianca",sub:"friend",ch:3,m:[
  ["them","Oct 15 · 21:10","How are you holding up with the numbers thing?"],
  ["me","Oct 15 · 21:25","I think V. is hiding something. M. says I'm being paranoid.","BI1"],
  ["them","Oct 15 · 21:27","M. has known you forever. Maybe listen? Or get the auditors in anyway."],
  ["me","Oct 15 · 21:30","That's the plan. Monday the 20th."]]},
 photographer:{name:"Silviu",sub:"event photographer",ch:4,m:[
  ["them","Oct 18 · 10:02","Hi Iris, Silviu here. The gallery from last night is ready, 214 frames. I stopped shooting around 00:40."],
  ["them","Oct 18 · 10:04","The main table group shot is at 23:20. The grey jacket on the chair is in every frame of that sequence, just so you know.","PH1"]]},
 building:{name:"Teilor 8 management",sub:"building",ch:5,m:[
  ["them","Sep 30 · 12:00","Reminder: guests must be registered in the building app by phone number. The number is logged for 24 hours.","BM1"],
  ["me","Sep 30 · 12:08","Understood."]]},
 rideapp:{name:"RideNow",sub:"ride receipts",ch:3,m:[
  ["them","Oct 17 · 22:41","Your ride to Atelier Nord is arriving. Driver: Cosmin."],
  ["them","Oct 18 · 00:37","Trip receipt: Atelier Nord to Hotel Aurelia, 12 min, 31 lei.","RD1"],
  ["them","Oct 18 · 01:02","Your ride from Hotel Aurelia to Str. Teilor 8 is arriving."],
  ["them","Oct 18 · 01:09","Trip receipt: Hotel Aurelia to Str. Teilor 8, 7 min, 24 lei."]]},
 notary:{name:"Notary Stan",sub:"the flat",ch:5,m:[
  ["them","Oct 14 · 14:00","Ms. Vasilescu, the sale of your mother's flat requires both heirs' signatures. Your sister has not responded.","NT1"],
  ["me","Oct 14 · 14:30","I know. We are talking."],
  ["them","Oct 14 · 14:32","No hurry, but the buyer's offer expires on the 31st."]]}});
Object.assign(STORY.evidence,{
 ST1:["Victor in the studio group, Oct 14: 'numbers after the party. Not before.'","Messages",["victor"]],
 VN1:["Venue: coat check closes 00:30; photographer shoots the main table at 23:20","Messages",[]],
 AN1:["Iris to her aunt: 'I'm not sleeping well'","Messages",[]],
 CL1:["Sleep clinic appointment confirmed for Oct 22","Messages",[]],
 AU1:["Auditors: meeting Monday Oct 20, 09:00, bring the Q3 transfer records","Messages",[]],
 BK1:["Bank: Victor has signed; Iris's co-signature wanted Monday 11:00","Messages",["victor"]],
 TA1:["Group chat Oct 12: Elena buys sleep tea; Mara: 'Buy four. She never sleeps.'","Messages",["elena","mara"]],
 TU1:["Tudor: Adrian asked him to say he was at his place on the 11th","Messages",["adrian"]],
 LD1:["Luca, Aug 29: 'keep a copy of everything'","Messages",["luca"]],
 VD1:["Victor (recovered): 'We keep freelancers off the quarterly summary'","Messages",["victor"]],
 NB1:["Neighbour, Oct 18 07:12: 'Your door isn't closed properly'","Messages",[]],
 PR1:["Print House invoice: account ends 7761","Messages",[]],
 BI1:["Iris to Bianca: 'M. says I'm being paranoid'","Messages",["mara"]],
 PH1:["Photographer: the grey jacket is in every frame of the 23:20 sequence","Messages",[]],
 BM1:["Building rule: guests registered by phone number, logged for 24 hours","Messages",[]],
 RD1:["Ride receipts: venue to hotel 00:37; hotel to apartment 01:09","Messages",[]],
 NT1:["Notary: selling the flat needs both heirs' signatures","Messages",["elena"]]});
STORY.links.push(
 ["ST1","E6","relates","plausible","Victor wants the numbers kept for after the party in the group chat and 'in person' in his email. Both delay the question; neither says why."],
 ["VN1","K5","relates","plausible","The coat check closes at 00:30 and the ticket was redeemed at 00:22, near the end of the window. That fits, but it does not say who redeemed it."],
 ["VN1","E4","relates","proved","The venue arranged for the main table to be photographed around 23:20, which matches the time of the table photo."],
 ["AN1","D3","relates","plausible","Iris tells her aunt she is not sleeping, which fits Elena's sleep tea. It says nothing about the tea box's contents."],
 ["AU1","V2","relates","plausible","Iris planned to meet the auditors on Monday morning; Victor wanted her to sign loan papers on Monday. Same day, opposite aims."],
 ["AU1","E7","relates","plausible","The auditors asked for the Q3 transfer records, the same transfers J. described in the email."],
 ["BK1","V2","relates","proved","The bank confirms Victor has already signed and that Iris's signature is wanted on Monday, matching his message about the loan papers."],
 ["BK1","AU1","relates","plausible","The auditor meeting (09:00) is two hours before the signature appointment (11:00): Iris planned to see them first."],
 ["TA1","D3","relates","plausible","Both Elena and Mara knew about the sleep tea by Oct 12. That is general knowledge among friends and says nothing about intent."],
 ["TA1","EV2","relates","plausible","Mara knew about the tea on Oct 12 and asked where it was kept on Oct 17. Curiosity is possible; so is planning."],
 ["TU1","F1","relates","plausible","Tudor says Adrian asked for cover about the 11th; the hotel receipt is dated Oct 11. Together they suggest Adrian had something to hide that day."],
 ["LD1","LV1","relates","plausible","Luca told Iris in August to keep copies of everything, which fits his later account of warning her."],
 ["VD1","W1","relates","plausible","Victor kept freelancers off the quarterly summary, and the vendor export lists a freelancer paid from the studio. The link is suggestive, not proof."],
 ["NB1","SC1","relates","plausible","The neighbour found the door not properly closed at 07:12, consistent with a no-forced-entry inventory and someone leaving without checking."],
 ["PR1","W1","relates","proved","The Print House invoice ends 7761, matching the Print House entry in the vendor export."],
 ["BI1","MV1","relates","plausible","Iris told a friend that Mara called her paranoid about Victor. Mara later says she was reporting to Victor. The words were Iris's report of them."],
 ["PH1","E4","relates","proved","The photographer places the grey jacket on the chair in every frame of the 23:20 sequence, matching the original table photo."],
 ["PH1","H2","contradicts","plausible","The photographer says the jacket is in every frame of the sequence; the copy shows the chair without it. His account is about his frames, not Iris's copy."],
 ["BM1","B2","relates","proved","The building logs guests by phone number, which explains why the visitor notice shows a number ending 207."],
 ["RD1","M1","relates","proved","The receipt for the trip to Hotel Aurelia (00:37) fits the phone ping at the hotel at 00:49."],
 ["RD1","K1","contradicts","proved","Mara says Iris left with Victor around 00:45, but Iris's ride receipt shows she had already reached the hotel at 00:37."],
 ["RD1","B2","relates","plausible","Iris reached the apartment at 01:09, three minutes before a guest was admitted. Both fit a short gap; neither says who came."],
 ["NT1","E11","relates","proved","The notary confirms both heirs must sign, which is why Elena's refusal mattered in the argument."]);
STORY.optional=["ST1","VN1","AN1","CL1","AU1","BK1","TA1","TU1","LD1","VD1","NB1","PR1","BI1","PH1","BM1","RD1","NT1"];
// Photographs: new records. alt text describes the intended image; metadata is rendered by the game, never baked into the image.
const P=(id,t,ts,place,alt,c,ch)=>({id,t,ts,alt,ch,c,optional:true,meta:`File: IMG_${4400+Number(id.slice(1))}.HEIC\nTaken: ${ts}\nPlace: ${place}\nDevice: Iris's phone`,art:""});
STORY.photos.forEach(p=>{p.alt=p.alt||({E3:"A narrow hotel corridor at night, a man in a grey jacket seen from behind",E4:"A party table with glasses and a grey jacket over a chair",H1:"A kitchen counter with a tea box and one glass",H2:"The same party table, the chair now without the jacket",T1:"A hand holding a numbered cloakroom ticket"})[p.id]||p.t});
STORY.photos.push(
 P("P01","Living room","Oct 16 · 19:12","Str. Teilor 8","A quiet living room in evening light, a sofa and a floor lamp","#33302d",1),
 P("P02","Studio desk","Oct 15 · 09:30","Studio, Bd. Unirii 40","A cluttered desk with a laptop, a notebook and a half-finished coffee","#2f3234",1),
 P("P03","Kitchen window","Oct 15 · 07:40","Str. Teilor 8","Morning light through a kitchen window over rooftops","#34373a",1),
 P("P04","Dinner","Aug 30 · 21:05","Restaurant, Vespera","Two glasses and a candle on a restaurant table, a man's hand at the edge of frame","#352f2d",2),
 P("P05","Flat hallway","Sep 20 · 15:30","Family flat","An old apartment hallway with a coat stand and worn floor tiles","#363330",2),
 P("P06","Selfie","Sep 2 · 17:48","Park, Vespera","Two women laughing in a park, autumn light","#323632",2),
 P("P14","Studio team","Oct 3 · 18:20","Studio, Bd. Unirii 40","Five colleagues around a studio table, seen from across the room","#31302f",2),
 P("P15","Wrapped gift","Oct 16 · 16:10","Str. Teilor 8","A small wrapped gift with plain string on a wooden table","#37332f",2),
 P("P07","Venue entrance","Oct 17 · 23:03","Atelier Nord","The lit entrance of a converted industrial venue at night","#2d3033",3),
 P("P08","Bar","Oct 17 · 23:12","Atelier Nord","A dim bar with bottles and warm lights, a few guests blurred","#332f2e",3),
 P("P09","Dance floor","Oct 17 · 23:47","Atelier Nord","A crowded dance floor, motion-blurred figures under low light","#2c2e32",3),
 P("P10","Hotel exterior","Oct 18 · 00:47","Hotel Aurelia","A hotel front at night, a single lit sign and wet pavement","#2d3032",3),
 P("P11","Hotel lobby","Oct 18 · 00:50","Hotel Aurelia","A small hotel lobby, an empty reception desk under a lamp","#33302c",3),
 P("P12","Hotel street","Oct 18 · 00:56","Str. Lunii","A quiet side street at night with parked cars and one passing taxi","#2b2e31",3),
 P("P16","Sofa and lamp","Oct 17 · 20:15","Str. Teilor 8","A sofa with a folded blanket and a lit lamp, evening","#35322e",1),
 P("P17","Bookshelf","Oct 12 · 12:05","Str. Teilor 8","A full bookshelf with a few objects and a small plant","#32312e",1),
 P("P18","Balcony","Oct 14 · 08:10","Str. Teilor 8","A narrow balcony with potted plants in morning light","#2f3430",1),
 P("P13","Building entrance","Oct 18 · 01:10","Str. Teilor 8","A residential building entrance at night, the door lit by the intercom panel","#2e3033",4));
