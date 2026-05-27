import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skip = new Set([
  path.join(root, "node_modules"),
  path.join(root, "src", "generated"),
  path.join(root, "scripts", "strip-ai-comment-prefix.mjs"),
  path.join(root, "scripts", "dedupe-ai-comments.mjs"),
  path.join(root, "scripts", "prefix-inline-comments.mjs"),
  path.join(root, "scripts", "normalize-comments.mjs"),
]);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir) || skip.has(dir)) return acc;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (/\.(ts|tsx|js|mjs|py|prisma|md)$/.test(dir)) acc.push(dir);
    return acc;
  }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "generated" || e.name === ".git")
        continue;
      walk(p, acc);
    } else if (/\.(ts|tsx|js|mjs|py|prisma|md)$/.test(e.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const re = /\s*/g;
let n = 0;

for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  if (!re.test(text)) continue;
  fs.writeFileSync(file, text.replace(re, ""), "utf8");
  n++;
}

console.log({ strippedFiles: n });
