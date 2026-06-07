export const site = {
  name: "Anagate",
  description:
    "Anagate is a pre-signing policy gateway for AI-agent payments on Stellar.",
  waitlistCta: "Join the waitlist",
};

export const navItems = [
  { href: "#flow", label: "Flow" },
  { href: "#policy", label: "Policy" },
  { href: "#audit", label: "Audit" },
  { href: "#waitlist", label: "Waitlist" },
];

export const hero = {
  title: "Pre-signing policy enforcement for AI-agent payments.",
  copy:
    "Anagate sits between agent intent and signed Stellar payment. It checks policy before a relayer signs, so autonomous payments stay inside explicit operating limits.",
  primaryCta: "Join the waitlist",
  secondaryCta: "Inspect the flow",
  chips: ["agent intent", "policy gateway", "signed payment"],
};

export const problems = [
  {
    title: "Agents should not hold unrestricted wallet authority.",
    body:
      "A payment-capable agent needs room to act, but full wallet access turns every prompt, integration, and dependency into a signing risk.",
  },
  {
    title: "Monitoring after execution is too late.",
    body:
      "Alerts and dashboards can explain what happened. Anagate is designed to make the decision before the signature exists.",
  },
];

export const flowSteps = [
  {
    label: "agent intent",
    title: "Agent proposes payment intent",
    body:
      "The agent sends recipient, asset, amount, memo, and reason as a structured request.",
  },
  {
    label: "policy gateway",
    title: "Anagate evaluates policy",
    body:
      "Rules check status, recipient allowlist, maximum amount, and daily spending limit.",
  },
  {
    label: "signed payment",
    title: "Relayer signs only allowed requests",
    body:
      "The relayer receives a signable request only when the gateway returns ALLOW.",
  },
];

export const policyChecks = [
  {
    name: "Agent status",
    value: "active",
    result: "passes",
    detail: "Agent can request payment intents from this policy set.",
  },
  {
    name: "Recipient allowlist",
    value: "stellar.tools",
    result: "passes",
    detail: "Recipient matches the approved builder-services group.",
  },
  {
    name: "Maximum amount",
    value: "42 XLM",
    result: "review",
    detail: "Request is inside the policy cap, but close enough to require approval.",
  },
  {
    name: "Daily spending limit",
    value: "91 of 120 XLM",
    result: "passes",
    detail: "Remaining daily capacity can cover the proposed transaction.",
  },
];

export const decisionStates = [
  {
    state: "ALLOW",
    label: "Allowed",
    body:
      "Policy passed. The relayer can sign and submit the Stellar payment.",
  },
  {
    state: "BLOCK",
    label: "Blocked",
    body:
      "Policy failed. The request stops before a signature can be produced.",
  },
  {
    state: "REQUIRE_APPROVAL",
    label: "Needs approval",
    body:
      "Policy is valid but sensitive. A human reviewer must approve before signing.",
  },
];

export const auditRows = [
  {
    time: "14:03:18",
    agent: "invoice-agent",
    recipient: "stellar.tools",
    amount: "42 XLM",
    decision: "REQUIRE_APPROVAL",
    reason: "Near maximum amount",
    hash: "9f3a...c18b",
  },
  {
    time: "14:05:44",
    agent: "ops-agent",
    recipient: "node-host",
    amount: "8 XLM",
    decision: "ALLOW",
    reason: "Allowlisted recipient",
    hash: "31ad...77e2",
  },
  {
    time: "14:09:02",
    agent: "research-agent",
    recipient: "unknown-payee",
    amount: "17 XLM",
    decision: "BLOCK",
    reason: "Recipient not allowlisted",
    hash: "not signed",
  },
];

export const builderPoints = [
  {
    label: "Stellar flow",
    body: "Built for Stellar payment flows, including native XLM.",
  },
  {
    label: "Agent pattern",
    body: "Designed for x402 and MPP-style agent payment patterns.",
  },
  {
    label: "Integration path",
    body: "Surfaces can include a TypeScript client and a policy-aware relayer.",
  },
];
