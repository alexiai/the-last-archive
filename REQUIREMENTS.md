# Requirements tracker (contains no story content). Updated after stage 8.

## Actual content counts (target in brackets)
Chapters: 9 [8-9, met]. Conversation threads: 25 (individual and group, some recovered), 82 messages [25-35 threads, met]. Photograph records: 23, **0 real image files** [20-30 actual photographs: NOT MET; records, alt text and loading are done, files are missing]. Portraits: 8 expected, **0 files** [NOT MET]. Emails: 8; files and documents: 13 [10-15 met]. Audio clips: 5 as synthesized speech with transcripts, 0 recordings [5-7 recordings: NOT MET; clips exist]. Puzzles: 17 across 5 types [15-20, met]. Interviews: 7 [6-7, met]. Decisions: 3. Evidence items: 86 (17 optional). Validated connections: 78. Major revelations: 3.

## Playtime
Not measured with a human. Estimate from content: about 5,800 words of readable text (roughly 29 minutes at 200 words per minute if every item is read), 17 puzzles at 1-3 minutes each, plus exploration, the map and the board. A focused first-time player: roughly 50-80 minutes. Treat this as an estimate only.

## Implemented this stage
Strict save validation (decisions checked against real ids and option indexes, unknown puzzles/nodes dropped, duplicates removed, connections rebuilt from story data, derived flags repaired, hint levels and board positions validated, blocked or full storage handled with a visible notice); per-puzzle hint levels persisted; strict case-file rules (every item relevant to its part, one distinct item per required group, no duplicates, no extras, count enforced, feedback that names no answers); puzzle p16 reconciled with its time interval and evidence; 17 more conversation threads and 17 optional evidence items with checked links; 18 more photograph records; visual board with draggable nodes, pan, zoom, pinch, saved positions, proved/plausible line styles with non-colour markers, and a list alternative; documents styled as receipts, logs, statements and tables; email-style message view; audio file support with honest fallback; keyboard focus rings and 44px touch targets; Back button stays inside the game.

## Not done
Real portraits, photographs and recordings (prompt pack ready). Human playtest. Real iOS Safari and real-device testing. Live GitHub Pages deployment check. Scanned-document image variants. The audio clips remain synthesized speech unless recordings are added.

## Known limits
Pinch, drag and Back behaviour were tested with Chromium touch emulation, not on physical devices. Speech playback depends on the device's voices. The map has five locations.
