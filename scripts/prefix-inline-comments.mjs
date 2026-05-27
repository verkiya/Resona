import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = ["src"].map((p) => path.join(root, p));
const skipFiles = new Set([
  path.join(root, "src/app/learnings/page.tsx"),
]);

function walk(p, acc = []) {
  if (!fs.existsSync(p)) return acc;
  if (fs.statSync(p).isFile()) {
    if (/\.(ts|tsx)$/.test(p)) acc.push(p);
    return acc;
  }
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "generated") continue;
    walk(path.join(p, e.name), acc);
  }
  return acc;
}

let n = 0;
for (const file of targets.flatMap((t) => walk(t))) {
  if (skipFiles.has(file)) continue;
  const raw = fs.readFileSync(file, "utf8").split("\n");
  const lines = raw.map((line) => line.replace(/\r$/, ""));
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)\/\/\s*(?!)(.*)$/);
    if (!m) continue;
    const body = m[2].trim();
    if (
      !body ||
      body.startsWith("") ||
      body.startsWith("@") ||
      body.startsWith("eslint") ||
      body.startsWith("prettier")
    ) {
      continue;
    }
    lines[i] = `${m[1]}// ${body}`;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, lines.join("\n"), "utf8");
    n++;
  }
}
console.log({ inlineUpdated: n });
