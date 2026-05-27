/**
 * Prefixes file-level // comments with "" for reassessment greps.
 * Skips eslint directives and decorative learnings dividers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipDirs = new Set(["node_modules", ".next", "generated"]);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|py|prisma)$/.test(ent.name)) files.push(full);
  }
  return files;
}

function prefixFileHeader(content) {
  const lines = content.split("\n");
  let i = 0;
  if (lines[0]?.match(/^["']use (client|server)["'];?\s*$/)) i = 1;
  while (i < lines.length && lines[i].trim() === "") i++;

  if (i >= lines.length) return content;

  const line = lines[i];
  if (!line.startsWith("//")) return content;
  if (line.includes("")) return content;
  if (line.includes("eslint-disable")) return content;
  if (line.includes("────")) return content;

  lines[i] = line.replace(/^\/\/\s?/, "// ");
  return lines.join("\n");
}

let updated = 0;
const targets = [
  ...walk(path.join(root, "src")),
  ...walk(path.join(root, "scripts")).filter((f) => !f.endsWith("normalize-comments.mjs")),
  path.join(root, "next.config.ts"),
  path.join(root, "prisma.config.ts"),
  path.join(root, "sentry.server.config.ts"),
  path.join(root, "sentry.edge.config.ts"),
  path.join(root, "prisma", "schema.prisma"),
  path.join(root, "chatterbox_tts.py"),
].filter((f) => fs.existsSync(f));

for (const file of targets) {
  const original = fs.readFileSync(file, "utf8");
  let next = prefixFileHeader(original);
  if (file.endsWith(".py")) {
    next = next.replace(
      /^(# )(?!)(.+)$/gm,
      "# $2",
    );
  }
  if (next !== original) {
    fs.writeFileSync(file, next, "utf8");
    updated++;
  }
}

console.log(JSON.stringify({ updated, total: targets.length }, null, 2));
