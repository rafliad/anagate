# Anagate

Anagate is a protective policy gateway for AI-agent payments on the Stellar network. It evaluates payment intents before signing and submission to prevent autonomous agents from holding unrestricted wallet authority, keeping them operating safely within clear policy boundaries.

## The Gateway Flow

```
   [ AI Agent ]
        │
        ▼ (Proposes payment intent)
┌─────────────────────────────────┐
│            Anagate              │
│  (Evaluates policy logic)       │
└────────────────┬────────────────┘
                 │
                 ├─► [ ALLOW ] ───► [ Relayer signs & submits to Stellar ]
                 │
                 ├─► [ REQUIRE_APPROVAL ] ──► [ Wait for manual sign-off ]
                 │
                 └─► [ BLOCK ] ───► [ Transaction rejected & audited ]
```

## Key Mechanisms

- **Policy-Based Evaluation**: Intercepts and parses transaction intents against user-defined rule sets.
- **Explicit Gateway States**: Returns clear status responses:
  - `ALLOW`: The transaction complies with security policies and is routed to the relayer.
  - `BLOCK`: The transaction violates constraints and is rejected.
  - `REQUIRE_APPROVAL`: The transaction is paused until a human reviewer approves it.
- **Trust as a Flow**: Operates in a builder-native paradigm, prioritizing decision records, reason codes, and verifiable transaction hashes over empty claims.

---

## Local Development

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rafliad/anagate.git
   cd anagate
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Verify and Check Code**
   ```bash
   npm run check
   ```

## Directory Structure

```
├── .astro/              # Configuration cache
├── dist/                # Production build output
├── public/              # Static assets (images, icons)
├── src/
│   ├── components/      # UI components
│   ├── content/         # Page/block content configuration
│   ├── pages/           # Application pages and routing
│   └── styles/          # Styling files (vanilla CSS, variables)
├── PRODUCT.md           # Product philosophy, design goals, and guidelines
└── package.json         # Project dependencies and script scripts
```
