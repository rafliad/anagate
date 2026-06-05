# Anagate Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vercel-ready Astro landing page for Anagate using the approved Gateway Console direction.

**Architecture:** Use a static Astro site with a single public page composed from focused `.astro` sections and one shared global stylesheet. Content that repeats across sections lives in a small TypeScript data module so the page reads as structured product storytelling rather than a pile of markup.

**Tech Stack:** Astro, TypeScript, CSS with OKLCH custom properties, vanilla browser JavaScript for the honest waitlist success state, Node built-in test/guard scripts, Vercel static deployment with zero extra adapter configuration.

---

## Source Inputs

- `PRODUCT.md`
- `docs/superpowers/specs/2026-06-05-anagate-landing-page-design.md`
- `C:\Users\RAFLI\Downloads\ChatGPT Image Jun 5, 2026, 06_03_10 PM.png`
- `C:\Users\RAFLI\Downloads\index.html` as prior-page content reference only
- `C:\Users\RAFLI\Downloads\Anagate_SoW.pdf` as private product-context reference only

## File Structure

- Create `package.json`: scripts, Astro dependency, project metadata.
- Create `astro.config.mjs`: static Astro config.
- Create `tsconfig.json`: Astro TypeScript defaults.
- Create `src/env.d.ts`: Astro typing reference.
- Create `src/pages/index.astro`: page composition, metadata, one H1.
- Create `src/content/landing.ts`: navigation, flow, policy controls, decisions, audit rows, builder-context content.
- Create `src/components/SiteHeader.astro`: accessible top navigation.
- Create `src/components/HeroGateway.astro`: logo-led gateway hero and CTAs.
- Create `src/components/ProblemSection.astro`: risk framing without fear copy.
- Create `src/components/GatewayFlow.astro`: intent to policy decision to relayer flow.
- Create `src/components/PolicyInspector.astro`: concrete policy controls.
- Create `src/components/DecisionStates.astro`: ALLOW, BLOCK, REQUIRE_APPROVAL states.
- Create `src/components/AuditTrail.astro`: compact evidence log.
- Create `src/components/BuilderContext.astro`: Stellar builder context.
- Create `src/components/WaitlistCTA.astro`: front-end-only waitlist form with honest success state.
- Create `src/components/SiteFooter.astro`: footer navigation and brand note.
- Create `src/styles/global.css`: tokens, layout system, components, responsive behavior, motion, reduced-motion rules.
- Create `scripts/check-content.mjs`: verifies required page copy and banned public-copy terms.
- Create `scripts/check-build-output.mjs`: verifies built `dist/index.html` contains expected sections and excludes banned copy.
- Copy logo to `public/anagate-logo.png`.

## Task 1: Scaffold Astro Project Metadata

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Create the package manifest**

Write `package.json`:

```json
{
  "name": "anagate-landing",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build && node scripts/check-build-output.mjs",
    "preview": "astro preview",
    "check": "astro check && node scripts/check-content.mjs"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "astro": "^6.0.0",
    "typescript": "^5.9.0"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Create Astro config**

Write `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://anagate.vercel.app",
});
```

- [ ] **Step 3: Create TypeScript config**

Write `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

- [ ] **Step 4: Create Astro env typing file**

Write `src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 5: Install dependencies**

Run:

```powershell
npm install
```

Expected: `node_modules/` and `package-lock.json` are created without dependency resolution errors.

- [ ] **Step 6: Verify scaffold scripts are discoverable**

Run:

```powershell
npm run check
```

Expected: this fails because `scripts/check-content.mjs` does not exist yet. This confirms the next task is the first test guard.

## Task 2: Add Public Copy Guard Tests

**Files:**
- Create: `scripts/check-content.mjs`
- Create: `scripts/check-build-output.mjs`

- [ ] **Step 1: Write the source-content guard**

Create `scripts/check-content.mjs`:

```js
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicSourceDirs = ["src"];
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

function listFiles(abs) {
  return readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const file = join(abs, entry.name);
    if (entry.isDirectory()) return listFiles(file);
    if (entry.isFile() && /\.(astro|ts|js|css)$/.test(entry.name)) return [file];
    return [];
  });
}

