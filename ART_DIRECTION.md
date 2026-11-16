# After-hours archive desk

## Why the first pass felt generic

The rail, device, status counts and notebook made a predictable three-column application shell. Identical panel shapes and app icons carried more visual weight than the evidence. Most media occupied the same narrow column. Board items had the same silhouette and showed summaries rather than the actual communications. Changing colour or corner radius could not resolve those composition problems.

## A different visual grammar

The investigation now occupies a dark, textured work surface. The archive opens as a photographic cover and typeset contents page rather than a dashboard. Device records stay intimate; the player's investigation tools expand onto the desk. The layout, material and reading rhythm change with the object being examined.

- Opening: a street photograph, large offset title and an incoming message presented as a separate object.
- Archive index: a living-room photograph and editorial contents, with direct access to every unlocked application and investigation tool.
- Messages and calls: a close device viewport; on desktop, a separate photographic print and working notes establish the surrounding desk.
- Gallery: an asymmetric contact sheet with varied crops and loose-print edges, rather than equal thumbnail cards.
- Inspection: the photograph occupies the work surface, with a separate metadata margin, gesture inspection and keyboard zoom. Original drawn fallbacks are hidden after the real photograph loads.
- Documents and correspondence: paper-coloured reading surfaces, typeset headers, receipts and exports; subject, metadata and body have different hierarchies.
- Interviews: a large portrait beside the existing words and response choices. On mobile, the portrait leads into the transcript and choices. No dialogue is changed.
- Evidence board: photographic prints, message excerpts, document fragments, tape, slight deterministic rotations, player annotations and validated relationship threads. New pins form a loose composition; existing saved positions remain intact. Focus mode expands the board to the viewport and exits with a button or Escape.
- Audio: a tape-recorder treatment with complete transcripts. This remains explicitly labelled synthesized assistance when recordings are absent.
- Notebook and timeline: ruled notes and chronological paper records; missing data and undated evidence retain their explicit uncertainty.
- Chapters and ending: typographic chapter slates and a quieter long-form epilogue.

The warm paper, olive-black surface, archival numbering and occasional oxide-red markings connect these media without forcing them into one component layout. Grain is a small procedural interface texture. Existing local photography supplies all narrative imagery; no random stock or additional story assets were introduced.

## Implementation boundaries

`art-direction.js` composes the existing renderers and adds presentation interactions. `art-direction.css` defines the materials and responsive compositions. Both are included by the static deployment allowlist. Narrative data, the core engine, answers, evidence IDs and the v2 save schema are unchanged.

All existing routes, collection actions, dialogue choices, puzzles, hints, branching choices, board gestures and saves remain available. Focus mode is ephemeral UI state. Device records and archive objects each adapt to mobile instead of shrinking the desktop arrangement. Reduced-motion preferences disable the camera-cut transitions.

## Review

[Visual previews](docs/previews/README.md) show actual rendered screens from the opening chapter. They are development documentation and are excluded from the deployed site.
