# Asset prompts (for external image generation)

The 23 photograph files and all eight portrait/mark slots are now installed locally. The following existing production descriptions remain the visual reference. Five optional recording slots remain unfilled. Run `node audit_assets.js` to verify actual file dimensions and availability.

Do not bake readable text, timestamps or metadata into any image; the game draws metadata in HTML.

## 1. Character portraits

File: `assets/portraits/<id>.png`, 512 x 512 px minimum 256 x 256, PNG, square, subject centred. The game crops them to a circle, so keep the face inside the central 70%.

Shared portrait prompt prefix (use for all seven, keep the same seed family or a style reference image so the cast looks like one shoot):
"Editorial head-and-shoulders portrait photograph, soft directional window light from the left, neutral charcoal-grey seamless background (#2a2d30), desaturated colour grade, subtle film grain, 85mm lens, shallow depth of field, natural skin texture, relaxed neutral-to-serious expression, shoulders square to camera, no jewellery except as described, no text, no watermark."
Portrait negative prompt: "text, watermark, smiling broadly, heavy retouching, plastic skin, illustration, cartoon, 3d render, extra people, hands in frame, busy background, colour cast, neon."
Consistency rule: if the tool supports it, create each person once, keep the chosen image as the reference for any later variants. Do not reuse real people's photographs or celebrity likenesses.