const files = publicSourceDirs.flatMap((dir) => {
  try {
    return listFiles(join(root, dir));
  } catch {
    return [];
  }
});

const corpus = files
  .filter((file) => statSync(file).isFile())
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

const missing = required.filter((text) => !corpus.includes(text));
const bannedHits = banned.filter((pattern) => pattern.test(corpus)).map(String);

if (missing.length || bannedHits.length) {
  console.error("Content guard failed.");
  if (missing.length) console.error("Missing required copy:", missing);
  if (bannedHits.length) console.error("Banned public-copy patterns:", bannedHits);
  process.exit(1);
}

console.log("Content guard passed.");
```

- [ ] **Step 2: Write the build-output guard**

Create `scripts/check-build-output.mjs`:

```js
import { readFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
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

const missing = required.filter((text) => !html.includes(text));
const bannedHits = banned.filter((pattern) => pattern.test(html)).map(String);

if (missing.length || bannedHits.length) {
  console.error("Build output guard failed.");
  if (missing.length) console.error("Missing output:", missing);
  if (bannedHits.length) console.error("Banned output patterns:", bannedHits);
  process.exit(1);
}

console.log("Build output guard passed.");
```

- [ ] **Step 3: Run the source-content guard**

Run:

```powershell
npm run check
```

Expected: fail because the Astro page and content data have not been created yet, with missing required copy listed.

## Task 3: Add Logo Asset and Core Content Data

**Files:**
- Create: `public/anagate-logo.png`
- Create: `src/content/landing.ts`

- [ ] **Step 1: Copy the logo into the project**

Run:

```powershell
New-Item -ItemType Directory -Force -Path public
Copy-Item -LiteralPath 'C:\Users\RAFLI\Downloads\ChatGPT Image Jun 5, 2026, 06_03_10 PM.png' -Destination 'public\anagate-logo.png'
```

Expected: `public/anagate-logo.png` exists.

- [ ] **Step 2: Create structured landing content**

Write `src/content/landing.ts`:

```ts
export const navLinks = [
  { href: "#flow", label: "Flow" },
  { href: "#policy", label: "Policy" },
  { href: "#audit", label: "Audit" },
  { href: "#waitlist", label: "Waitlist" },
] as const;

export const flowSteps = [
  {
    label: "agent intent",
    title: "Agent proposes a payment",
    body: "An AI-agent application sends recipient, amount, asset, and purpose before any signing key is touched.",
  },
  {
    label: "policy gateway",
    title: "Anagate evaluates policy",
    body: "The gateway checks status, allowlist, amount cap, and daily spend before returning a decision.",
  },
  {
    label: "signed payment",
    title: "Relayer signs only allowed requests",
    body: "Allowed requests continue to Stellar submission. Blocked and approval-required requests do not execute automatically.",
  },
] as const;

export const policyControls = [
  {
    name: "Agent status",
    value: "active",
    reason: "Suspended agents cannot initiate payment execution.",
  },
  {
    name: "Recipient allowlist",
    value: "matched",
    reason: "Payments only proceed to approved Stellar addresses.",
  },
  {
    name: "Maximum amount",
    value: "50 XLM",
    reason: "Per-transaction caps limit operational blast radius.",
  },
  {
    name: "Daily spending limit",
    value: "240 XLM",
    reason: "Daily controls stop repeated small transfers from becoming one large loss.",
  },
] as const;

export const decisionStates = [
  {
    state: "ALLOW",
    tone: "allow",
    title: "Proceed to signing",
    body: "The request matches policy and can be submitted by the gateway-controlled relayer.",
  },
  {
    state: "BLOCK",
    tone: "block",
    title: "Reject with a reason",
    body: "The request violates policy and never reaches the signing path.",
  },
  {
    state: "REQUIRE_APPROVAL",
    tone: "approval",
    title: "Store as pending",
    body: "The request needs human review and does not execute automatically.",
  },
] as const;

export const auditRows = [
  {
    time: "10:24:18",
    agent: "agent-alpha",
    recipient: "GD7F...K2P9",
    amount: "18 XLM",
    decision: "ALLOW",
    reason: "recipient matched, amount within cap",
    hash: "9c4e...71b0",
  },
  {
    time: "10:26:03",
    agent: "agent-alpha",
    recipient: "GB11...Q8MM",
    amount: "75 XLM",
    decision: "BLOCK",
    reason: "amount exceeds maximum",
    hash: "not submitted",
  },
  {
    time: "10:28:44",
    agent: "agent-alpha",
    recipient: "GAC4...02HD",
    amount: "42 XLM",
    decision: "REQUIRE_APPROVAL",
    reason: "recipient requires review",
    hash: "pending",
  },
] as const;

export const builderPoints = [
  "Built around Stellar payment intent before signing and submission.",
  "Designed for agentic payment flows such as x402 and MPP-style integrations.",
  "A TypeScript client and gateway-controlled relayer give builders a clear integration path.",
] as const;
```

- [ ] **Step 3: Run the source-content guard**

Run:

```powershell
npm run check
```

Expected: still fails because the required H1 and CTA are not present in a rendered page yet. The banned-copy portion should pass.

## Task 4: Build Page Composition and Shared Layout

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create a minimal global stylesheet**

Write the opening tokens and base layout in `src/styles/global.css`:

```css
:root {
  color-scheme: light;
  --bg: oklch(1 0 0);
  --surface: oklch(0.965 0.004 230);
  --surface-strong: oklch(0.925 0.008 230);
  --ink: oklch(0.13 0.006 230);
  --muted: oklch(0.42 0.012 230);
  --line: oklch(0.84 0.01 230);
  --primary: oklch(0.58 0.20 354.5);
  --accent: oklch(0.70 0.14 190);
  --allow: oklch(0.67 0.14 185);
  --block: oklch(0.58 0.18 25);
  --approval: oklch(0.68 0.14 82);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --container: min(1120px, calc(100vw - 32px));
  --font-body: "Aptos", "Segoe UI", system-ui, sans-serif;
  --font-display: "Aptos Display", "Aptos", "Segoe UI", system-ui, sans-serif;
  --font-mono: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.6;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
}

button,
input {
  font: inherit;
}

:focus-visible {
  outline: 3px solid color-mix(in oklch, var(--accent) 74%, white);
  outline-offset: 4px;
}

.page-shell {
  overflow: hidden;
}

.section {
  padding: clamp(72px, 9vw, 132px) 0;
}

.section-inner {
  width: var(--container);
  margin: 0 auto;
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--muted);
  font-size: 0.84rem;
}

