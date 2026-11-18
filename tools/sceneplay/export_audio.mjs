import fs from "node:fs";
import { STORY } from "../../sceneplay/src/story.js";
const jobs = [
  ...STORY.intro.map((line, i) => ({ id: "intro-" + i, ...line })),
  ...Object.entries(STORY.dialogue).map(([id, line]) => ({ id, ...line })),
];
fs.writeFileSync(
  new URL("./audio-jobs.json", import.meta.url),
  JSON.stringify(jobs, null, 2),
);
