# Anagate Landing Page Design

## Summary

Build a Vercel-ready public landing page for Anagate, a policy gateway for AI-agent payments on Stellar. The page should be general-purpose and public-facing: no grant language, no 30-day scope language, no funding references, and no implication that the project is already a mature production suite.

The approved direction is **Gateway Console**: use the Anagate mark as a spatial gateway between agent intent and signed execution, then support that brand idea with concrete console-like proof of the policy flow.

## Audience

Primary audience: technically fluent reviewers and ecosystem evaluators who need to understand the project quickly.

Secondary audience: future Stellar builders, AI-agent developers, community members, and potential early integrators.

The page should make the project feel serious and useful without becoming a dense technical whitepaper.

## Positioning

Core statement:

> Pre-signing policy enforcement for AI-agent payments on Stellar.

Supporting explanation:

> Agents submit payment intent. Anagate evaluates policy and returns ALLOW, BLOCK, or REQUIRE_APPROVAL. Only allowed payments reach the relayer for signing and submission.

The public page should avoid:

- Instawards, grant, budget, reviewer-only, or deadline language.
- Claims that imply full production readiness.
- Overblown AI-security copy.
- Fake dashboards that imply live product telemetry.

## Content Architecture

### Hero

Purpose: establish the category and visual identity in the first viewport.

Content:

- Logo and wordmark.
- H1: "Pre-signing policy enforcement for AI-agent payments."
- Supporting copy that names Stellar and explains the gate.
- Primary CTA: "Join the waitlist."
- Secondary CTA: "See the flow" or "Explore the gateway."
- A large gateway composition based on the black Anagate mark.
- A visible flow: `agent intent -> policy gateway -> signed payment`.

Design notes:

- The mark should be dominant but not simply pasted as a huge image.
- The hero should be light, sharp, and spacious.
- Use a restrained cyan or teal accent for allowed flow paths.
- Avoid a generic dark security hero.

### Problem

Purpose: explain why unrestricted agent wallet authority is risky.

Key messages:

- AI agents can initiate programmatic payments.
- Giving agents direct signing authority creates operational risk.
- Monitoring after execution is too late when funds have already moved.
- Builders need a guard before signing and submission.

Tone:

- Specific and calm.
- No exaggerated breach statistics unless they are sourced and current.
- No fear-first drama.

### Gateway Flow

Purpose: make the mechanism understandable.

Flow:

1. Agent proposes a payment intent.
2. Anagate checks policy.
3. Gateway returns ALLOW, BLOCK, or REQUIRE_APPROVAL.
4. Gateway-controlled relayer signs and submits only allowed payments.
5. Every decision is stored for audit.

This should be the page's most important educational section. It can use a horizontal flow on desktop and a stacked stepper on mobile.

### Policy Controls

Purpose: show concrete enforcement rules.

Controls:

- Agent status.
- Recipient allowlist.
- Maximum amount per transaction.
- Daily spending limit.

Design notes:

- Avoid an identical icon-card grid.
- Prefer a compact policy panel or inspector that feels like real configuration.
- Each control should map to a decision reason.

### Decision States

Purpose: make the three response states memorable.

States:

- ALLOW: request can proceed to signing.
- BLOCK: request is rejected with a reason.
- REQUIRE_APPROVAL: request is stored as pending and does not execute automatically.

Design notes:

- Use state colors carefully.
- ALLOW can use teal or cyan.
- BLOCK can use restrained red or orange.
- REQUIRE_APPROVAL can use amber or cool blue.
- State labels should be readable and accessible without relying on color alone.

### Audit Trail

Purpose: prove that Anagate is about verifiable decisions, not vague monitoring.

Records should include:

- Agent ID.
- Timestamp.
- Recipient.
- Amount.
- Decision.
- Reason.
- Transaction hash when executed.

Design notes:

- A table or event log is appropriate here.
- Keep it compact and credible.
- It should feel like evidence, not decoration.

### Stellar Builder Context

Purpose: connect Anagate to the ecosystem without over-narrowing the page.

Mention:

- Stellar.
- Native XLM payment flow.
- Agentic payment flows such as x402 and MPP as contextual examples.
- TypeScript client and relayer as future integration surfaces.

Do not make this section sound like internal scope paperwork.

### Final CTA

Purpose: collect interest.

CTA:

- "Join the waitlist."

Supporting copy:

- Invite builders, researchers, and community members who want updates on agent payment policy infrastructure.

Expected behavior:

- If no backend exists yet, use a polished waitlist form front end with a clear non-deceptive success state.
- The implementation may store nothing initially if no service is configured, but it should not fake a network submission.

## Visual Direction

North star: Gateway Console.

The page combines:

- The Gateway: logo-led, spatial, ownable identity.
- The Testnet Console: crisp decision panels, flow diagrams, and audit evidence.

Color:

- Primary surface should be light and neutral, not cream or beige.
- Primary ink should be near black.
- Accent should be a controlled cyan or teal used for approved flow paths and active focus.
- Warning and block colors should appear only for decision states.
- Use OKLCH in CSS for the authored palette.

Typography:

- Use a distinctive but deployable font strategy.
- Avoid reflex defaults such as Inter, IBM Plex, Space Grotesk, and Plus Jakarta Sans.
- The type should feel technical and calm without relying on monospace everywhere.
- Mono can be used sparingly for state labels, hashes, and console snippets.

Layout:

- Avoid repeated card grids and repeated section eyebrows.
- Use one strong gateway hero, then vary later sections between flow, inspector, decision log, and CTA.
- Keep body line length around 65 to 75 characters.
- Use responsive compositions that reflow rather than shrink.

Motion:

- Motion should clarify the flow from intent to policy gate to signed payment.
- No content should depend on animation to become visible.
- Respect `prefers-reduced-motion: reduce`.

Imagery:

- Use the provided Anagate logo as the key brand asset.
- No stock photos are needed.
- Diagrams and UI-like panels can be built with HTML/CSS/SVG.

## Technical Direction

Use a Vercel-friendly frontend stack. Because this is a content-led brand page and the project folder is currently empty, Astro is the recommended default. It can ship fast static pages, supports componentized sections, and deploys cleanly to Vercel.

Expected files:

- `package.json` with scripts for dev, build, preview, and lint or check if available.
- `astro.config.mjs`.
- `src/pages/index.astro`.
- `src/styles/global.css`.
- `src/components/` for reusable sections such as hero, gateway flow, policy panel, audit log, and waitlist CTA.
- `public/` for the logo asset.

The build should not depend on a backend. The waitlist form should be honest and front-end only unless the user later provides a service endpoint.

## Accessibility Requirements

- Semantic HTML landmarks.
- One H1.
- Keyboard-accessible links and form controls.
- Visible focus states.
- Text contrast at WCAG AA or better.
- State labels must not rely on color alone.
- Reduced-motion handling.
- Mobile-first responsive layout.

## Acceptance Criteria

- The page does not mention grants, Instawards, 30-day timelines, budgets, or funding.
- The hero clearly communicates pre-signing policy enforcement for AI-agent payments.
- The user can understand the flow from payment intent to policy decision to relayer signing.
- The CTA is "Join the waitlist."
- The design uses the Anagate mark as a distinctive gateway motif.
- The page is responsive across mobile, tablet, and desktop.
- The project builds successfully for deployment on Vercel.
- The page avoids generic SaaS patterns identified in `PRODUCT.md`.

## Open Decisions

- Exact font pairing will be chosen during implementation after checking available web fonts and performance.
- Exact waitlist behavior will remain front-end only until a real endpoint is provided.
- Final microcopy can be refined during implementation, but must preserve the approved positioning.
