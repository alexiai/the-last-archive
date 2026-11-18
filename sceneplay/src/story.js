// This edition restages the established chronology. It does not share saves or
// silently grant discoveries from the earlier casework edition.
export const STORY = {
  edition: "sceneplay-1",
  title: "The room left behind",
  intro: [
    {
      start: 3,
      end: 14.5,
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Detective Dima? Iris Vasilescu. Thirty-four. Found dead yesterday morning. A head injury the first report cannot explain. The room is yours.",
    },
    {
      start: 15,
      end: 23.5,
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Her sister called twice while we waited. First she asked what had happened. Then she asked if the lamp was still on.",
    },
    {
      start: 25,
      end: 29.5,
      who: "Alex Dima",
      voice: "bm_daniel",
      text: "Leave it on. I will start with the room.",
    },
    {
      start: 31,
      end: 41,
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Nothing has been put back. There is an authorised phone copy on the side table. Take your time. Then tell me what you can actually establish.",
    },
  ],
  dialogue: {
    "question-object": {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "What should the search team be looking for?",
    },
    "question-source": {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Which original gives us the latest known view of it still here?",
    },
    "question-layout": {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Then what do you make of the furniture?",
    },
    "question-limit": {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "And what can that comparison establish? Be precise.",
    },
    welcome: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Iris was found here yesterday. The body is with the examiner. I have kept the room as it was. Start with the room and the phone copy. I will wait on the landing.",
    },
    family: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Elena. Her sister. She asked me to leave the lamp on. I do not think she meant it as evidence.",
    },
    room: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "The photographs were taken before removal. We have not straightened a chair or returned anything to a shelf. That is all I can tell you about the arrangement.",
    },
    hypothesis: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "All right. Show me the difference, and something that tells us when it was already there. A room can change for more than one reason.",
    },
    notYet: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "You have a possibility. I need a comparison. Keep the original image, not just the impression it gives you.",
    },
    wrong: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "That does not agree with the originals you have shown me. Keep looking. We do not need an answer quickly; we need one that holds.",
    },
    bounded: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "There is an interval. Do not turn it into a time of death, or a name. What can the two sources actually establish?",
    },
    finding: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Yes. The earlier original changes the question. I will have the search request written that way. You have kept what the image can prove separate from what it cannot.",
    },
    next: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "The receiving desk at the Aurelia has kept its own records. I will arrange access. Leave this room as it is; we may need to come back to it.",
    },
    hint1: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "Do not start with a person. Start with what is physically different between this room and an original photograph.",
    },
    hint2: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "A photograph can belong to a different day. Check the original capture information before using a changed arrangement to explain the death.",
    },
    hint3: {
      who: "Sergeant Petrescu",
      voice: "bf_alice",
      text: "There is a retained image inside the unsent message. Compare both the furniture and the lower shelf. You can zoom, and use the image description if that is clearer.",
    },
    iris: {
      who: "Iris",
      voice: "bf_emma",
      text: "Do not throw the blue mug out. It only leaks if I put anything in it. And please do not fix it so well that it stops being my mug.",
    },
  },
  phone: {
    messages: [
      {
        id: "elena",
        name: "Elena",
        preview: "You kept it, then.",
        rows: [
          ["17 OCT · 17:42", "Elena", "Is the blue mug still leaking?"],
          ["17 OCT · 17:43", "Iris", "Only if I put liquid in it."],
          ["17 OCT · 17:43", "Elena", "You kept it, then."],
          [
            "17 OCT · 17:44",
            "Iris",
            "It has earned its place. Unlike the plant.",
          ],
        ],
      },
      {
        id: "mara",
        name: "Mara",
        preview: "The Aurelia kept the late appointment.",
        rows: [
          [
            "17 OCT · 18:37",
            "Mara",
            "The Aurelia kept the late appointment. Please eat something first.",
          ],
          ["17 OCT · 18:39", "Iris", "There is bread. That counts."],
          ["17 OCT · 19:06", "Iris", "[Attachment queued — not sent]"],
        ],
      },
    ],
    photos: [
      {
        id: "before",
        title: "Sunday light",
        date: "12 October 2025 · 18:14",
        file: "assets/photos/before.jpg",
      },
      {
        id: "window",
        title: "Morning",
        date: "9 October 2025 · 08:12",
        file: "assets/photos/window.jpg",
      },
    ],
    queued: {
      id: "queued",
      title: "Unsent attachment",
      date: "17 October 2025 · 19:06",
      file: "assets/photos/prepared.jpg",
      metadata:
        "Original capture: 17 October 2025, 19:06\nMessage queue: pending / no delivery receipt\nDevice clock: independently verified\nLinked draft: Aurelia / late listening review\nA queue or retry time is not the capture time.",
    },
  },
};
