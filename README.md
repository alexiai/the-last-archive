Private test suites (they contain story answers, so they are kept out of the public folder).
jsdom suites (need `npm i jsdom`): node t.js t2.js t3.js t5.js t6.js t7.js t8.js t9.js prog.js
Real browser suites (need `npm i @sparticuz/chromium puppeteer-core`): node b4.js (full finale through the UI), node b6.js (viewports, board gestures, keyboard, Back, storage failures, subdirectory + installed assets; start `python3 -m http.server 8765` in a folder that holds a copy of the project at /repo/ with test fixtures first).
