/* Authored runtime case. Private architecture and renderer sources are never included in builds. */
export const CONTENT = {
  "case": {
    "id": "0416",
    "title": "The Last Archive",
    "edition": "casework-1",
    "detective": "Detective Dima",
    "date": "19 October 2025",
    "address": "8 Teilor Street",
    "victim": "Iris Vasilescu"
  },
  "intro": [
    {
      "eyebrow": "MAJOR CRIME / SUNDAY 19 OCTOBER",
      "title": "Detective Dima.",
      "text": "You have been assigned the death of Iris Vasilescu. She was thirty-four. Yesterday morning, someone found her in the living room of her apartment. The first report cannot explain the injury as a simple fall.",
      "image": "opening-night",
      "audio": "briefing"
    },
    {
      "eyebrow": "THE PERSON BEFORE THE CASE",
      "title": "Iris Vasilescu.",
      "text": "Sound archivist. Sister. Friend. A woman who kept a cracked mug because someone she loved had fixed it. Her family knows you are here. They do not yet know what you will find.",
      "portrait": "iris"
    },
    {
      "eyebrow": "YOUR FIRST OBJECTIVE",
      "title": "Start with the room.",
      "text": "The body has been removed. The room has not been put back in order. Inspect the living room and recover the phone from the side table. Record what is there before deciding what it means.",
      "image": "scene-wide"
    }
  ],
  "sources": {
    "brief": {
      "id": "brief",
      "kind": "report",
      "title": "Initial assignment",
      "chapter": 1,
      "text": "Major Crime / Detective Dima / Sunday 19 October 2025\nIris Vasilescu, 34, was found dead at 8 Teilor Street yesterday morning. An unexplained head injury requires a homicide investigation. The living room has been photographed and the body removed. The cause and sequence remain under examination.\nFirst objective: inspect the living room and recover the victim’s phone. Record what the sources show before deciding what they mean.",
      "meta": "Known facts only / intake 09:24",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "scene-wide": {
      "id": "scene-wide",
      "kind": "photo",
      "title": "Living room / scene view 01",
      "chapter": 1,
      "text": "",
      "meta": "19 October / after removal / 8 Teilor Street",
      "image": "scene-wide",
      "choices": {
        "east": "The sofa runs along the right side of the room, facing the window.",
        "north": "The sofa runs across the back of the room, below the shelf.",
        "uncertain": "I cannot yet establish its orientation."
      },
      "need": null,
      "sound": null,
      "visual": "The window is on the left and the shelves are at the back. The sofa runs down the right side; its seating faces the window."
    },
    "scene-table": {
      "id": "scene-table",
      "kind": "photo",
      "title": "Table / scene detail 02",
      "chapter": 1,
      "text": "",
      "meta": "Same living room / table detail",
      "image": "scene-table",
      "choices": {
        "ring": "There is a dry ring beside the glass.",
        "wet": "The whole table is freshly wet.",
        "none": "No surface trace is visible."
      },
      "need": null,
      "sound": null,
      "visual": "A glass stands near the right side of the table. A dry circular ring lies separately beside its base."
    },
    "scene-shelf": {
      "id": "scene-shelf",
      "kind": "photo",
      "title": "Shelf / scene detail 03",
      "chapter": 1,
      "text": "",
      "meta": "Same living room / lower shelf",
      "image": "scene-shelf",
      "choices": {
        "gap": "A clear gap interrupts the lower shelf.",
        "broken": "The lower shelf has broken.",
        "full": "The shelf is full from end to end."
      },
      "need": null,
      "sound": null,
      "visual": "The lower shelf has a clean open section between groups of books. The shelf itself is intact."
    },
    "scene-door": {
      "id": "scene-door",
      "kind": "photo",
      "title": "Doorway / scene detail 04",
      "chapter": 1,
      "text": "",
      "meta": "Same apartment / north doorway",
      "image": "scene-door",
      "choices": {
        "inside": "The latch can be operated from the apartment side.",
        "sealed": "The door has been sealed shut.",
        "unknown": "The photograph alone does not establish a route."
      },
      "need": null,
      "sound": null,
      "visual": "A dark wooden door opens from the living room into the landing. The latch is on the apartment-facing side."
    },
    "phone-object": {
      "id": "phone-object",
      "kind": "photo",
      "title": "Recovered phone",
      "chapter": 1,
      "text": "The device was recovered from the side table. The laboratory has authorised a read-only copy under the case warrant. Opening the copy does not alter the original phone.",
      "meta": "Device A-04 / seal recorded",
      "image": "scene-phone",
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "room-before": {
      "id": "room-before",
      "kind": "photo",
      "title": "A room before the gathering",
      "chapter": 1,
      "text": "",
      "meta": "Iris’s gallery / 12 October 2025 · 18:14",
      "image": "room-before",
      "choices": {
        "north": "The sofa runs across the back of the room, facing the table.",
        "east": "The sofa is along the east wall.",
        "uncertain": "The view is not useful for comparison."
      },
      "need": null,
      "sound": null,
      "visual": "The same window is on the left and the same shelves are at the back. The sofa runs across the back, facing the table."
    },
    "shelf-before": {
      "id": "shelf-before",
      "kind": "photo",
      "title": "A place for finished chapters",
      "chapter": 1,
      "text": "",
      "meta": "Iris’s gallery / 12 October · source capture",
      "image": "shelf-before",
      "choices": {
        "bronze": "A bronze bookend stands in the lower shelf gap.",
        "glass": "The object is a drinking glass.",
        "empty": "The shelf is empty."
      },
      "need": null,
      "sound": null,
      "visual": "A bronze L-shaped bookend with a circular ornament occupies the lower shelf section."
    },
    "window-memory": {
      "id": "window-memory",
      "kind": "photo",
      "title": "The light she kept",
      "chapter": 1,
      "text": "The same window, seen from Iris’s chair. A private photograph, not a crime-scene record.",
      "meta": "Iris’s gallery / 9 October · 08:12",
      "image": "window-memory",
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "room-prepared": {
      "id": "room-prepared",
      "kind": "photo",
      "title": "Before anyone arrived",
      "chapter": 2,
      "text": "",
      "meta": "Recovered queued image / captured 17 October · 19:06; original device time verified",
      "image": "room-prepared",
      "choices": {
        "prepared": "The sofa has already moved, and the bronze bookend is still on the shelf.",
        "same": "The room has the older sofa arrangement.",
        "empty": "The bookend is already absent."
      },
      "need": "recovery",
      "sound": null,
      "visual": "The sofa is already on the right, facing the window. The bronze bookend remains in its lower shelf position."
    },
    "hall-camera": {
      "id": "hall-camera",
      "kind": "surveillance",
      "title": "Entrance camera E1",
      "chapter": 3,
      "text": "8 Teilor Street / E1 / camera faces the front entrance. This is a still source, not a video. Its field of view stops before the apartment-facing side of the landing.",
      "meta": "Source camera position retained / no interior microphone",
      "image": "hall-camera",
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "trip": {
      "id": "trip",
      "kind": "receipt",
      "title": "Independent journey confirmation",
      "chapter": 2,
      "text": "RIDENOW / provider copy\nTrip 884: 18 October · pickup 00:09, Atelier Nord. Arrival 00:21, Hotel Aurelia.\nTrip 891: pickup 00:43, Hotel Aurelia. Arrival 00:52, 8 Teilor Street.\nPickup and arrival are different fields. The record identifies the booking account and vehicle, not every passenger.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "photo-index": {
      "id": "photo-index",
      "kind": "report",
      "title": "Queued-media index",
      "chapter": 2,
      "text": "DEVICE LAB / original index\nQueued media item IMG_1906 belongs to the message attachment sent at 19:08 on 17 October. Capture reference: 17 October 19:06.\nThe last four bytes of its local reference are 19 06. These are index fields, not a PIN. Match the original message and capture field to recover the correct item.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "hotel-clock": {
      "id": "hotel-clock",
      "kind": "report",
      "title": "Hotel recorder calibration",
      "chapter": 3,
      "text": "HOTEL AURELIA / camera 02\nRecorder is two minutes FAST relative to the independent reference clock. The camera shows the lobby approach only. It does not identify a person by coat colour.\nThe retained crossing frame is labelled 00:25. Keep calibration, arrival and identity as separate questions.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "hotel-receipt": {
      "id": "hotel-receipt",
      "kind": "receipt",
      "title": "Listening-room receipt",
      "chapter": 3,
      "text": "HOTEL AURELIA / 18 October\n00:23: Iris Vasilescu and Julia Radu begin the booked listening appointment.\n00:27: Luca Marin delivers a sealed transport case. Julia signs for seal 0416.\n00:41: appointment ends. Iris leaves with two separately addressed envelopes.\nIris’s booking note: Check what I agreed to. Return what was never mine to give away.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "roster": {
      "id": "roster",
      "kind": "report",
      "title": "Depot movement original",
      "chapter": 3,
      "text": "NORD DEPOT / permitted off-site break\nLuca Marin: 17 October 21:58 badge in. 18 October 00:10 break begins. 00:52 badge in. Final exit 06:02.\nA roster records assigned work. Off-site breaks were permitted. The destination is not recorded here.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "trace": {
      "id": "trace",
      "kind": "forensic",
      "title": "Receiving-desk trace sheet",
      "chapter": 3,
      "text": "EQUAL-SCALE EXAMINATION COPY\nThe partial sole trace has angled bars and a worn outer corner. Three reference specimens are available at the examination bench.\nThe transport case has two rubber wheels. A narrow paired track beneath the desk is a wheel trace, not a second person’s footprint.\nA compatible tread design does not establish its wearer or the time of contact.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "rider": {
      "id": "rider",
      "kind": "official",
      "title": "Project rider",
      "chapter": 1,
      "text": "SIGNED USE SCHEDULE / 14 October\nThe private family listening copy is permitted for the daughters and conservator. Public installation and commercial derivatives are separate uses.\nA description of assembled sound as a continuous original requires verification. Withdrawal does not require publication of the underlying family recording.\nIris requested independent review before licensing. Elena countersigned the audit condition.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "routing": {
      "id": "routing",
      "kind": "letter",
      "title": "Two different envelopes",
      "chapter": 4,
      "text": "CUSTODY DUPLICATE / retained 16 October 12:20\nPROJECT / withdraw the current public schedule; preserve correction and source index.\nFAMILY / return the originals and sealed personal envelope to Elena. No permission to publish raw family material.\nThe duplicate was retained before the final visit. It is not a reconstruction of what someone later hoped Iris wanted.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "revision": {
      "id": "revision",
      "kind": "report",
      "title": "Working revision history",
      "chapter": 4,
      "text": "24 September: Iris approves an interruption being removed from the family listening copy.\n06 October: Mara reuses that copy in the public assembly.\n10 October: Julia queries the label continuous original.\n14 October: Iris requests review. 16 October: signed withdrawal received.\nIris’s margin: I liked the kind version. That is not a good enough reason to tell people it is the whole one.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "cue": {
      "id": "cue",
      "kind": "personal",
      "title": "Listening-copy sleeve",
      "chapter": 4,
      "text": "FAMILY_LISTEN_04 / 24 September\nOpening kitchen passage retained. Later interruption omitted. Subsequent passage retained. The source reel remains separate and unaltered.\nIris’s reply: Keep this one for the family listening copy. Leave the original in the box. I want both, even if I can only bear one just now.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "programme": {
      "id": "programme",
      "kind": "official",
      "title": "Programme proof",
      "chapter": 4,
      "text": "STUDIO ISSUE / 06 October\nAssembly input: FAMILY_LISTEN_04. Output: INSTALLATION_06.\nCaption: Continuous original family recording.\nAssembly changes: level adjustment, exhibition fade, programme caption. No new source spans added.\n10 October: Julia asks whether the caption describes the input or the source.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "catalogue": {
      "id": "catalogue",
      "kind": "personal",
      "title": "Workshop catalogue key",
      "chapter": 5,
      "text": "RADIO WORKSHOP / source-index convention\nThe audible slate is a reel word. Use the Morse alphabet supplied with the player to identify its row.\nORCHID → shelf D / drawer 3 / sequence 2.\nLANTERN → shelf B / drawer 1 / sequence 4.\nMEADOW → shelf A / drawer 4 / sequence 1.\nThe mechanism uses the row’s three coordinates, followed by the number of audible long pulses in the slate. Letters on shelves are converted using A=1, B=2, C=3, D=4. No complete lock setting is printed here.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "transfer": {
      "id": "transfer",
      "kind": "receipt",
      "title": "Original transfer receipt",
      "chapter": 5,
      "text": "PROVIDER ORIGINAL / delivery fields\nR17_ASSEMBLY_EXPORT was queued from the studio rehearsal output on 15 October. First delivery was deferred. Automatic retry completed 18 October at 01:48.\nCapture time and delivery activity are different fields. This receipt does not describe a microphone switched on at 01:48.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "source-alignment": {
      "id": "source-alignment",
      "kind": "transcript",
      "title": "Continuous source alignment",
      "chapter": 5,
      "text": "DOMESTIC REEL / 13 March 2022\n00:12 Ana: Leave the light on. Your sister is still looking for the red button.\n00:23 Ana: I am not angry with you. I am trying to get the potatoes out before they turn to glue.\n03:08 Ana: Do not tell me I never listened. That is not fair. Stop the recorder for a minute.\n03:31 Ana: I am sorry I said that. You do not have to take care of my feelings every time I get tired.\nAssembly cue list: source positions 00:12 / 00:23 / 03:08. The continuous source retains intervening material.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "adrian-account": {
      "id": "adrian-account",
      "kind": "letter",
      "title": "Adrian’s retained account",
      "chapter": 6,
      "text": "VOLUNTARY ORIGINAL\nWe were separating. I kept calling it a bad week because that sounded less final. She asked me to bring boxes the next day.\nI did not go back to the apartment after the gathering. The car and shop records are supplied separately.\nI watered the plant. I wish that were the only ordinary thing I had been right about.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "payment": {
      "id": "payment",
      "kind": "report",
      "title": "Payment purpose comparison",
      "chapter": 6,
      "text": "INDEPENDENT APPROVAL CHAIN\nThe private listening edit and public assembly were separately paid for. Victor concealed a separate family-care payment in the production account. The receiving provider confirms its purpose.\nThe concealment is real. The record does not establish a commission to harm Iris. The public licensing pressure still requires an honest account.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "building-a": {
      "id": "building-a",
      "kind": "plan",
      "title": "Retained circulation drawing A",
      "chapter": 6,
      "text": "8 TEILOR STREET / retained desk copy\nThe front entrance leads past camera E1 to the landing. The older drawing shows the side service connection closed.\nDrawing scale is shared with the completion copy. A camera field is not the whole circulation plan.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "building-b": {
      "id": "building-b",
      "kind": "plan",
      "title": "Completed circulation drawing B",
      "chapter": 6,
      "text": "8 TEILOR STREET / completed service works\nThe side service connection joins the apartment-facing landing behind E1. The camera still faces the front entrance. Its position did not move under the work order.\nAn available route does not establish that a particular person used it.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "clinical": {
      "id": "clinical",
      "kind": "official",
      "title": "Final injury findings",
      "chapter": 7,
      "text": "MEDICAL EXAMINER / case release\nA fatal blunt head injury is supported. The findings cannot safely be reduced to a simple unobserved collapse. No exact minute of death is certified.\nThe victim would not have been capable of the sustained coherent reassurance attributed to her later. Compare the actual sender and original recording, not an index description.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "object-report": {
      "id": "object-report",
      "kind": "forensic",
      "title": "Recovered object and label",
      "chapter": 7,
      "text": "EXAMINATION OF THE RECOVERED BRONZE BOOKEND\nIts dimensions and edge profile are compatible with the injury class. Compatibility alone does not identify a user.\nThe custody label overlies a blood-bearing surface. It was applied after the surface was contaminated. The retained label batch and dispatch copy belong to Julia’s custody case.\nAn older photograph proves Julia had handled this gift before. Her print alone cannot date that contact.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "julia-account": {
      "id": "julia-account",
      "kind": "letter",
      "title": "Julia’s first account",
      "chapter": 6,
      "text": "VOLUNTARY ACCOUNT / retained before source recovery\nI returned to the archive after the hotel appointment. I did not remain at the apartment. I never change an original.\nIris wanted the review. I supplied the sources. Those are both true. Please keep them true even if people need someone to hate.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "custody": {
      "id": "custody",
      "kind": "official",
      "title": "Independent case and visit records",
      "chapter": 7,
      "text": "BUILDING / RECEIVING CUSTODIANS\nA signed receiving copy places Julia’s custody case at the apartment-facing service landing after the hotel appointment. The handover record and label batch are independently retained.\nThe later service departure is compatible with the case being removed after the injury interval. These records are not an interior eyewitness account.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "apology": {
      "id": "apology",
      "kind": "letter",
      "title": "An unfinished apology",
      "chapter": 8,
      "text": "PERSONAL / source retained with separate listening permission\nI keep making the careful version and then resenting people for believing it. I did it too.\nTomorrow I want to ask whether we can keep something without saying it happened exactly that way. I do not know if I can say it without making it a speech.\nPut the recorder on if I start editing myself again. Not for an audience. Just so I can hear what I actually said.",
      "meta": "Retained original / English",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.0": {
      "id": "msg.elena.0",
      "kind": "message",
      "title": "Elena · 12 Oct · 10:08",
      "chapter": 1,
      "text": "Is the blue mug still leaking?",
      "meta": "12 Oct · 10:08 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.1": {
      "id": "msg.elena.1",
      "kind": "message",
      "title": "Elena · 12 Oct · 10:13",
      "chapter": 1,
      "text": "Only if I put liquid in it.",
      "meta": "12 Oct · 10:13 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.2": {
      "id": "msg.elena.2",
      "kind": "message",
      "title": "Elena · 12 Oct · 10:14",
      "chapter": 1,
      "text": "That is a fairly important function.",
      "meta": "12 Oct · 10:14 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.3": {
      "id": "msg.elena.3",
      "kind": "message",
      "title": "Elena · 12 Oct · 10:16",
      "chapter": 1,
      "text": "You fixed it. It is staying.",
      "meta": "12 Oct · 10:16 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.4": {
      "id": "msg.elena.4",
      "kind": "message",
      "title": "Elena · 12 Oct · 10:18",
      "chapter": 1,
      "text": "I can fix it again. Do not make keeping a broken thing into a personality.",
      "meta": "12 Oct · 10:18 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.5": {
      "id": "msg.elena.5",
      "kind": "message",
      "title": "Elena · 13 Oct · 18:20",
      "chapter": 1,
      "text": "I found the recipe cards in the radio box.",
      "meta": "13 Oct · 18:20 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.6": {
      "id": "msg.elena.6",
      "kind": "message",
      "title": "Elena · 13 Oct · 18:24",
      "chapter": 1,
      "text": "Which radio box? There were several. We were apparently bringing up a small broadcasting authority.",
      "meta": "13 Oct · 18:24 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.7": {
      "id": "msg.elena.7",
      "kind": "message",
      "title": "Elena · 13 Oct · 18:26",
      "chapter": 1,
      "text": "The one with the potatoes.",
      "meta": "13 Oct · 18:26 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.8": {
      "id": "msg.elena.8",
      "kind": "message",
      "title": "Elena · 13 Oct · 18:29",
      "chapter": 1,
      "text": "Keep those for me.",
      "meta": "13 Oct · 18:29 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.9": {
      "id": "msg.elena.9",
      "kind": "message",
      "title": "Elena · 13 Oct · 18:31",
      "chapter": 1,
      "text": "I will.",
      "meta": "13 Oct · 18:31 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.10": {
      "id": "msg.elena.10",
      "kind": "message",
      "title": "Elena · 16 Oct · 20:10",
      "chapter": 2,
      "text": "You keep saying withdraw as if it is putting a book back on a shelf. You cannot put her back.",
      "meta": "16 Oct · 20:10 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.11": {
      "id": "msg.elena.11",
      "kind": "message",
      "title": "Elena · 16 Oct · 20:14",
      "chapter": 2,
      "text": "I mean take it out of the public installation. I do not mean put the whole family on a website.",
      "meta": "16 Oct · 20:14 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.12": {
      "id": "msg.elena.12",
      "kind": "message",
      "title": "Elena · 16 Oct · 20:28",
      "chapter": 2,
      "text": "You get to change your mind and I get to lose the only version that does not hurt.",
      "meta": "16 Oct · 20:28 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.13": {
      "id": "msg.elena.13",
      "kind": "message",
      "title": "Elena · 16 Oct · 20:34",
      "chapter": 2,
      "text": "We can keep something without saying it happened exactly that way. Please let those be different things.",
      "meta": "16 Oct · 20:34 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.14": {
      "id": "msg.elena.14",
      "kind": "message",
      "title": "Elena · 17 Oct · 19:04",
      "chapter": 1,
      "text": "Are you going to the gathering in that coat?",
      "meta": "17 Oct · 19:04 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.15": {
      "id": "msg.elena.15",
      "kind": "message",
      "title": "Elena · 17 Oct · 19:08",
      "chapter": 1,
      "text": "Probably. The pockets can hold an entire evening of things I do not want to carry.",
      "meta": "17 Oct · 19:08 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.16": {
      "id": "msg.elena.16",
      "kind": "message",
      "title": "Elena · 17 Oct · 19:10",
      "chapter": 1,
      "text": "You always did have to make a practical answer sound like an accusation.",
      "meta": "17 Oct · 19:10 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.17": {
      "id": "msg.elena.17",
      "kind": "message",
      "title": "Elena · 17 Oct · 19:15",
      "chapter": 1,
      "text": "It was just a coat answer. Can we have one of those?",
      "meta": "17 Oct · 19:15 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.18": {
      "id": "msg.elena.18",
      "kind": "message",
      "title": "Elena · 18 Oct · 00:54",
      "chapter": 3,
      "text": "Come over. We can do this without the studio in the room.",
      "meta": "18 Oct · 00:54 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.19": {
      "id": "msg.elena.19",
      "kind": "message",
      "title": "Elena · 18 Oct · 01:06",
      "chapter": 3,
      "text": "I have gone. I am not doing the rest of this by message.",
      "meta": "18 Oct · 01:06 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.elena.20": {
      "id": "msg.elena.20",
      "kind": "message",
      "title": "Elena · 18 Oct · 07:04",
      "chapter": 2,
      "text": "Please answer me. I am coming back.",
      "meta": "18 Oct · 07:04 / Elena",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.0": {
      "id": "msg.mara.0",
      "kind": "message",
      "title": "Mara · 11 Oct · 12:06",
      "chapter": 1,
      "text": "Lunch? The place with the terrible chairs.",
      "meta": "11 Oct · 12:06 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.1": {
      "id": "msg.mara.1",
      "kind": "message",
      "title": "Mara · 11 Oct · 12:12",
      "chapter": 1,
      "text": "I love those chairs. Nobody can stay to explain their whole business strategy.",
      "meta": "11 Oct · 12:12 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.2": {
      "id": "msg.mara.2",
      "kind": "message",
      "title": "Mara · 11 Oct · 12:14",
      "chapter": 1,
      "text": "Then we will have to explain ours very quickly.",
      "meta": "11 Oct · 12:14 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.3": {
      "id": "msg.mara.3",
      "kind": "message",
      "title": "Mara · 11 Oct · 12:18",
      "chapter": 1,
      "text": "One sandwich in the known universe that is only a sandwich. Please.",
      "meta": "11 Oct · 12:18 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.4": {
      "id": "msg.mara.4",
      "kind": "message",
      "title": "Mara · 14 Oct · 21:08",
      "chapter": 1,
      "text": "Did you keep the first listening copy?",
      "meta": "14 Oct · 21:08 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.5": {
      "id": "msg.mara.5",
      "kind": "message",
      "title": "Mara · 14 Oct · 21:12",
      "chapter": 1,
      "text": "I keep everything. It is why none of my drawers close.",
      "meta": "14 Oct · 21:12 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.6": {
      "id": "msg.mara.6",
      "kind": "message",
      "title": "Mara · 14 Oct · 21:14",
      "chapter": 1,
      "text": "The version before we made it kind.",
      "meta": "14 Oct · 21:14 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.7": {
      "id": "msg.mara.7",
      "kind": "message",
      "title": "Mara · 14 Oct · 21:23",
      "chapter": 1,
      "text": "Yes.",
      "meta": "14 Oct · 21:23 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.8": {
      "id": "msg.mara.8",
      "kind": "message",
      "title": "Mara · 14 Oct · 21:26",
      "chapter": 1,
      "text": "Thank you.",
      "meta": "14 Oct · 21:26 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.9": {
      "id": "msg.mara.9",
      "kind": "message",
      "title": "Mara · 17 Oct · 19:08",
      "chapter": 2,
      "text": "IMG_1906. I finally turned the room around. Do not tell me the chairs need a strategy too.",
      "meta": "17 Oct · 19:08 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.10": {
      "id": "msg.mara.10",
      "kind": "message",
      "title": "Mara · 17 Oct · 19:11",
      "chapter": 1,
      "text": "Is that the shelf you said you would sort before we were thirty?",
      "meta": "17 Oct · 19:11 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.11": {
      "id": "msg.mara.11",
      "kind": "message",
      "title": "Mara · 17 Oct · 19:12",
      "chapter": 1,
      "text": "I have revised the deadline.",
      "meta": "17 Oct · 19:12 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.mara.12": {
      "id": "msg.mara.12",
      "kind": "message",
      "title": "Mara · 18 Oct · 01:24",
      "chapter": 5,
      "text": "If she is hurt, call for help now. Please tell me you have.",
      "meta": "18 Oct · 01:24 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": "original-message",
      "sound": null
    },
    "msg.mara.13": {
      "id": "msg.mara.13",
      "kind": "message",
      "title": "Mara · 19 Oct · 09:10",
      "chapter": 1,
      "text": "I am awake. I have not found a useful way to be anything else.",
      "meta": "19 Oct · 09:10 / Mara",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.0": {
      "id": "msg.adrian.0",
      "kind": "message",
      "title": "Adrian · 10 Oct · 19:14",
      "chapter": 1,
      "text": "Did you eat?",
      "meta": "10 Oct · 19:14 / Adrian",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.1": {
      "id": "msg.adrian.1",
      "kind": "message",
      "title": "Adrian · 10 Oct · 19:20",
      "chapter": 1,
      "text": "Coffee contains several beans.",
      "meta": "10 Oct · 19:20 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.2": {
      "id": "msg.adrian.2",
      "kind": "message",
      "title": "Adrian · 10 Oct · 19:22",
      "chapter": 1,
      "text": "I will interpret that as no.",
      "meta": "10 Oct · 19:22 / Adrian",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.3": {
      "id": "msg.adrian.3",
      "kind": "message",
      "title": "Adrian · 10 Oct · 19:24",
      "chapter": 1,
      "text": "I know it is annoying when you are right in such an ordinary way.",
      "meta": "10 Oct · 19:24 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.4": {
      "id": "msg.adrian.4",
      "kind": "message",
      "title": "Adrian · 15 Oct · 22:10",
      "chapter": 1,
      "text": "I watered the plant. The one you said had lost the will to be a plant.",
      "meta": "15 Oct · 22:10 / Adrian",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.5": {
      "id": "msg.adrian.5",
      "kind": "message",
      "title": "Adrian · 15 Oct · 22:16",
      "chapter": 1,
      "text": "It has not authorised you to speak for it.",
      "meta": "15 Oct · 22:16 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.6": {
      "id": "msg.adrian.6",
      "kind": "message",
      "title": "Adrian · 17 Oct · 18:12",
      "chapter": 2,
      "text": "Do you still want the boxes tomorrow?",
      "meta": "17 Oct · 18:12 / Adrian",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.7": {
      "id": "msg.adrian.7",
      "kind": "message",
      "title": "Adrian · 17 Oct · 18:18",
      "chapter": 2,
      "text": "Yes. Please do not make that into a bad week.",
      "meta": "17 Oct · 18:18 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.adrian.8": {
      "id": "msg.adrian.8",
      "kind": "message",
      "title": "Adrian · 18 Oct · 02:14",
      "chapter": 1,
      "text": "I am not going to keep ringing. Just let me know you got back.",
      "meta": "18 Oct · 02:14 / Adrian",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.julia.0": {
      "id": "msg.julia.0",
      "kind": "message",
      "title": "Julia · 16 Oct · 12:22",
      "chapter": 1,
      "text": "Seal 0416. I kept the duplicate where you asked.",
      "meta": "16 Oct · 12:22 / Julia",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.julia.1": {
      "id": "msg.julia.1",
      "kind": "message",
      "title": "Julia · 16 Oct · 12:30",
      "chapter": 1,
      "text": "Both names on it. Mine too.",
      "meta": "16 Oct · 12:30 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.julia.2": {
      "id": "msg.julia.2",
      "kind": "message",
      "title": "Julia · 16 Oct · 12:36",
      "chapter": 1,
      "text": "I know.",
      "meta": "16 Oct · 12:36 / Julia",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.julia.3": {
      "id": "msg.julia.3",
      "kind": "message",
      "title": "Julia · 17 Oct · 16:02",
      "chapter": 1,
      "text": "Could we have one conversation without deciding how it will be described afterwards?",
      "meta": "17 Oct · 16:02 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.julia.4": {
      "id": "msg.julia.4",
      "kind": "message",
      "title": "Julia · 17 Oct · 16:10",
      "chapter": 1,
      "text": "I do not know how to promise that. I can promise to come.",
      "meta": "17 Oct · 16:10 / Julia",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.julia.5": {
      "id": "msg.julia.5",
      "kind": "message",
      "title": "Julia · 18 Oct · 00:19",
      "chapter": 2,
      "text": "I have the source copy. The second chair is there.",
      "meta": "18 Oct · 00:19 / Julia",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.victor.0": {
      "id": "msg.victor.0",
      "kind": "message",
      "title": "Victor · 14 Oct · 15:20",
      "chapter": 1,
      "text": "The licensing meeting cannot proceed without the examiner.",
      "meta": "14 Oct · 15:20 / Victor",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.victor.1": {
      "id": "msg.victor.1",
      "kind": "message",
      "title": "Victor · 14 Oct · 15:29",
      "chapter": 1,
      "text": "Then the meeting can wait.",
      "meta": "14 Oct · 15:29 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.victor.2": {
      "id": "msg.victor.2",
      "kind": "message",
      "title": "Victor · 14 Oct · 15:33",
      "chapter": 1,
      "text": "That is easier to write than to arrange.",
      "meta": "14 Oct · 15:33 / Victor",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.victor.3": {
      "id": "msg.victor.3",
      "kind": "message",
      "title": "Victor · 14 Oct · 15:40",
      "chapter": 1,
      "text": "So was continuous original.",
      "meta": "14 Oct · 15:40 / Iris",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.victor.4": {
      "id": "msg.victor.4",
      "kind": "message",
      "title": "Victor · 17 Oct · 20:12",
      "chapter": 1,
      "text": "We will talk after the gathering. Not in front of guests.",
      "meta": "17 Oct · 20:12 / Victor",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.studio.0": {
      "id": "msg.studio.0",
      "kind": "message",
      "title": "Studio table · 17 Oct · 14:05",
      "chapter": 1,
      "text": "No speeches until somebody has eaten.",
      "meta": "17 Oct · 14:05 / Studio table",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.studio.1": {
      "id": "msg.studio.1",
      "kind": "message",
      "title": "Studio table · 17 Oct · 14:08",
      "chapter": 1,
      "text": "Is that a production requirement?",
      "meta": "17 Oct · 14:08 / Studio table",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.studio.2": {
      "id": "msg.studio.2",
      "kind": "message",
      "title": "Studio table · 17 Oct · 14:09",
      "chapter": 1,
      "text": "It is an attempt to remain human.",
      "meta": "17 Oct · 14:09 / Studio table",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.studio.3": {
      "id": "msg.studio.3",
      "kind": "message",
      "title": "Studio table · 17 Oct · 14:12",
      "chapter": 1,
      "text": "I have put it on the schedule.",
      "meta": "17 Oct · 14:12 / Studio table",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "msg.studio.4": {
      "id": "msg.studio.4",
      "kind": "message",
      "title": "Studio table · 17 Oct · 23:35",
      "chapter": 2,
      "text": "Thank you. We needed that room tonight.",
      "meta": "17 Oct · 23:35 / Studio table",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "note.recipe": {
      "id": "note.recipe",
      "kind": "personal",
      "title": "Potatoes / do not trust the oven",
      "chapter": 1,
      "text": "Ana’s version\nStart before you think you need to. Leave the skins on if you are tired. Stop apologising for making too much.\nElena likes the burnt edges. I always pretend I do not.\nAsk her whether she remembers the radio box.",
      "meta": "",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "note.room": {
      "id": "note.room",
      "kind": "personal",
      "title": "A room for two",
      "chapter": 1,
      "text": "Move the chairs so neither of us is talking at the back of the other one.\nNo studio people. No speech. Tea if it helps.\nDo not decide what she is going to say before she is here.",
      "meta": "",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "note.review": {
      "id": "note.review",
      "kind": "personal",
      "title": "Things to ask",
      "chapter": 2,
      "text": "What did I approve?\nWhat did we call it afterwards?\nWhere is the original kept?\nThese are three questions. Stop turning them into one.",
      "meta": "",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": null
    },
    "audio.briefing": {
      "id": "audio.briefing",
      "kind": "audio",
      "title": "Duty briefing",
      "chapter": 1,
      "text": "Captain Pavel: Dima. You are taking the Teilor Street case. Iris Vasilescu was found in her living room yesterday morning. The preliminary report cannot explain the injury as a simple fall. You are not being sent to tidy up someone else’s conclusion. Start with the room. Nadia is waiting downstairs.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "briefing"
    },
    "audio.voicemail-elena": {
      "id": "audio.voicemail-elena",
      "kind": "audio",
      "title": "Missed call / Elena",
      "chapter": 1,
      "text": "Elena: It is me. I know you said not to do the rest of it by message. I am not trying to. Just tell me you are awake. You can be angry afterwards.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "voicemail-elena"
    },
    "audio.room-note": {
      "id": "audio.room-note",
      "kind": "audio",
      "title": "A practical answer",
      "chapter": 2,
      "text": "Iris: I finally moved the sofa. It turns out you can change a room without replacing everything in it. Do not let me make that into a statement for the wall. I mean the chairs can face each other now. That is all.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "room-note"
    },
    "audio.slate": {
      "id": "audio.slate",
      "kind": "audio",
      "title": "Workshop slate",
      "chapter": 5,
      "text": "Pulse groups: --- / .-. / -.-. / .... / .. / -.. . A dash lasts three short units. Longer gaps separate groups.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "slate"
    },
    "audio.apartment-reference": {
      "id": "audio.apartment-reference",
      "kind": "audio",
      "title": "Room reference / clock",
      "chapter": 3,
      "text": "Sound observations: a short tick, another short tick, then a longer pause and a third tick. The pattern repeats.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "apartment-reference"
    },
    "audio.hotel-reference": {
      "id": "audio.hotel-reference",
      "kind": "audio",
      "title": "Hotel lift reference",
      "chapter": 3,
      "text": "Sound observations: two bright descending lift chimes, with a short pause between them.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "hotel-reference"
    },
    "audio.reassurance": {
      "id": "audio.reassurance",
      "kind": "audio",
      "title": "Retained reassurance / original",
      "chapter": 5,
      "text": "Unknown voice: She is settled now. She does not want an ambulance. Leave it until morning. I will keep the copy here.\nSound observations: behind the voice, a short tick, a second short tick, a longer pause, and a third tick repeat.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": "original-message",
      "sound": "reassurance"
    },
    "audio.room-original": {
      "id": "audio.room-original",
      "kind": "audio",
      "title": "Room recording / retained source",
      "chapter": 5,
      "text": "Iris: You can keep it private. But you cannot keep calling it my choice.\nJulia: I cannot let them hear it like that.\nIris: Them, or me? We can say what we did without handing her whole life to strangers.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": "original-message",
      "sound": "room-original"
    },
    "audio.family-fragment": {
      "id": "audio.family-fragment",
      "kind": "audio",
      "title": "A small announcement",
      "chapter": 1,
      "text": "Ana: Then announce that the potatoes are ready. And stop both of you making that face at me.\nElena: Nobody can hear a face.\nAna: I can.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "family-fragment"
    },
    "audio.assembly": {
      "id": "audio.assembly",
      "kind": "audio",
      "title": "Delivered listening extract",
      "chapter": 4,
      "text": "Ana: Leave the light on.\nAna: I am not angry with you.\nAna: Stop the recorder for a minute.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "assembly"
    },
    "audio.apology": {
      "id": "audio.apology",
      "kind": "audio",
      "title": "A private ending",
      "chapter": 9,
      "text": "Iris: I keep trying to find the right version. There was a good evening. There was an argument. You were there. I was there. I do not want to choose which one gets to have happened.",
      "meta": "Retained recording / transcript available",
      "image": null,
      "choices": {
        "text": "Keep the original wording"
      },
      "need": null,
      "sound": "apology"
    },
    "calendar.14.1600": {
      "id": "calendar.14.1600",
      "kind": "calendar",
      "title": "Return the rider",
      "chapter": 1,
      "text": "14 October 2025 / 16:00\nReturn the rider\nBoth signatures. Keep a copy.",
      "meta": "Iris’s original calendar",
      "choices": {
        "text": "Keep the original appointment"
      },
      "need": null,
      "image": null,
      "sound": null
    },
    "calendar.17.1840": {
      "id": "calendar.17.1840",
      "kind": "calendar",
      "title": "Move the room",
      "chapter": 2,
      "text": "17 October 2025 / 18:40\nMove the room\nFor a conversation, not a photograph.",
      "meta": "Iris’s original calendar",
      "choices": {
        "text": "Keep the original appointment"
      },
      "need": null,
      "image": null,
      "sound": null
    },
    "calendar.17.2200": {
      "id": "calendar.17.2200",
      "kind": "calendar",
      "title": "Studio gathering",
      "chapter": 1,
      "text": "17 October 2025 / 22:00\nStudio gathering\nEat something first.",
      "meta": "Iris’s original calendar",
      "choices": {
        "text": "Keep the original appointment"
      },
      "need": null,
      "image": null,
      "sound": null
    },
    "calendar.18.0023": {
      "id": "calendar.18.0023",
      "kind": "calendar",
      "title": "Listening room",
      "chapter": 2,
      "text": "18 October 2025 / 00:23\nListening room\nHotel Aurelia. Julia has the second chair.",
      "meta": "Iris’s original calendar",
      "choices": {
        "text": "Keep the original appointment"
      },
      "need": null,
      "image": null,
      "sound": null
    },
    "calendar.19.1000": {
      "id": "calendar.19.1000",
      "kind": "calendar",
      "title": "Boxes",
      "chapter": 2,
      "text": "19 October 2025 / 10:00\nBoxes\nAsk Adrian to leave them downstairs.",
      "meta": "Iris’s original calendar",
      "choices": {
        "text": "Keep the original appointment"
      },
      "need": null,
      "image": null,
      "sound": null
    },
    "hotel-camera": {
      "id": "hotel-camera",
      "kind": "surveillance",
      "title": "Hotel Aurelia / camera 02",
      "chapter": 3,
      "text": "Retained stills from the lobby approach. The camera cannot identify a face and does not cover the listening-room interior.",
      "visual": "Frame 00:25:00: empty. Frame 00:25:04: an anonymous figure crosses toward the doorway. Frame 00:25:08: the figure has left the field.",
      "meta": "Recorder clock / source frames preserved / no microphone",
      "image": "hotel-4",
      "choices": {
        "crossing": "An anonymous figure crosses the lobby approach.",
        "empty": "The retained frame is empty.",
        "identity": "The person can be uniquely identified."
      }
    }
  },
  "threads": {
    "elena": {
      "id": "elena",
      "name": "Elena",
      "subtitle": "Sister",
      "messages": [
        {
          "id": "msg.elena.0",
          "who": "them",
          "time": "12 Oct · 10:08",
          "text": "Is the blue mug still leaking?"
        },
        {
          "id": "msg.elena.1",
          "who": "me",
          "time": "12 Oct · 10:13",
          "text": "Only if I put liquid in it."
        },
        {
          "id": "msg.elena.2",
          "who": "them",
          "time": "12 Oct · 10:14",
          "text": "That is a fairly important function."
        },
        {
          "id": "msg.elena.3",
          "who": "me",
          "time": "12 Oct · 10:16",
          "text": "You fixed it. It is staying."
        },
        {
          "id": "msg.elena.4",
          "who": "them",
          "time": "12 Oct · 10:18",
          "text": "I can fix it again. Do not make keeping a broken thing into a personality."
        },
        {
          "id": "msg.elena.5",
          "who": "me",
          "time": "13 Oct · 18:20",
          "text": "I found the recipe cards in the radio box."
        },
        {
          "id": "msg.elena.6",
          "who": "them",
          "time": "13 Oct · 18:24",
          "text": "Which radio box? There were several. We were apparently bringing up a small broadcasting authority."
        },
        {
          "id": "msg.elena.7",
          "who": "me",
          "time": "13 Oct · 18:26",
          "text": "The one with the potatoes."
        },
        {
          "id": "msg.elena.8",
          "who": "them",
          "time": "13 Oct · 18:29",
          "text": "Keep those for me."
        },
        {
          "id": "msg.elena.9",
          "who": "me",
          "time": "13 Oct · 18:31",
          "text": "I will."
        },
        {
          "id": "msg.elena.10",
          "who": "them",
          "time": "16 Oct · 20:10",
          "text": "You keep saying withdraw as if it is putting a book back on a shelf. You cannot put her back.",
          "chapter": 2
        },
        {
          "id": "msg.elena.11",
          "who": "me",
          "time": "16 Oct · 20:14",
          "text": "I mean take it out of the public installation. I do not mean put the whole family on a website.",
          "chapter": 2
        },
        {
          "id": "msg.elena.12",
          "who": "them",
          "time": "16 Oct · 20:28",
          "text": "You get to change your mind and I get to lose the only version that does not hurt.",
          "chapter": 2
        },
        {
          "id": "msg.elena.13",
          "who": "me",
          "time": "16 Oct · 20:34",
          "text": "We can keep something without saying it happened exactly that way. Please let those be different things.",
          "chapter": 2
        },
        {
          "id": "msg.elena.14",
          "who": "them",
          "time": "17 Oct · 19:04",
          "text": "Are you going to the gathering in that coat?"
        },
        {
          "id": "msg.elena.15",
          "who": "me",
          "time": "17 Oct · 19:08",
          "text": "Probably. The pockets can hold an entire evening of things I do not want to carry."
        },
        {
          "id": "msg.elena.16",
          "who": "them",
          "time": "17 Oct · 19:10",
          "text": "You always did have to make a practical answer sound like an accusation."
        },
        {
          "id": "msg.elena.17",
          "who": "me",
          "time": "17 Oct · 19:15",
          "text": "It was just a coat answer. Can we have one of those?"
        },
        {
          "id": "msg.elena.18",
          "who": "me",
          "time": "18 Oct · 00:54",
          "text": "Come over. We can do this without the studio in the room.",
          "chapter": 3
        },
        {
          "id": "msg.elena.19",
          "who": "them",
          "time": "18 Oct · 01:06",
          "text": "I have gone. I am not doing the rest of this by message.",
          "chapter": 3
        },
        {
          "id": "msg.elena.20",
          "who": "them",
          "time": "18 Oct · 07:04",
          "text": "Please answer me. I am coming back.",
          "chapter": 2
        }
      ]
    },
    "mara": {
      "id": "mara",
      "name": "Mara",
      "subtitle": "Friend / sound editor",
      "messages": [
        {
          "id": "msg.mara.0",
          "who": "them",
          "time": "11 Oct · 12:06",
          "text": "Lunch? The place with the terrible chairs."
        },
        {
          "id": "msg.mara.1",
          "who": "me",
          "time": "11 Oct · 12:12",
          "text": "I love those chairs. Nobody can stay to explain their whole business strategy."
        },
        {
          "id": "msg.mara.2",
          "who": "them",
          "time": "11 Oct · 12:14",
          "text": "Then we will have to explain ours very quickly."
        },
        {
          "id": "msg.mara.3",
          "who": "me",
          "time": "11 Oct · 12:18",
          "text": "One sandwich in the known universe that is only a sandwich. Please."
        },
        {
          "id": "msg.mara.4",
          "who": "me",
          "time": "14 Oct · 21:08",
          "text": "Did you keep the first listening copy?"
        },
        {
          "id": "msg.mara.5",
          "who": "them",
          "time": "14 Oct · 21:12",
          "text": "I keep everything. It is why none of my drawers close."
        },
        {
          "id": "msg.mara.6",
          "who": "me",
          "time": "14 Oct · 21:14",
          "text": "The version before we made it kind."
        },
        {
          "id": "msg.mara.7",
          "who": "them",
          "time": "14 Oct · 21:23",
          "text": "Yes."
        },
        {
          "id": "msg.mara.8",
          "who": "me",
          "time": "14 Oct · 21:26",
          "text": "Thank you."
        },
        {
          "id": "msg.mara.9",
          "who": "me",
          "time": "17 Oct · 19:08",
          "text": "IMG_1906. I finally turned the room around. Do not tell me the chairs need a strategy too.",
          "attachment": "room-prepared",
          "chapter": 2
        },
        {
          "id": "msg.mara.10",
          "who": "them",
          "time": "17 Oct · 19:11",
          "text": "Is that the shelf you said you would sort before we were thirty?"
        },
        {
          "id": "msg.mara.11",
          "who": "me",
          "time": "17 Oct · 19:12",
          "text": "I have revised the deadline."
        },
        {
          "id": "msg.mara.12",
          "who": "them",
          "time": "18 Oct · 01:24",
          "text": "If she is hurt, call for help now. Please tell me you have.",
          "need": "original-message",
          "chapter": 5
        },
        {
          "id": "msg.mara.13",
          "who": "them",
          "time": "19 Oct · 09:10",
          "text": "I am awake. I have not found a useful way to be anything else."
        }
      ]
    },
    "adrian": {
      "id": "adrian",
      "name": "Adrian",
      "subtitle": "Personal",
      "messages": [
        {
          "id": "msg.adrian.0",
          "who": "them",
          "time": "10 Oct · 19:14",
          "text": "Did you eat?"
        },
        {
          "id": "msg.adrian.1",
          "who": "me",
          "time": "10 Oct · 19:20",
          "text": "Coffee contains several beans."
        },
        {
          "id": "msg.adrian.2",
          "who": "them",
          "time": "10 Oct · 19:22",
          "text": "I will interpret that as no."
        },
        {
          "id": "msg.adrian.3",
          "who": "me",
          "time": "10 Oct · 19:24",
          "text": "I know it is annoying when you are right in such an ordinary way."
        },
        {
          "id": "msg.adrian.4",
          "who": "them",
          "time": "15 Oct · 22:10",
          "text": "I watered the plant. The one you said had lost the will to be a plant."
        },
        {
          "id": "msg.adrian.5",
          "who": "me",
          "time": "15 Oct · 22:16",
          "text": "It has not authorised you to speak for it."
        },
        {
          "id": "msg.adrian.6",
          "who": "them",
          "time": "17 Oct · 18:12",
          "text": "Do you still want the boxes tomorrow?",
          "chapter": 2
        },
        {
          "id": "msg.adrian.7",
          "who": "me",
          "time": "17 Oct · 18:18",
          "text": "Yes. Please do not make that into a bad week.",
          "chapter": 2
        },
        {
          "id": "msg.adrian.8",
          "who": "them",
          "time": "18 Oct · 02:14",
          "text": "I am not going to keep ringing. Just let me know you got back."
        }
      ]
    },
    "julia": {
      "id": "julia",
      "name": "Julia",
      "subtitle": "Conservation",
      "messages": [
        {
          "id": "msg.julia.0",
          "who": "them",
          "time": "16 Oct · 12:22",
          "text": "Seal 0416. I kept the duplicate where you asked."
        },
        {
          "id": "msg.julia.1",
          "who": "me",
          "time": "16 Oct · 12:30",
          "text": "Both names on it. Mine too."
        },
        {
          "id": "msg.julia.2",
          "who": "them",
          "time": "16 Oct · 12:36",
          "text": "I know."
        },
        {
          "id": "msg.julia.3",
          "who": "me",
          "time": "17 Oct · 16:02",
          "text": "Could we have one conversation without deciding how it will be described afterwards?"
        },
        {
          "id": "msg.julia.4",
          "who": "them",
          "time": "17 Oct · 16:10",
          "text": "I do not know how to promise that. I can promise to come."
        },
        {
          "id": "msg.julia.5",
          "who": "them",
          "time": "18 Oct · 00:19",
          "text": "I have the source copy. The second chair is there.",
          "chapter": 2
        }
      ]
    },
    "victor": {
      "id": "victor",
      "name": "Victor",
      "subtitle": "Project",
      "messages": [
        {
          "id": "msg.victor.0",
          "who": "them",
          "time": "14 Oct · 15:20",
          "text": "The licensing meeting cannot proceed without the examiner."
        },
        {
          "id": "msg.victor.1",
          "who": "me",
          "time": "14 Oct · 15:29",
          "text": "Then the meeting can wait."
        },
        {
          "id": "msg.victor.2",
          "who": "them",
          "time": "14 Oct · 15:33",
          "text": "That is easier to write than to arrange."
        },
        {
          "id": "msg.victor.3",
          "who": "me",
          "time": "14 Oct · 15:40",
          "text": "So was continuous original."
        },
        {
          "id": "msg.victor.4",
          "who": "them",
          "time": "17 Oct · 20:12",
          "text": "We will talk after the gathering. Not in front of guests."
        }
      ]
    },
    "studio": {
      "id": "studio",
      "name": "Studio table",
      "subtitle": "Group · Iris, Mara, Victor",
      "messages": [
        {
          "id": "msg.studio.0",
          "who": "Mara",
          "time": "17 Oct · 14:05",
          "text": "No speeches until somebody has eaten."
        },
        {
          "id": "msg.studio.1",
          "who": "Victor",
          "time": "17 Oct · 14:08",
          "text": "Is that a production requirement?"
        },
        {
          "id": "msg.studio.2",
          "who": "Iris",
          "time": "17 Oct · 14:09",
          "text": "It is an attempt to remain human."
        },
        {
          "id": "msg.studio.3",
          "who": "Mara",
          "time": "17 Oct · 14:12",
          "text": "I have put it on the schedule."
        },
        {
          "id": "msg.studio.4",
          "who": "Victor",
          "time": "17 Oct · 23:35",
          "text": "Thank you. We needed that room tonight.",
          "chapter": 2
        }
      ]
    }
  },
  "contacts": [
    {
      "id": "elena",
      "name": "Elena Vasilescu",
      "label": "Sister",
      "number": "0740 016 214"
    },
    {
      "id": "mara",
      "name": "Mara Ionescu",
      "label": "Friend / sound editor",
      "number": "0740 016 219"
    },
    {
      "id": "adrian",
      "name": "Adrian Popescu",
      "label": "Personal",
      "number": "0740 016 220"
    },
    {
      "id": "julia",
      "name": "Julia Radu",
      "label": "Conservation",
      "number": "0740 016 216"
    },
    {
      "id": "victor",
      "name": "Victor Neagu",
      "label": "Project",
      "number": "0740 016 212"
    },
    {
      "id": "luca",
      "name": "Luca Marin",
      "label": "Delivery contact",
      "number": "0740 016 019"
    }
  ],
  "notes": [
    "note.recipe",
    "note.room",
    "note.review"
  ],
  "mail": [
    {
      "id": "mail.hotel",
      "from": "Hotel Aurelia",
      "subject": "Your listening-room appointment",
      "time": "16 Oct · 11:40",
      "body": "Your private appointment is confirmed for 18 October, 00:23. The studio equipment is in use earlier that evening. The receiving desk retains delivery signatures separately.",
      "attachment": "hotel-receipt",
      "chapter": 2
    },
    {
      "id": "mail.rider",
      "from": "Project liaison",
      "subject": "Signed rider retained",
      "time": "14 Oct · 16:05",
      "body": "The original scope and audit condition are retained. An account of the family must not be substituted for the actual use schedule.",
      "attachment": "rider",
      "chapter": 1
    },
    {
      "id": "mail.trip",
      "from": "RideNow",
      "subject": "Your journey records",
      "time": "18 Oct · 00:53",
      "body": "Your booking receipts are available in this owner-authorised copy. Arrival fields and payment authorisation are retained.",
      "attachment": "trip",
      "chapter": 2
    }
  ],
  "calendar": [
    {
      "day": 14,
      "time": "16:00",
      "title": "Return the rider",
      "text": "Both signatures. Keep a copy.",
      "chapter": 1,
      "source": "calendar.14.1600"
    },
    {
      "day": 17,
      "time": "18:40",
      "title": "Move the room",
      "text": "For a conversation, not a photograph.",
      "chapter": 2,
      "source": "calendar.17.1840"
    },
    {
      "day": 17,
      "time": "22:00",
      "title": "Studio gathering",
      "text": "Eat something first.",
      "chapter": 1,
      "source": "calendar.17.2200"
    },
    {
      "day": 18,
      "time": "00:23",
      "title": "Listening room",
      "text": "Hotel Aurelia. Julia has the second chair.",
      "chapter": 2,
      "source": "calendar.18.0023"
    },
    {
      "day": 19,
      "time": "10:00",
      "title": "Boxes",
      "text": "Ask Adrian to leave them downstairs.",
      "chapter": 2,
      "source": "calendar.19.1000"
    }
  ],
  "browser": [
    {
      "title": "Saved use schedule",
      "url": "studio.vespera.local/use",
      "text": "The installation use and private family listening permission are distinct. The signed project rider is retained with the liaison.",
      "chapter": 2
    },
    {
      "title": "Aurelia / listening room",
      "url": "aurelia.vespera.local/listening",
      "text": "Private listening room and separate receiving desk. The lobby camera covers the approach, not the room interior.",
      "chapter": 2
    },
    {
      "title": "Repairing a cracked ceramic mug",
      "url": "home-notes.local/ceramics",
      "text": "Do not use repaired vessels for hot drinks unless the repair is food-safe. Iris saved this page twice.",
      "chapter": 1
    }
  ],
  "audio": {
    "briefing": {
      "title": "Duty briefing",
      "chapter": 1,
      "lines": [
        [
          "Captain Pavel",
          "Dima. You are taking the Teilor Street case. Iris Vasilescu was found in her living room yesterday morning. The preliminary report cannot explain the injury as a simple fall. You are not being sent to tidy up someone else’s conclusion. Start with the room. Nadia is waiting downstairs."
        ]
      ]
    },
    "voicemail-elena": {
      "title": "Missed call / Elena",
      "chapter": 1,
      "lines": [
        [
          "Elena",
          "It is me. I know you said not to do the rest of it by message. I am not trying to. Just tell me you are awake. You can be angry afterwards."
        ]
      ]
    },
    "room-note": {
      "title": "A practical answer",
      "chapter": 2,
      "lines": [
        [
          "Iris",
          "I finally moved the sofa. It turns out you can change a room without replacing everything in it. Do not let me make that into a statement for the wall. I mean the chairs can face each other now. That is all."
        ]
      ]
    },
    "slate": {
      "title": "Workshop slate",
      "chapter": 5,
      "morse": "ORCHID",
      "lines": [],
      "description": "Pulse groups: --- / .-. / -.-. / .... / .. / -.. . A dash lasts three short units. Longer gaps separate groups."
    },
    "apartment-reference": {
      "title": "Room reference / clock",
      "chapter": 3,
      "cue": "clock",
      "lines": [],
      "description": "Sound observations: a short tick, another short tick, then a longer pause and a third tick. The pattern repeats."
    },
    "hotel-reference": {
      "title": "Hotel lift reference",
      "chapter": 3,
      "cue": "lift",
      "lines": [],
      "description": "Sound observations: two bright descending lift chimes, with a short pause between them."
    },
    "reassurance": {
      "title": "Retained reassurance / original",
      "chapter": 5,
      "need": "original-message",
      "cue": "clock",
      "lines": [
        [
          "Unknown voice",
          "She is settled now. She does not want an ambulance. Leave it until morning. I will keep the copy here."
        ]
      ],
      "description": "Sound observations: behind the voice, a short tick, a second short tick, a longer pause, and a third tick repeat."
    },
    "room-original": {
      "title": "Room recording / retained source",
      "chapter": 5,
      "lines": [
        [
          "Iris",
          "You can keep it private. But you cannot keep calling it my choice."
        ],
        [
          "Julia",
          "I cannot let them hear it like that."
        ],
        [
          "Iris",
          "Them, or me? We can say what we did without handing her whole life to strangers."
        ]
      ],
      "need": "original-message"
    },
    "family-fragment": {
      "title": "A small announcement",
      "chapter": 1,
      "lines": [
        [
          "Ana",
          "Then announce that the potatoes are ready. And stop both of you making that face at me."
        ],
        [
          "Elena",
          "Nobody can hear a face."
        ],
        [
          "Ana",
          "I can."
        ]
      ]
    },
    "assembly": {
      "title": "Delivered listening extract",
      "chapter": 4,
      "lines": [
        [
          "Ana",
          "Leave the light on."
        ],
        [
          "Ana",
          "I am not angry with you."
        ],
        [
          "Ana",
          "Stop the recorder for a minute."
        ]
      ]
    },
    "apology": {
      "title": "A private ending",
      "chapter": 9,
      "lines": [
        [
          "Iris",
          "I keep trying to find the right version. There was a good evening. There was an argument. You were there. I was there. I do not want to choose which one gets to have happened."
        ]
      ]
    }
  },
  "chapters": [
    {
      "id": 1,
      "title": "The room left behind",
      "objective": "Inspect the living room, recover Iris’s phone and compare the room with an earlier personal photograph.",
      "requires": [
        "room"
      ],
      "location": "apartment",
      "response": "We know that the arrangement changed. We do not yet know when. The phone belongs to a person, not to a theory. Start there."
    },
    {
      "id": 2,
      "title": "A life in the device",
      "objective": "Establish the last documented journey and recover the original queued photograph.",
      "requires": [
        "journey",
        "recovery",
        "preparation"
      ],
      "location": "apartment",
      "response": "The room was prepared before the death. That makes the empty place on the shelf a different question."
    },
    {
      "id": 3,
      "title": "The minutes between",
      "objective": "Calibrate the hotel record and test the delivery account against independent sources.",
      "requires": [
        "camera",
        "trace"
      ],
      "location": "hotel",
      "response": "A possible interval is not an identity. The sealed delivery has a recipient. Ask for the copy that recipient kept."
    },
    {
      "id": 4,
      "title": "The kind version",
      "objective": "Compare permissions, retained versions and the two intended recipients.",
      "requires": [
        "permission",
        "versions"
      ],
      "location": "archive",
      "response": "A kind version can be real and incomplete. So can a person’s account of why they made it."
    },
    {
      "id": 5,
      "title": "The box that kept both",
      "objective": "Follow the workshop slate into the source index and open the retained case.",
      "requires": [
        "slate",
        "mechanism",
        "delivery"
      ],
      "location": "archive",
      "response": "The later sound was an earlier recording. The room’s silence can no longer be filled with that voice."
    },
    {
      "id": 6,
      "title": "Accounts of the night",
      "objective": "Test the omitted accounts and the building’s actual circulation.",
      "requires": [
        "accounts",
        "plan"
      ],
      "location": "archive",
      "response": "The routes tell us what was possible. The original accounts tell us what somebody needed us to believe."
    },
    {
      "id": 7,
      "title": "What the room can say",
      "objective": "Compare the recovered object, original communications and independently retained custody records.",
      "requires": [
        "sound",
        "physical"
      ],
      "location": "apartment",
      "response": "Contact, time and responsibility are different claims. The case needs all three to be supported."
    },
    {
      "id": 8,
      "title": "A case, not a story",
      "objective": "Build a defensible account from independent sources and choose what belongs in the public record.",
      "requires": [
        "case"
      ],
      "location": "station",
      "response": "The evidence can support a case without giving us permission to use every private thing we found."
    },
    {
      "id": 9,
      "title": "The empty chair",
      "objective": "Present the supported account, hear the response and close the investigation.",
      "requires": [
        "confrontation"
      ],
      "location": "station",
      "response": "The record is complete. A life is not."
    }
  ],
  "puzzles": [
    {
      "id": "room",
      "chapter": 1,
      "title": "What changed in this room?",
      "type": "evidence",
      "prompt": "Retain an observation from the current room and an earlier personal photograph. Keep the finding within what the comparison establishes.",
      "sources": [
        "scene-wide",
        "room-before",
        "scene-table",
        "scene-shelf"
      ],
      "slots": {
        "current": [
          "scene-wide",
          "east"
        ],
        "earlier": [
          "room-before",
          "north"
        ],
        "detail": [
          "scene-shelf",
          "gap"
        ],
        "table": [
          "scene-table",
          "ring"
        ]
      },
      "accounts": {
        "changed": "The arrangement changed; this comparison does not establish who moved it or when.",
        "staged": "The changed arrangement proves that the killer staged the furniture.",
        "same": "The sources show the same arrangement."
      },
      "answer": "changed",
      "hint": "Compare the sofa against the window and shelf. A changed arrangement is an observation; a claim about who changed it needs another source."
    },
    {
      "id": "journey",
      "chapter": 2,
      "title": "The last documented journey",
      "type": "order",
      "prompt": "Use the calendar and independent receipt to reconstruct the night’s documented movement.",
      "sources": [
        "trip",
        "hotel-receipt"
      ],
      "items": {
        "pickup": "Pickup at Atelier Nord",
        "arrival": "Arrival at Hotel Aurelia",
        "appointment": "Listening-room appointment begins",
        "return": "Arrival at 8 Teilor Street"
      },
      "answer": [
        "pickup",
        "arrival",
        "appointment",
        "return"
      ],
      "hint": "Pickup and arrival are different fields. The receiving appointment has its own independently retained time."
    },
    {
      "id": "recovery",
      "chapter": 2,
      "title": "Recover the queued original",
      "type": "code",
      "prompt": "Match the original attachment reference in Mara’s conversation to the queued-media index. Enter the media reference, not an inferred capture time.",
      "sources": [
        "photo-index",
        "msg.mara.9"
      ],
      "answer": "IMG_1906",
      "grant": "recovery",
      "hint": "The message names its attachment. The laboratory index distinguishes capture from the later delivery queue."
    },
    {
      "id": "preparation",
      "chapter": 2,
      "title": "Before the room became a scene",
      "type": "evidence",
      "prompt": "Reconsider the first room comparison using the recovered capture. What can now be dated, and what cannot?",
      "sources": [
        "room-prepared",
        "scene-wide",
        "scene-shelf",
        "shelf-before"
      ],
      "slots": {
        "prepared": [
          "room-prepared",
          "prepared"
        ],
        "scene": [
          "scene-shelf",
          "gap"
        ],
        "object": [
          "shelf-before",
          "bronze"
        ]
      },
      "accounts": {
        "before": "The sofa was moved before the death; the bookend’s later absence remains unexplained.",
        "killer": "The sofa movement identifies the killer.",
        "nothing": "The prepared image makes the shelf difference irrelevant."
      },
      "answer": "before",
      "hint": "Compare both the arrangement and the lower shelf. The recovered source has a verified capture time."
    },
    {
      "id": "camera",
      "chapter": 3,
      "title": "A clock is not an alibi",
      "type": "timing",
      "prompt": "Inspect the retained camera frame, correct its recorder time and compare it with the transport arrival.",
      "sources": [
        "hotel-camera",
        "hotel-clock",
        "trip",
        "hotel-receipt"
      ],
      "answer": {
        "time": "00:23",
        "gap": "2",
        "claim": "possible"
      },
      "hint": "A fast recorder must be corrected backwards. Compare with arrival, not pickup; compatibility alone does not name a person."
    },
    {
      "id": "trace",
      "chapter": 3,
      "title": "A mark beside a case",
      "type": "trace",
      "prompt": "Compare the angled bars and worn corner. Use the independent receiving record to test what the mark can establish.",
      "sources": [
        "trace",
        "hotel-receipt",
        "roster"
      ],
      "answer": {
        "sample": "C",
        "claim": "delivery"
      },
      "hint": "The narrow parallel track belongs to wheels. A compatible sole does not prove a wearer; the receiving signature supplies the delivery context."
    },
    {
      "id": "permission",
      "chapter": 4,
      "title": "Two recipients",
      "type": "evidence",
      "prompt": "Compare the signed use schedule with the independently retained duplicate. Which account fits both?",
      "sources": [
        "rider",
        "routing"
      ],
      "slots": {
        "use": [
          "rider",
          "text"
        ],
        "destination": [
          "routing",
          "text"
        ]
      },
      "accounts": {
        "separate": "Public correction and private family return are separate instructions.",
        "leak": "The packet orders all raw family material to be published.",
        "erase": "The packet orders the originals destroyed."
      },
      "answer": "separate",
      "hint": "A recipient is not automatically a permitted audience. Keep the project and family instructions separate."
    },
    {
      "id": "versions",
      "chapter": 4,
      "title": "What did approval cover?",
      "type": "evidence",
      "prompt": "Match the working reference to the programme input and test its caption against the approval.",
      "sources": [
        "revision",
        "cue",
        "programme"
      ],
      "slots": {
        "approval": [
          "cue",
          "text"
        ],
        "input": [
          "programme",
          "text"
        ],
        "history": [
          "revision",
          "text"
        ]
      },
      "accounts": {
        "scope": "A family listening approval does not authenticate a public claim of continuity.",
        "late": "The edit was first made after the withdrawal.",
        "whole": "Approval of a listening version verifies every later description."
      },
      "answer": "scope",
      "hint": "Read the same version reference in both originals. Then compare the intended audience and the caption, not just the filenames."
    },
    {
      "id": "slate",
      "chapter": 5,
      "title": "Find the reel",
      "type": "morse",
      "prompt": "Listen to the real slate or inspect its equivalent pulse trace. Decode the reel word using the supplied alphabet.",
      "sources": [
        "audio.slate",
        "catalogue"
      ],
      "answer": "ORCHID",
      "hint": "Long gaps separate letters. A dash lasts three short units; do not treat the word as a number."
    },
    {
      "id": "mechanism",
      "chapter": 5,
      "title": "Open the indexed case",
      "type": "lock",
      "prompt": "Use the decoded row’s shelf, drawer and sequence. The fourth wheel records the number of long pulses in the actual slate.",
      "sources": [
        "catalogue",
        "audio.slate"
      ],
      "need": "slate",
      "answer": "4327",
      "grant": "original-message",
      "hint": "Convert the shelf letter with A=1. The catalogue supplies coordinates, not a complete setting. Count the long pulses in the decoded slate."
    },
    {
      "id": "delivery",
      "chapter": 5,
      "title": "A voice delivered later",
      "type": "evidence",
      "prompt": "Compare the continuous source, delivered assembly and provider receipt. What does the later activity represent?",
      "sources": [
        "transfer",
        "source-alignment",
        "audio.assembly"
      ],
      "slots": {
        "provider": [
          "transfer",
          "text"
        ],
        "source": [
          "source-alignment",
          "text"
        ],
        "heard": [
          "audio.assembly",
          "text"
        ]
      },
      "accounts": {
        "retry": "The activity is delivery of an older assembled source, not a new live statement.",
        "live": "Delivery proves the speaker was alive and recording at that time.",
        "none": "An edited source has no usable information."
      },
      "answer": "retry",
      "hint": "A capture, an assembly and a delivery can have different dates. Preserve what each record actually timestamps."
    },
    {
      "id": "accounts",
      "chapter": 6,
      "title": "Secrets are not interchangeable",
      "type": "evidence",
      "prompt": "Compare the omissions with independent purposes and movements before using them as an accusation.",
      "sources": [
        "adrian-account",
        "payment",
        "julia-account"
      ],
      "slots": {
        "personal": [
          "adrian-account",
          "text"
        ],
        "financial": [
          "payment",
          "text"
        ],
        "custodian": [
          "julia-account",
          "text"
        ]
      },
      "accounts": {
        "bounded": "The omissions require correction, but do not substitute for positive evidence of the homicide.",
        "all": "Every concealed fact proves the same intention.",
        "clear": "A private motive makes all statements reliable."
      },
      "answer": "bounded",
      "hint": "A financial purpose and a private separation can be investigated. Neither can take the place of evidence of an act."
    },
    {
      "id": "plan",
      "chapter": 6,
      "title": "What the camera could not see",
      "type": "plan",
      "prompt": "Compare the retained and completed circulation records. Trace a physically available route to the apartment-facing landing outside E1’s sector.",
      "sources": [
        "building-a",
        "building-b",
        "hall-camera"
      ],
      "answer": [
        "service",
        "landing",
        "apartment"
      ],
      "hint": "The camera faces the front entrance. The service connection joins the landing behind it. A route is not an eyewitness."
    },
    {
      "id": "sound",
      "chapter": 7,
      "title": "The place inside the message",
      "type": "audio",
      "prompt": "Compare the actual background sound in the original reassurance with both location references. Use the source descriptions as an accessible equivalent.",
      "sources": [
        "audio.reassurance",
        "audio.apartment-reference",
        "audio.hotel-reference"
      ],
      "answer": "apartment",
      "hint": "Compare the repeating clock rhythm with the two bright lift chimes. The voice and the room are separate observations."
    },
    {
      "id": "physical",
      "chapter": 7,
      "title": "Contact is not a time",
      "type": "evidence",
      "prompt": "Combine the recovered object, injury findings and independent custody/visit records. Do not make a contact impression certify a time.",
      "sources": [
        "object-report",
        "clinical",
        "custody",
        "julia-account"
      ],
      "slots": {
        "object": [
          "object-report",
          "text"
        ],
        "injury": [
          "clinical",
          "text"
        ],
        "independent": [
          "custody",
          "text"
        ],
        "account": [
          "julia-account",
          "text"
        ]
      },
      "accounts": {
        "combined": "The combined sources contradict the custodian’s departure account and support a consequential link to the injury and staging.",
        "print": "A contact impression by itself establishes the time and intention.",
        "accident": "The original departure account is confirmed by an available unseen route."
      },
      "answer": "combined",
      "hint": "Separate the expected old contact with a gift from label layering, the victim’s condition and independently retained later presence."
    },
    {
      "id": "case",
      "chapter": 8,
      "title": "Support the consequential claims",
      "type": "case",
      "prompt": "Select independent support for attribution, the act, the false later-life account and the limits of publication. A persuasive account must not claim more than its sources.",
      "sources": [
        "custody",
        "clinical",
        "object-report",
        "audio.reassurance",
        "transfer",
        "routing",
        "apology"
      ],
      "answer": {
        "person": "julia",
        "act": "physical",
        "later": "retry",
        "privacy": "separate"
      },
      "hint": "Use the positive records of presence and the physical findings together. Delivery is not capture; factual closure is not permission to publish raw family material."
    },
    {
      "id": "confrontation",
      "chapter": 9,
      "title": "The account that remains",
      "type": "confront",
      "prompt": "Present the supported case. Choose how to preserve the family’s private source while the factual record proceeds.",
      "sources": [
        "custody",
        "object-report",
        "audio.reassurance",
        "apology"
      ],
      "answer": "present",
      "hint": "The confrontation does not need a new hidden clue. The consequential claims must already be supported."
    }
  ],
  "interviews": {
    "mara": {
      "name": "Mara Ionescu",
      "role": "Friend / sound editor",
      "chapter": 2,
      "opening": "I was going to make coffee and realised I would ask how she took it. I have known her for sixteen years. There are apparently still ways for the morning to surprise you.",
      "questions": [
        [
          "Tell me about an ordinary day.",
          "We had a café with chairs so uncomfortable nobody could turn lunch into an entire business strategy. She once ordered a sandwich so large I was allowed to discuss structural integrity. I keep remembering her trying not to laugh with a mouth full of bread."
        ],
        [
          "What did you make for the family?",
          "A listening copy. Something Elena could leave playing without bracing for the next sentence. I understood that too well. Later I wanted people to think I had found it, not assembled it."
        ],
        [
          "Did she ask for the original?",
          "Yes. She asked if I had kept the version before we made it kind. I said yes. It is a very small word to remember this often."
        ]
      ],
      "present": {
        "programme": "Nobody made me type original instead of restored. When she stopped defending it, I thought she had abandoned what we made together. I did not ask if she was trying to come back to it honestly.",
        "transfer": "I queued it after the rehearsal. The retry happened without me. Keep the capture and delivery fields separate, even if I wanted them to look simpler.",
        "audio.reassurance": "I heard an adult saying she would stay. I needed that to mean someone was helping. I was not in the room. I did not hear a dispatcher."
      }
    },
    "elena": {
      "name": "Elena Vasilescu",
      "role": "Sister",
      "chapter": 2,
      "opening": "I keep putting two cups out. Then I am furious with myself, as if it is a trick I am playing. You do not need that in your report. I just needed to say it somewhere.",
      "questions": [
        [
          "What did the family recording mean to you?",
          "There is a version I can listen to while I make tea. I know it is not the whole evening. I was there. I wanted one thing that did not make me wait for the argument."
        ],
        [
          "Tell me about the visit.",
          "We argued. I left. I do not have a sentence that makes those facts sound kinder. I thought we could do it tomorrow because she had asked me to keep the recipe cards."
        ],
        [
          "What was she trying to change?",
          "She kept saying we could keep something without saying it happened exactly that way. I heard the first half as a promise and the second as her taking it back."
        ]
      ],
      "present": {
        "room-prepared": "She had moved everything so we could look at each other. I thought she was preparing to win. I did not ask whether she was just trying to sit beside me.",
        "routing": "The personal envelope was for me. That does not mean I am the audience for everyone else’s truth. I understand the distinction better now than I did then."
      }
    },
    "adrian": {
      "name": "Adrian Popescu",
      "role": "Former partner",
      "chapter": 3,
      "opening": "She was exhausted. We had been arguing. I wanted people to know that because it was easier than telling them what we were arguing about.",
      "questions": [
        [
          "Were you separating?",
          "Yes. She asked me to bring boxes. I kept calling it a bad week. That sounded less like a decision she had made without me."
        ],
        [
          "What did you actually see?",
          "I saw her at the gathering. I did not see what happened in the apartment. I should have learned to say the second sentence before I tried to explain the first."
        ]
      ],
      "present": {
        "adrian-account": "Keep that she was leaving me. Keep that I offered the boxes. Those can both stay true. Please do not call the second proof that I was good about the first."
      }
    },
    "victor": {
      "name": "Victor Neagu",
      "role": "Project producer",
      "chapter": 4,
      "opening": "The licensing meeting was real. So was the audit condition. I have spent years making an unfinished thing sound as though it is nearly ready. That does not make every unfinished thing the same.",
      "questions": [
        [
          "Why pressure her over the review?",
          "Because postponement looks different on an invoice. I was afraid of losing the work, and I made that sound like the only responsibility in the room."
        ],
        [
          "What did you conceal?",
          "A family-care payment in a production account. It should not have been there. The receiving provider has the original purpose. You do not have to take my word for it."
        ]
      ],
      "present": {
        "payment": "It is a real concealment. It is not the purpose you first suspected. I know that distinction does not turn it into honesty.",
        "rider": "She asked for somewhere to disagree that was not a room full of guests. We kept inviting guests."
      }
    },
    "luca": {
      "name": "Luca Marin",
      "role": "Courier",
      "chapter": 3,
      "opening": "I signed the receiving copy. Julia kept the seal number. Delivery only. I know that sounds like making myself small, but it is the part I can actually tell you.",
      "questions": [
        [
          "Why leave your shift?",
          "My break allowed it. I did not want my supervisor to turn a lawful delivery into a story about my whole life."
        ],
        [
          "What did you carry?",
          "A sealed case with two rubber wheels. I did not open it. A wheel can leave a mark without becoming another person."
        ]
      ],
      "present": {
        "hotel-receipt": "That is the signature I watched her make. I can tell you who received it. I cannot tell you what they said after I left.",
        "trace": "Those are compatible marks, not a name. The receiving desk supplies something the sole cannot."
      }
    },
    "julia": {
      "name": "Julia Radu",
      "role": "Conservator / source custodian",
      "chapter": 3,
      "opening": "I kept the sources where she asked. I know that sounds like a very small thing to have done for someone. I have built a great deal of my life around believing it is not small.",
      "questions": [
        [
          "What did she ask you to keep?",
          "Both versions. Both names. I thought she was letting someone off. Perhaps she was trying to stop us deciding in advance whose account would survive."
        ],
        [
          "What did you do after the appointment?",
          "I returned to the archive. I supplied my account. I would rather you compare its originals than let me describe them until they sound inevitable."
        ],
        [
          "Why keep an old copy beside a correction?",
          "Because a correction without the earlier copy can become another kind of erasure. Keeping something is not the same as explaining it honestly."
        ]
      ],
      "present": {
        "routing": "She asked if two envelopes could be put together. Then she said that was precisely what she was trying to stop us doing. I understood the instruction. I have no good reason for pretending I did not.",
        "object-report": "That was my label batch. I cannot make that into an innocent fact by telling you I once gave her the bookend. You already know old contact and later action are not the same claim.",
        "custody": "The receiving copy should have been outside my account. That is why there are duplicates. I used to say that as though the rule could only be needed for other people."
      }
    }
  },
  "ending": {
    "intro": "Julia does not look at the photograph first. She looks at the space beside it, where the note about old contact has been kept apart from the later physical findings.",
    "response": "I kept saying I never changed an original. As though that were the whole of what someone had asked me to do. She was trying to ask me to say it with both our names still there. I wanted to be the person who decided how it could be heard. When she would not let me, I hurt her. What I did afterwards was not the room misunderstanding me. It was me.",
    "after": "The factual record is submitted. It does not depend on a final admission. The family source remains separately held under the recorded permission. In the photograph, the chairs face each other. It was an ordinary arrangement, made for a conversation that did not get to be ordinary.",
    "last": "You close the casebook. You do not close the life inside it."
  },
  "morse": {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--.."
  }
};