.section-kicker::before {
  content: "";
  width: 28px;
  height: 2px;
  background: var(--accent);
}

.section-title {
  max-width: 780px;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 5vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.section-copy {
  max-width: 68ch;
  margin: 22px 0 0;
  color: var(--muted);
  font-size: clamp(1rem, 1.4vw, 1.18rem);
  text-wrap: pretty;
}

.state-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.28rem 0.62rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.state-pill.allow {
  background: color-mix(in oklch, var(--allow) 17%, white);
  color: oklch(0.25 0.08 185);
}

.state-pill.block {
  background: color-mix(in oklch, var(--block) 15%, white);
  color: oklch(0.28 0.11 25);
}

.state-pill.approval {
  background: color-mix(in oklch, var(--approval) 20%, white);
  color: oklch(0.27 0.08 82);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Create site header**

Write `src/components/SiteHeader.astro`:

```astro
---
import { navLinks } from "../content/landing";
---

<header class="site-header">
  <a class="brand-link" href="#top" aria-label="Anagate home">
    <img src="/anagate-logo.png" alt="" width="32" height="32" />
    <span>Anagate</span>
  </a>
  <nav class="site-nav" aria-label="Primary navigation">
    {navLinks.map((link) => <a href={link.href}>{link.label}</a>)}
  </nav>
  <a class="header-cta" href="#waitlist">Join the waitlist</a>
</header>
```

- [ ] **Step 3: Create site footer**

Write `src/components/SiteFooter.astro`:

```astro
---
import { navLinks } from "../content/landing";
---

<footer class="site-footer">
  <div>
    <strong>Anagate</strong>
    <p>Policy enforcement before AI-agent payments reach signing.</p>
  </div>
  <nav aria-label="Footer navigation">
    {navLinks.map((link) => <a href={link.href}>{link.label}</a>)}
  </nav>
</footer>
```

- [ ] **Step 4: Create page composition**

Write `src/pages/index.astro`:

```astro
---
import "../styles/global.css";
import SiteHeader from "../components/SiteHeader.astro";
import SiteFooter from "../components/SiteFooter.astro";
import HeroGateway from "../components/HeroGateway.astro";
import ProblemSection from "../components/ProblemSection.astro";
import GatewayFlow from "../components/GatewayFlow.astro";
import PolicyInspector from "../components/PolicyInspector.astro";
import DecisionStates from "../components/DecisionStates.astro";
import AuditTrail from "../components/AuditTrail.astro";
import BuilderContext from "../components/BuilderContext.astro";
import WaitlistCTA from "../components/WaitlistCTA.astro";

const title = "Anagate | Pre-signing policy enforcement for AI-agent payments";
const description =
  "Anagate evaluates AI-agent payment intent before signing, returning ALLOW, BLOCK, or REQUIRE_APPROVAL for Stellar payment flows.";
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <div class="page-shell" id="top">
      <SiteHeader />
      <main>
        <HeroGateway />
        <ProblemSection />
        <GatewayFlow />
        <PolicyInspector />
        <DecisionStates />
        <AuditTrail />
        <BuilderContext />
        <WaitlistCTA />
      </main>
      <SiteFooter />
    </div>
  </body>
</html>
```

- [ ] **Step 5: Run type check**

Run:

```powershell
npm run check
```

Expected: fail because imported section components do not exist yet.

## Task 5: Build the Gateway Hero

**Files:**
- Create: `src/components/HeroGateway.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the hero component**

Write `src/components/HeroGateway.astro`:

```astro
<section class="hero-gateway" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="hero-kicker">Policy gateway for Stellar builders</p>
    <h1 id="hero-title">Pre-signing policy enforcement for AI-agent payments.</h1>
    <p class="hero-lede">
      Agents submit payment intent. Anagate evaluates policy and returns
      <strong>ALLOW</strong>, <strong>BLOCK</strong>, or <strong>REQUIRE_APPROVAL</strong>
      before any request reaches signing and submission on Stellar.
    </p>
    <div class="hero-actions" aria-label="Primary actions">
      <a class="button-primary" href="#waitlist">Join the waitlist</a>
      <a class="button-secondary" href="#flow">See the flow</a>
    </div>
  </div>

  <div class="gateway-stage" aria-label="Agent intent passes through the Anagate policy gateway before becoming a signed payment">
    <div class="flow-chip intent">agent intent</div>
    <div class="logo-gate" aria-hidden="true">
      <img src="/anagate-logo.png" alt="" width="420" height="420" />
      <span class="gate-beam"></span>
    </div>
    <div class="flow-chip signed">signed payment</div>
  </div>
</section>
```

- [ ] **Step 2: Add hero CSS**

Append to `src/styles/global.css`:

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: var(--container);
  margin: 0 auto;
  padding: 18px 0;
  background: color-mix(in oklch, var(--bg) 88%, transparent);
  backdrop-filter: blur(16px);
}

.brand-link,
.site-nav,
.site-footer nav,
.hero-actions {
  display: flex;
  align-items: center;
}

.brand-link {
  gap: 10px;
  color: var(--ink);
  font-weight: 800;
  text-decoration: none;
}

.brand-link img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.site-nav {
  gap: 24px;
}

.site-nav a,
.site-footer a {
  color: var(--muted);
  font-size: 0.94rem;
  text-decoration: none;
}

.site-nav a:hover,
.site-footer a:hover {
  color: var(--ink);
}

.header-cta,
.button-primary,
.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border-radius: 999px;
  padding: 0 18px;
  font-weight: 800;
  text-decoration: none;
}

.header-cta,
.button-primary {
  background: var(--ink);
  color: white;
}

.button-secondary {
  border: 1px solid var(--line);
  color: var(--ink);
}

.hero-gateway {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
  gap: clamp(36px, 6vw, 84px);
  align-items: center;
  width: var(--container);
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  padding: clamp(56px, 8vw, 112px) 0;
}

.hero-kicker {
  margin: 0 0 18px;
  color: var(--primary);
  font-weight: 800;
}

.hero-copy h1 {
  max-width: 780px;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

.hero-lede {
  max-width: 66ch;
  margin: 24px 0 0;
  color: var(--muted);
  font-size: clamp(1.04rem, 1.5vw, 1.2rem);
  text-wrap: pretty;
}

.hero-actions {
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.gateway-stage {
  position: relative;
  display: grid;
  grid-template-areas:
    "intent"
    "gate"
    "signed";
  place-items: center;
  min-height: 520px;
  isolation: isolate;
}

.gateway-stage::before {
  content: "";
  position: absolute;
  inset: 12%;
  z-index: -1;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(90deg, transparent 49%, color-mix(in oklch, var(--accent) 44%, transparent) 50%, transparent 51%),
    radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 48%);
}

.logo-gate {
  position: relative;
  grid-area: gate;
  width: min(420px, 78vw);
}

.logo-gate img {
  width: 100%;
  height: auto;
  display: block;
  mix-blend-mode: multiply;
}

.gate-beam {
  position: absolute;
  left: 45%;
  top: 46%;
  z-index: -1;
  width: 44%;
  height: 5px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 18px color-mix(in oklch, var(--accent) 65%, transparent);
}

.flow-chip {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  padding: 10px 16px;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
}

.flow-chip.intent {
  grid-area: intent;
}

.flow-chip.signed {
  grid-area: signed;
  border-color: color-mix(in oklch, var(--accent) 60%, var(--line));
}
```

- [ ] **Step 3: Run check**

Run:

```powershell
npm run check
```

Expected: fail only because the remaining section components are missing.

## Task 6: Build Problem, Flow, and Policy Sections

**Files:**
- Create: `src/components/ProblemSection.astro`
- Create: `src/components/GatewayFlow.astro`
- Create: `src/components/PolicyInspector.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the problem section**

Write `src/components/ProblemSection.astro`:

```astro
<section class="section problem-section" aria-labelledby="problem-title">
  <div class="section-inner problem-grid">
    <div>
      <p class="section-kicker">Why the gate exists</p>
      <h2 class="section-title" id="problem-title">Agents should not hold unrestricted wallet authority.</h2>
    </div>
    <div class="problem-copy">
      <p>
        Agentic payments need speed, but direct signing authority turns every prompt, tool call,
        and integration bug into a payment risk. Watching after execution is late by design.
      </p>
      <p>
        Anagate puts policy in front of signing, so automation can move inside boundaries that
        builders can inspect and explain.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create gateway flow**

Write `src/components/GatewayFlow.astro`:

```astro
---
import { flowSteps } from "../content/landing";
---

<section class="section gateway-flow-section" id="flow" aria-labelledby="flow-title">
  <div class="section-inner">
    <p class="section-kicker">The gateway flow</p>
    <h2 class="section-title" id="flow-title">Payment intent becomes a signed transaction only after policy allows it.</h2>
    <div class="flow-lane" role="list">
      {flowSteps.map((step) => (
        <article class="flow-step" role="listitem">
          <span>{step.label}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create policy inspector**

Write `src/components/PolicyInspector.astro`:

```astro
---
import { policyControls } from "../content/landing";
---

<section class="section policy-section" id="policy" aria-labelledby="policy-title">
  <div class="section-inner policy-layout">
    <div>
      <p class="section-kicker">Policy controls</p>
      <h2 class="section-title" id="policy-title">Four checks before a payment can move.</h2>
      <p class="section-copy">
        Each control maps to a reason the gateway can record. The result is a decision that can be
        enforced and explained.
      </p>
    </div>
    <div class="policy-panel" aria-label="Example payment policy">
      {policyControls.map((control) => (
        <div class="policy-row">
          <div>
            <strong>{control.name}</strong>
            <p>{control.reason}</p>
          </div>
          <span>{control.value}</span>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add CSS for these sections**

Append to `src/styles/global.css`:

```css
.problem-section {
  background: var(--surface);
}

.problem-grid,
.policy-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: clamp(32px, 6vw, 76px);
  align-items: start;
}

.problem-copy {
  max-width: 68ch;
  color: var(--muted);
  font-size: 1.08rem;
}

.problem-copy p {
  margin: 0 0 18px;
}

.flow-lane {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 44px;
}

.flow-lane::before {
  content: "";
  position: absolute;
  left: 12%;
  right: 12%;
  top: 34px;
  height: 2px;
  background: linear-gradient(90deg, var(--line), var(--accent), var(--line));
}

.flow-step {
  position: relative;
  padding: 72px 22px 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--bg);
}

.flow-step span {
  position: absolute;
  top: 18px;
  left: 22px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 800;
}

.flow-step h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.flow-step p,
.policy-row p {
  margin: 0;
  color: var(--muted);
}

.policy-section {
  background: linear-gradient(180deg, var(--bg), var(--surface));
}

.policy-panel {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--bg);
  overflow: hidden;
}

.policy-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  padding: 20px;
  border-bottom: 1px solid var(--line);
}

.policy-row:last-child {
  border-bottom: 0;
}

.policy-row span {
  align-self: start;
  border-radius: 999px;
  background: var(--surface);
  padding: 6px 10px;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 800;
}
```

- [ ] **Step 5: Run check**

Run:

```powershell
npm run check
```

Expected: fail only because `DecisionStates.astro`, `AuditTrail.astro`, `BuilderContext.astro`, and `WaitlistCTA.astro` are still missing.

## Task 7: Build Decision, Audit, Builder, and Waitlist Sections

**Files:**
- Create: `src/components/DecisionStates.astro`
- Create: `src/components/AuditTrail.astro`
- Create: `src/components/BuilderContext.astro`
- Create: `src/components/WaitlistCTA.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create decision states section**

Write `src/components/DecisionStates.astro`:

```astro
---
import { decisionStates } from "../content/landing";
---

<section class="section decision-section" aria-labelledby="decision-title">
  <div class="section-inner">
    <p class="section-kicker">Decision states</p>
    <h2 class="section-title" id="decision-title">Three outcomes, each enforceable before signing.</h2>
    <div class="decision-grid">
      {decisionStates.map((decision) => (
        <article class={`decision-panel ${decision.tone}`}>
          <span class={`state-pill ${decision.tone}`}>{decision.state}</span>
          <h3>{decision.title}</h3>
          <p>{decision.body}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create audit trail section**

Write `src/components/AuditTrail.astro`:

```astro
---
import { auditRows } from "../content/landing";
---

<section class="section audit-section" id="audit" aria-labelledby="audit-title">
  <div class="section-inner">
    <p class="section-kicker">Audit trail</p>
    <h2 class="section-title" id="audit-title">Every decision leaves a reason.</h2>
    <p class="section-copy">
      A useful payment guard does more than block requests. It records what happened, why it happened,
      and whether a transaction hash exists.
    </p>
    <div class="audit-table-wrap">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Agent</th>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Decision</th>
            <th>Reason</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          {auditRows.map((row) => (
            <tr>
              <td>{row.time}</td>
              <td>{row.agent}</td>
              <td>{row.recipient}</td>
              <td>{row.amount}</td>
              <td><span class={`state-pill ${row.decision === "ALLOW" ? "allow" : row.decision === "BLOCK" ? "block" : "approval"}`}>{row.decision}</span></td>
              <td>{row.reason}</td>
              <td>{row.hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create builder context section**

Write `src/components/BuilderContext.astro`:

```astro
---
import { builderPoints } from "../content/landing";
---

<section class="section builder-section" aria-labelledby="builder-title">
  <div class="section-inner builder-layout">
    <div>
      <p class="section-kicker">For Stellar builders</p>
      <h2 class="section-title" id="builder-title">Policy infrastructure for agentic payment flows.</h2>
    </div>
    <ul class="builder-list">
      {builderPoints.map((point) => <li>{point}</li>)}
    </ul>
  </div>
</section>
```

- [ ] **Step 4: Create waitlist form**

Write `src/components/WaitlistCTA.astro`:

```astro
<section class="section waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
  <div class="section-inner waitlist-panel">
    <div>
      <p class="section-kicker">Early updates</p>
      <h2 class="section-title" id="waitlist-title">Join the waitlist.</h2>
      <p class="section-copy">
        Get updates as Anagate develops the gateway for AI-agent payment policy on Stellar.
      </p>
    </div>
    <form class="waitlist-form" data-waitlist-form>
      <label for="email">Email address</label>
      <div class="waitlist-row">
        <input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
        <button type="submit">Join the waitlist</button>
      </div>
      <p class="form-note" data-form-note>Front-end preview only. No submission service is connected yet.</p>
    </form>
  </div>
</section>

<script>
  const form = document.querySelector("[data-waitlist-form]");
  const note = document.querySelector("[data-form-note]");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (note) {
      note.textContent = "Thanks. The form is ready for a waitlist endpoint when one is connected.";
    }
  });
</script>
```

- [ ] **Step 5: Add CSS for these sections**

Append to `src/styles/global.css`:

```css
.decision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 44px;
}

.decision-panel {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 22px;
  background: var(--bg);
}

.decision-panel h3 {
  margin: 18px 0 8px;
}

.decision-panel p {
  margin: 0;
  color: var(--muted);
}

.audit-section {
  background: var(--ink);
  color: white;
}

.audit-section .section-kicker,
.audit-section .section-copy {
  color: oklch(0.78 0.01 230);
}

.audit-table-wrap {
  margin-top: 42px;
  overflow-x: auto;
  border: 1px solid oklch(0.28 0.01 230);
  border-radius: var(--radius-lg);
}

.audit-table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.audit-table th,
.audit-table td {
  padding: 14px 16px;
  border-bottom: 1px solid oklch(0.28 0.01 230);
  text-align: left;
  vertical-align: top;
}

.audit-table th {
  color: oklch(0.80 0.01 230);
  font-size: 0.78rem;
  font-weight: 700;
}

.audit-table td {
  color: oklch(0.92 0.004 230);
}

.builder-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: clamp(32px, 6vw, 76px);
}

.builder-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.builder-list li {
  border-top: 1px solid var(--line);
  padding: 18px 0;
  color: var(--muted);
}

.waitlist-section {
  padding-top: 0;
}

.waitlist-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
  border-radius: var(--radius-lg);
  background: var(--surface);
  padding: clamp(28px, 6vw, 64px);
}

.waitlist-form {
  display: grid;
  gap: 10px;
}

.waitlist-form label {
  font-weight: 800;
}

.waitlist-row {
  display: flex;
  gap: 10px;
}

.waitlist-row input {
  min-width: 0;
  flex: 1;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0 16px;
  min-height: 48px;
  color: var(--ink);
  background: var(--bg);
}

.waitlist-row button {
  border: 0;
  border-radius: 999px;
  min-height: 48px;
  padding: 0 18px;
  background: var(--primary);
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.form-note {
  min-height: 1.5em;
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: var(--container);
  margin: 0 auto;
  padding: 36px 0;
  border-top: 1px solid var(--line);
}

.site-footer p {
  margin: 6px 0 0;
  color: var(--muted);
}

.site-footer nav {
  gap: 18px;
  flex-wrap: wrap;
}
```

- [ ] **Step 6: Run source check**

Run:

```powershell
npm run check
```

Expected: pass. Required copy exists and banned public-copy terms are absent from `src`.

## Task 8: Responsive and Interaction Polish

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add responsive CSS**

Append to `src/styles/global.css`:

```css
@media (max-width: 920px) {
  .site-nav {
    display: none;
  }

  .hero-gateway,
  .problem-grid,
  .policy-layout,
  .builder-layout,
  .waitlist-panel {
    grid-template-columns: 1fr;
  }

  .hero-gateway {
    min-height: auto;
  }

  .gateway-stage {
    min-height: 430px;
  }

  .flow-lane {
    grid-template-columns: 1fr;
  }

  .flow-lane::before {
    left: 34px;
    right: auto;
    top: 18px;
    bottom: 18px;
    width: 2px;
    height: auto;
    background: linear-gradient(180deg, var(--line), var(--accent), var(--line));
  }
}

@media (max-width: 620px) {
  :root {
    --container: min(100vw - 24px, 1120px);
  }

  .site-header {
    padding: 14px 0;
  }

  .header-cta {
    padding-inline: 14px;
    font-size: 0.9rem;
  }

  .hero-copy h1 {
    font-size: clamp(2.65rem, 15vw, 4.4rem);
  }

  .waitlist-row,
  .site-footer {
    flex-direction: column;
  }

  .waitlist-row button {
    width: 100%;
  }
}
```

- [ ] **Step 2: Add state transitions that do not gate content**

Append to `src/styles/global.css`:

```css
.button-primary,
.button-secondary,
.header-cta,
.waitlist-row button,
.policy-row,
.decision-panel {
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.button-primary:hover,
.button-secondary:hover,
.header-cta:hover,
.waitlist-row button:hover {
  transform: translateY(-2px);
}

.policy-row:hover,
.decision-panel:hover {
  border-color: color-mix(in oklch, var(--accent) 55%, var(--line));
}
```

- [ ] **Step 3: Run source check**

Run:

```powershell
npm run check
```

Expected: pass.

## Task 9: Build and Static Output Verification

**Files:**
- Build output: `dist/`

- [ ] **Step 1: Run production build**

Run:

```powershell
npm run build
```

Expected: `astro check`, `astro build`, and `node scripts/check-build-output.mjs` pass. `dist/index.html` is created.

- [ ] **Step 2: Inspect built output for banned wording**

Run:

```powershell
rg -n "Instaward|grant|funding|budget|30-day|30 days|apply for" dist
```

Expected: no matches.

- [ ] **Step 3: Inspect built output for required wording**

Run:

```powershell
rg -n "Pre-signing policy enforcement|Join the waitlist|ALLOW|BLOCK|REQUIRE_APPROVAL|Stellar" dist
```

Expected: matches in `dist/index.html`.

## Task 10: Browser QA and Visual Iteration

**Files:**
- Modify any component or CSS file needed by discovered defects.

- [ ] **Step 1: Start the dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Astro prints a local URL, usually `http://127.0.0.1:4321/`.

- [ ] **Step 2: Open desktop viewport**

Open the local URL in the in-app browser or Playwright at 1440px wide.

Expected:

- Hero shows the Anagate mark as a gateway motif.
- H1 is visible in the first viewport.
- CTAs are visible.
- No horizontal overflow.
- No dark generic SaaS hero.

- [ ] **Step 3: Open tablet viewport**

Inspect around 820px wide.

Expected:

- Header does not overlap hero content.
- Flow stacks cleanly.
- Audit table scrolls horizontally without clipping the page.

- [ ] **Step 4: Open mobile viewport**

Inspect around 390px wide.

Expected:

- H1 wraps without overflow.
- CTA buttons remain tappable.
- Waitlist form stacks.
- Gateway motif stays visible and not cropped into nonsense.

- [ ] **Step 5: Test waitlist behavior**

Submit a valid email.

Expected: the form does not navigate away, and the note changes to `Thanks. The form is ready for a waitlist endpoint when one is connected.`

- [ ] **Step 6: Patch visual defects**

If any inspection fails, patch the smallest relevant CSS or component section and rerun:

```powershell
npm run check
npm run build
```

Expected: both commands pass after the patch.

## Task 11: Deployment Readiness Notes

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:

````markdown
# Anagate Landing Page

Public landing page for Anagate, a policy gateway for AI-agent payments on Stellar.

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Deploying to Vercel

This is a static Astro site. Vercel can detect Astro and deploy it without extra adapter configuration.

- Build command: `npm run build`
- Output directory: `dist`

The waitlist form is front-end only until a real endpoint is connected.
````

- [ ] **Step 2: Run final verification**

Run:

```powershell
npm run check
npm run build
```

Expected: both commands pass.

## Self-Review Checklist

- Spec coverage: Tasks cover Astro scaffold, logo asset, Gateway Console hero, problem framing, gateway flow, policy controls, decision states, audit trail, Stellar builder context, waitlist CTA, responsive QA, and Vercel readiness.
- Public-copy guard: Tasks include checks against grants, Instawards, 30-day language, budget, funding, and apply-for language.
- Type consistency: Component imports in `src/pages/index.astro` match component filenames in tasks.
- Build verification: `npm run build` includes Astro check, Astro build, and built-output guard.
- Accessibility coverage: Semantic sections, one H1, labels, focus styles, color-independent state labels, reduced-motion support, and responsive QA are all represented.
