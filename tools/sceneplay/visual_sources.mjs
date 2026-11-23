import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

// Record the complete visual recipe, including character helpers and the
// actual speech envelope. A helper change must never reuse older movie frames.
export function visualSources() {
  const root = fileURLToPath(new URL("../../sceneplay/", import.meta.url));
  const files = new Set();
  const visit = (name) => {
    const full = path.resolve(root, name);
    const local = path.relative(root, full).split(path.sep).join("/");
    if (files.has(local)) return;
    if (!full.startsWith(root))
      throw Error("Visual import leaves the game directory.");
    files.add(local);
    if (!local.endsWith(".js")) return;
    const source = fs.readFileSync(full, "utf8");
    for (const match of source.matchAll(
      /(?:from\s+|import\s*\()\s*["']([^"']+)["']/g,
    )) {
      const ref = match[1];
      if (ref === "three") visit("vendor/three.module.js");
      else if (ref.startsWith("."))
        visit(path.relative(root, path.resolve(path.dirname(full), ref)));
    }
  };
  visit("src/world.js");
  visit("assets/models/apartment.glb");
  visit("assets/audio/motion.json");
  return Object.fromEntries(
    [...files].sort().map((name) => [
      name,
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(path.join(root, name)))
        .digest("hex"),
    ]),
  );
}
