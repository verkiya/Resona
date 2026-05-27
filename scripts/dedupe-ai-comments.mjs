import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = ["src", "prisma", "scripts"].map((d) => path.join(root, d));
const files = [path.join(root, "chatterbox_tts.py")];

function walk(p, acc = []) {
  if (!fs.existsSync(p)) return acc;
  if (fs.statSync(p).isFile()) {
    if (/\.(ts|tsx|prisma|mjs|py)$/.test(p)) acc.push(p);
    return acc;
  }
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "generated") continue;
    walk(path.join(p, e.name), acc);
  }
  return acc;
}

const all = [...new Set([...dirs.flatMap((d) => walk(d)), ...files])];
const re = /(?:)+/g;
let n = 0;

for (const file of all) {
  const text = fs.readFileSync(file, "utf8");
  if (!re.test(text)) continue;
  fs.writeFileSync(file, text.replace(re, ""), "utf8");
  n++;
}

console.log({ dedupedFiles: n });
