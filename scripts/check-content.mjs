import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const sourceRoot = "src";
const sourceExtensions = /\.(astro|ts|tsx|js|jsx|css|mdx)$/;
const required = [
  "Pre-signing policy enforcement for AI-agent payments",
  "Join the waitlist",
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
    if (entry.isFile() && sourceExtensions.test(entry.name)) return [file];
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
let sourceRootError = "";

try {
  files = listFiles(join(root, sourceRoot));
} catch (error) {
  sourceRootError = error instanceof Error ? error.message : String(error);
}

const corpus = files.map((file) => readFileSync(file, "utf8")).join("\n");
const missing = required.filter((text) => !corpus.includes(text));
const bannedHits = findBannedHits(files);

if (sourceRootError || files.length === 0 || missing.length || bannedHits.length) {
  console.error("Content guard failed.");
  if (sourceRootError) {
    console.error(`Could not scan ${sourceRoot}: ${sourceRootError}`);
  } else if (files.length === 0) {
    console.error(`No source files could be scanned under ${sourceRoot}.`);
  }
  if (missing.length) console.error("Missing required copy:", missing);
  if (bannedHits.length) {
    console.error("Banned public-copy matches:");
    for (const hit of bannedHits) {
      console.error(`- ${hit.path}:${hit.line} ${hit.pattern} "${hit.snippet}"`);
    }
  }
  process.exit(1);
}

console.log("Content guard passed.");
