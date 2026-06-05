import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const distRoot = "dist";
const publicTextExtensions = /\.(html|js|css|txt)$/;
const required = [
  "<h1",
  "Pre-signing policy enforcement for AI-agent payments",
  "Join the waitlist",
  "agent intent",
  "policy gateway",
  "signed payment",
  "ALLOW",
  "BLOCK",
  "REQUIRE_APPROVAL",
  "Stellar",
];
const banned = [
  /\bInstawards?\b/i,
  /\bgrant(s|ed|ing)?\b/i,
  /\bfunding\b/i,
  /\bbudget\b/i,
  /\b30[- ]day\b/i,
  /\b30 days\b/i,
  /\bapply for\b/i,
];

function displayPath(abs) {
  return relative(root, abs).replaceAll("\\", "/");
}

function listFiles(abs) {
  return readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const file = join(abs, entry.name);
    if (entry.isDirectory()) return listFiles(file);
    if (entry.isFile() && publicTextExtensions.test(entry.name)) return [file];
    return [];
  });
}

function snippet(line, matchIndex, matchLength) {
  const start = Math.max(0, matchIndex - 48);
  const end = Math.min(line.length, matchIndex + matchLength + 48);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < line.length ? "..." : "";
  return `${prefix}${line.slice(start, end).trim()}${suffix}`;
}

function findBannedHits(files) {
  return files.flatMap((file) => {
    const text = readFileSync(file, "utf8");
    return text.split(/\r?\n/).flatMap((line, index) =>
      banned.flatMap((pattern) => {
        const match = line.match(pattern);
        if (!match || match.index === undefined) return [];
        return [
          {
            path: displayPath(file),
            line: index + 1,
            pattern: pattern.toString(),
            snippet: snippet(line, match.index, match[0].length),
          },
        ];
      }),
    );
  });
}

let files = [];

try {
  files = listFiles(join(root, distRoot));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Build output guard failed. Could not scan ${distRoot}: ${message}`);
  process.exit(1);
}

const corpus = files.map((file) => readFileSync(file, "utf8")).join("\n");
const missing = required.filter((text) => !corpus.includes(text));
const bannedHits = findBannedHits(files);

if (files.length === 0 || missing.length || bannedHits.length) {
  console.error("Build output guard failed.");
  if (files.length === 0) console.error(`No public text files could be scanned under ${distRoot}.`);
  if (missing.length) console.error("Missing output:", missing);
  if (bannedHits.length) {
    console.error("Banned output matches:");
    for (const hit of bannedHits) {
      console.error(`- ${hit.path}:${hit.line} ${hit.pattern} "${hit.snippet}"`);
    }
  }
  process.exit(1);
}

console.log("Build output guard passed.");