| Filename | Size | Subject description (append to the prefix) |
|---|---|---|
| assets/portraits/adrian.png | 512 x 512 | Man, about 30. Short dark wavy hair, light stubble, soft brown eyes, a slightly tired half-smile. Grey crew-neck sweater. |
| assets/portraits/mara.png | 512 x 512 | Woman, about 27. Shoulder-length chestnut hair with a loose side parting, warm hazel eyes, small silver hoop earrings, open friendly expression. Dark green knit top. |
| assets/portraits/victor.png | 512 x 512 | Man, about 45. Short greying hair, clean-shaven, strong jaw, composed level gaze. Navy blazer over an open-collar white shirt. |
| assets/portraits/luca.png | 512 x 512 | Man, about 29. Lean face, buzz-cut dark hair, shadows under the eyes, guarded expression. Black work jacket with a small reflective collar tab. |
| assets/portraits/elena.png | 512 x 512 | Woman, about 23. Long straight dark hair, no makeup, direct and slightly defensive look. Oversized beige cardigan. |
| assets/portraits/julia.png | 512 x 512 | Woman, about 26. Short dark-brown bob, round thin-framed glasses, face partly in soft shadow, looking slightly away from camera. Grey blouse. |
| assets/portraits/iris.png | 512 x 512 | Woman, 27. Dark curly hair tied loosely back, olive skin, calm direct gaze with a trace of fatigue. Charcoal turtleneck. |
| assets/portraits/moth.png | 512 x 512 | No face. Abstract symbol: a pale-grey moth silhouette with open wings, drawn as a flat graphic mark centred on a charcoal-grey (#2a2d30) background, faint grain, no text. |

## 2. Photographs (23)

Shared style block (paste at the start of EVERY photograph prompt):
"Candid phone-camera photograph, shot on a recent smartphone, natural available light, slightly desaturated colour grade, subtle film grain, shallow realistic depth of field, cinematic but believable, muted charcoal and warm grey tones with at most one restrained red accent. No text, no letters, no numbers, no signage, no watermark, no timestamp overlay, no borders, no neon, no cartoon or illustration look, no HDR glow." 
Shared negative prompt: "text, captions, watermark, logo, signature, timestamp, UI overlay, neon colours, cartoon, illustration, 3d render, oversaturated, extra fingers, distorted faces, deformed hands, duplicate people, stock-photo posing, heavy bokeh, lens flare, HDR."
Output: 1200 x 640 px (aspect 15:8), JPEG quality 85, saved as assets/photos/<ID>.jpg. Generate at 2400 x 1280 and downscale if the tool allows.

The first five already exist in the game as drawn placeholders; keep their established meaning. All times are rendered by the game, not the image.

| ID | File | Chapter | Description and scene-specific prompt (append to the shared style block) |
|---|---|---|---|
| E3 | assets/photos/E3.jpg | 1 | Hotel corridor: Narrow hotel corridor at night, warm sconces, patterned carpet. A man in a grey jacket seen only from behind, mid-stride, face not visible. Slightly tilted, taken quickly from a distance. |
| E4 | assets/photos/E4.jpg | 1 | Party table: A party table seen from a seated height: glasses, bottles, candle stubs. A grey jacket is draped over the back of one chair at the edge of the frame. Warm dim venue lighting. No faces. |
| H1 | assets/photos/H1.jpg | 4 | Kitchen counter: A kitchen counter in evening light with a small closed cardboard tea box and one empty drinking glass. Plain, domestic, slightly tidy. |
| H2 | assets/photos/H2.jpg | 4 | Party table (copy): A variant of E4: identical scene, framing and lighting, but the chair at the edge of the frame has nothing on it. Generate E4 first and use it as the reference. |
| T1 | assets/photos/T1.jpg | 5 | Coat-check ticket 17: Close-up of a hand holding a small cardboard cloakroom ticket between two fingers, venue lighting blurred behind. The ticket shows no readable number (the game states it). |
| P01 | assets/photos/P01.jpg | 1 (optional) | Living room: A quiet living room in evening light, a sofa and a floor lamp |
| P02 | assets/photos/P02.jpg | 1 (optional) | Studio desk: A cluttered desk with a laptop, a notebook and a half-finished coffee |
| P03 | assets/photos/P03.jpg | 1 (optional) | Kitchen window: Morning light through a kitchen window over rooftops |
| P04 | assets/photos/P04.jpg | 2 (optional) | Dinner: Two glasses and a candle on a restaurant table, a man's hand at the edge of frame |
| P05 | assets/photos/P05.jpg | 2 (optional) | Flat hallway: An old apartment hallway with a coat stand and worn floor tiles |
| P06 | assets/photos/P06.jpg | 2 (optional) | Selfie: Two women laughing in a park, autumn light |
| P14 | assets/photos/P14.jpg | 2 (optional) | Studio team: Five colleagues around a studio table, seen from across the room |
| P15 | assets/photos/P15.jpg | 2 (optional) | Wrapped gift: A small wrapped gift with plain string on a wooden table |
| P07 | assets/photos/P07.jpg | 3 (optional) | Venue entrance: The lit entrance of a converted industrial venue at night |
| P08 | assets/photos/P08.jpg | 3 (optional) | Bar: A dim bar with bottles and warm lights, a few guests blurred |
| P09 | assets/photos/P09.jpg | 3 (optional) | Dance floor: A crowded dance floor, motion-blurred figures under low light |
| P10 | assets/photos/P10.jpg | 3 (optional) | Hotel exterior: A hotel front at night, a single lit sign and wet pavement |
| P11 | assets/photos/P11.jpg | 3 (optional) | Hotel lobby: A small hotel lobby, an empty reception desk under a lamp |
| P12 | assets/photos/P12.jpg | 3 (optional) | Hotel street: A quiet side street at night with parked cars and one passing taxi |
| P16 | assets/photos/P16.jpg | 1 (optional) | Sofa and lamp: A sofa with a folded blanket and a lit lamp, evening |
| P17 | assets/photos/P17.jpg | 1 (optional) | Bookshelf: A full bookshelf with a few objects and a small plant |
| P18 | assets/photos/P18.jpg | 1 (optional) | Balcony: A narrow balcony with potted plants in morning light |
| P13 | assets/photos/P13.jpg | 4 (optional) | Building entrance: A residential building entrance at night, the door lit by the intercom panel |

### Reference descriptions for recurring subjects
The flat/apartment (P01, P03, P16, P17, P18, H1, P13) is one home: warm, lived-in, mid-century lamp, olive-green sofa with a folded grey blanket, tall bookshelf, narrow balcony with potted plants, a kitchen with a window over rooftops. Keep the same objects and palette across these shots. The venue (P07, P08, P09, E4, T1) is one converted industrial hall: exposed brick, steel beams, warm string lights. The hotel (P10, P11, P12, E3) is one small three-star hotel: patterned carpet, brass fittings, one lit vertical sign. Do not depict any person's face clearly in P04, P06, P09 or P14.

## 3. Audio (optional, 5 clips)

File: `assets/audio/<id>.mp3`, mono, 96 kbps, 44.1 kHz. If a file is missing the game uses synthesized speech and shows the full transcript. Transcripts are in the game's Audio app and in `story.js`; record them exactly. Add room ambience under each line at about -24 dB.

| ID | Length | Voices and ambience |
|---|---|---|
| a1 | about 12 s | Loud party music and crowd. A man's voice, polite and a little urgent; a woman answers quietly and firmly. A phone rings and is cut off. |
| a2 | about 10 s | A woman, hurried, close to the phone, low voice, slight echo of an office corridor. |
| a3 | about 6 s | A warm, friendly woman's voice, casual, walking outdoors. |
| a4 | 7 s | A man outdoors at night, wind and distant traffic, voice tense and low. |
| a5 | about 15 s | Quiet domestic interior with soft household sounds. Two women's voices, close and low. |
