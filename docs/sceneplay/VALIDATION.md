# Scene-led development opening — spoiler-free status

The new edition replaces the investigation-hub entry with an animated arrival, an embodied supporting character and a real-time explorable room. It does not claim that the entire campaign has been rebuilt. The first section has a completed authored investigation and a transition to the next enquiry.

## Implemented

A real original 3D film uses moving perspective cameras, a staged animated character and opening door. It shares geometry with the live scene and original phone photographs. Spoken English dialogue, an original score and environmental sound lead into play at the film’s closing viewpoint. Inline playback, mute, captions, transcript and a reduced-motion path are supported.

The player looks around, approaches objects and moves between connected places. Routes avoid furniture, walls block targeting and navigation assistance provides a keyboard/touch alternative. Close examinations support leaning around the same original rather than opening a category page. Phone, notebook and dialogue are carried/encountered tools. The first supported finding depends on actually retained original-source observations and is tested in an authored conversation.

The lower-left four-arrow pad supports continuous camera-relative walking and sideways steps. A second finger can look around or pause while the first holds a direction. Release, cancellation, lost capture, focus loss, rotation and modal transitions clear input. Keyboard WASD and focused-arrow Space/Enter holds are also supported. Collision uses body footprints, swept short steps and the visible open door's angle. Furniture blocks walking below eye height. Guided travel uses shorter transitions and a direct path when the floor is clear. Optional validated free poses preserve actual walked positions and heading without resetting older saves.

The scene’s current and earlier versions share named geometry. Earlier photographs omit police markers, the officer and the camera phone itself. Current sealing does not move the original phone. Metadata and visual observations remain separate; a source mark is not automatically treated as a conclusion. An earlier interpretation can be reconsidered using a newly discovered original.

Fixed room geometry is combined by material for rendering, while walkable surfaces, source objects, evidence markers and movable furniture keep their separate roles. The character’s proportions use the live world’s vertical axis. The room includes its fourth wall and Iris’s ordinary listening workspace. The film and personal photographs are re-rendered from that same complete world.

## Verification

Logic checks cover all 81 proposed interpretation combinations, required-source dependencies, save reconstruction, rejected foreign backups and preservation of earlier save keys. Finished voice scripts and photograph mark coordinates are checked against source data. Media checks verify the film’s duration, frame count, distinct rendered frames, codec, shared model and the complete visual recipe, including the character module and speech envelopes.

The new original officer has linked arms, fingers and notebook, integrated facial geometry, blinking, breathing and restrained speech motion sampled from the actual recordings. Movement uses a smoother arrival curve and close inspections ease their magnification. The door pose is a function of cinematic time, independent of the order in which shots are captured. Pose checks compare out-of-order renders; speech checks cover clip hashes, silence boundaries and envelope interpolation. This does not establish accurate phoneme synchronization or final character-art quality.

The controller pass refines the officer's neck, shoulder, jacket, face, hair and notebook-grip proportions. Fixed actor details and set dressing are combined where their transforms and materials permit it. The dialogue panel and live camera reframe together in portrait and landscape, including rotation during conversation; the face remains above or beside the scrollable choices. Live HUD and dialogue surfaces no longer apply backdrop blur to the moving world.

The phone contains fifteen authored messages and four retained draft/deleted notes. Notes keep their own source and save context. Their creation fields are not deletion times. The recording display follows actual playback and stops with it. The private source matrix, character vault, chronology journal and Twine authoring graph retain later-source release limits; they do not ship in the playable build. Autopsy gameplay and later scenes remain unimplemented.

36 browser-route checks use actual rendered-world pointing and visible floor taps, look/movement and close-inspection controls, not direct calls to the finding function. They cover the room, phone, original image inspection, source retention, notebook, reload, conversation and first-section conclusion on desktop and mobile-sized layouts. Four native-touch checks cover camera drag, image pinch, metadata, landscape controls and input focus. Seven packaged-delivery checks cover the committed runtime, real video playback, transcript, local-only requests, cached world, save and offline video ranges.

Additional presentation checks cover full-frame portrait cinema, readable captions and controls, 44-pixel touch targets, phone-note restoration, real recording progress and notebook input focus on desktop, portrait and landscape layouts. Physical paper and carried-device styling use the supplied references' restrained ink, warm fibre tones, dark hardware and limited red marks. Reduced-motion media preferences suppress interface entrance animation.

Controller verification uses native held touch input, simultaneous look/walk, wall and low-table collisions, input lifecycle stops, tool return, reload, keyboard focus changes and guided navigation. Timing is measured within the page between delivered input events, separately from browser-automation round trips. A new guided walk starts immediately rather than inheriting time spent in the navigation menu; an already active walk still resumes correctly after a pause. Progress interpolation is bounded so a future start time cannot move the camera backward. Software-rendered browser frame diagnostics are development measurements and do not certify physical iPhone performance.

A composed-preview isolation check exercises the stable production worker and fallback path, both current preview aliases and independent save keys. The publisher reads the stable main snapshot from Git into a temporary directory and asserts production files remain byte-identical except the established preview worker exclusion and its integrity metadata. Only the current edition is built from this branch; legacy runtime copies are absent.

These are authored-solution and technical checks. They do not establish blind puzzle fairness, emotional impact, first-time completion duration, screen-reader usability or physical iPhone Safari performance. No several-hour playtime target is claimed. The character art is an initial original stylized implementation; broader art, performance and the remaining scene-led campaign are unfinished.

## Delivery

All production is local/free. Three.js is vendored under MIT; the deployed runtime is precompiled and integrity-checked so the publisher needs no additional service or browser import map. Only the game, local assets and licence files ship. Blender sources, capture frames, voice models, private narrative staging, tests and development tooling do not ship. The save and cache namespaces remain stable for this edition. Unrelated browser saves are not removed.
