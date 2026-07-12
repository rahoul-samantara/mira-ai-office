# MIRA — Autonomous Employee Success Office

Premium dark-mode SaaS landing page for MIRA targeting HR leaders, driving a ₹49 / 48-hour trial. Frontend-only; all payment logic abstracted behind a placeholder service so Hermes can wire the backend later.

## Design direction

- **Aesthetic**: Apple × Linear × Raycast × Arc — executive, minimal, elegant. Dark mode default (no toggle needed).
- **Palette**: near-black background (`oklch(0.14 0.02 260)`), elevated surfaces (`oklch(0.19 0.02 260)`), soft off-white foreground, a single restrained accent (electric violet/indigo `oklch(0.72 0.18 285)`) with a subtle cyan companion for the workflow glow. No purple-on-white gradients; accent used sparingly on CTAs and node glows.
- **Typography**: Display — Instrument Serif or Geist; Body — Inter Tight / Geist Sans (loaded via `<link>` in `__root.tsx`). Large hero headline with tight tracking, generous line-height on body.
- **Surfaces**: 20–24px rounded cards, hairline borders (`1px solid oklch(1 0 0 / 0.08)`), soft layered shadows, subtle noise/grain on hero, radial glows behind the demo.
- **Motion**: Framer Motion — hero fade/blur-in, scroll-triggered section reveals, animated workflow nodes with pulsing glow and traveling connection dots, evidence-panel counters counting up.

Tokens land in `src/styles.css` `:root` (dark by default; `.dark` class applied on `<html>` in `__root.tsx`).

## Route structure (TanStack Start)

```
src/routes/
  __root.tsx              (dark theme, fonts, global head)
  index.tsx               (landing page)
  checkout.tsx            (checkout summary)
  payment/success.tsx     (success screen)
  payment/cancel.tsx      (cancel screen)
```

Each leaf route sets its own `head()` with unique title/description/og.

## Landing page sections (in `src/routes/index.tsx` composing components)

1. **AnnouncementBar** — dismissible, "Launch offer: ₹49 for 48 hours →".
2. **Navbar** — sticky, blurred; MIRA wordmark, anchor links (Product, Agents, Pricing, FAQ), "Sign in" ghost + "Try for ₹49" primary.
3. **Hero** — headline, subheadline, dual CTAs, trust row ("Built for HR leaders"), plus the **Interactive Demo** below.
4. **InteractiveDemo** — three-panel showcase:
   - **Left – ConversationPanel**: persistent chat bubbles (CEO ↔ MIRA), typewriter effect on MIRA's line.
   - **Center – AgentWorkflow**: n8n-style DAG. Nodes: Planner → Department Health → Attrition → Manager Effectiveness → Analytics → Recommendation. Framer Motion sequences node activation (scale + glow), SVG paths animate stroke-dashoffset, traveling dot along each edge. Loops on view.
   - **Right – EvidencePanel**: animated counters (Employees analysed, Signals reviewed, Recommendations generated), timeline strip, confidence meter (radial).
5. **Problem** — "Your HR data is loud. Your leadership signal isn't." three-column pain points on soft cards.
6. **HowItWorks** — 3-step ribbon: Connect signals → Activate agents → Get recommendations.
7. **AgentOffice** — grid of agent cards (Planner, Department Health, Attrition, Manager Effectiveness, Analytics, Recommendation) each with icon, role, sample output.
8. **Features** — bento grid of workspace capabilities with static workspace screenshots (generated as image assets).
9. **Pricing** — two cards (Trial ₹49 / Premium ₹9,999), Trial highlighted with accent border + glow.
10. **FAQ** — Radix accordion with 6–8 questions targeted at HR buyers.
11. **CTA** — final large-format "Meet MIRA" panel with primary CTA.
12. **Footer** — minimal, columns + fine print.

## Signup + checkout flow

- **SignupModal** (Radix Dialog) opens from every "Try for ₹49" CTA. Fields: Full Name, Work Email, Password, Confirm Password, Organization (optional), Accept Terms checkbox. Client-side validation only (zod + react-hook-form). "Create Account" stores draft user in `sessionStorage` (name/email/org only — no password persisted) and navigates to `/checkout`.
- **Checkout page** renders order summary (MIRA Trial · ₹49 · 48-hour access · customer email from sessionStorage). "Continue to Secure Payment" calls `createDodoCheckout()` from `src/services/dodo.ts`; on returned `checkout_url` performs `window.location.assign(url)`. Loading + error states handled locally.
- **Payment Success** (`/payment/success`) — animated check illustration (SVG + Framer Motion), "Trial Activated · 48 Hours Remaining", CTA "Enter MIRA Workspace" → `/` (workspace is preview-only).
- **Payment Cancel** (`/payment/cancel`) — quiet message, "Try Again" (→ `/checkout`) and "Return Home".

## Services layer

`src/services/dodo.ts` — placeholder only, no secrets, no fetch to real endpoints:

```ts
export type DodoCheckoutInput = { email: string; productId: "mira_trial"; amount: 49 };
export type DodoCheckoutResponse = { checkout_url: string; session_id: string };

export async function createDodoCheckout(_input: DodoCheckoutInput): Promise<DodoCheckoutResponse> {
  // TODO(Hermes): call backend endpoint that creates a Dodo checkout session.
  // Backend owns the API key; frontend must never hold secrets.
  throw new Error("createDodoCheckout not implemented — wire backend endpoint");
}

export async function verifyPayment(_sessionId: string): Promise<{ status: "paid" | "pending" | "failed" }> {
  throw new Error("verifyPayment not implemented — wire backend endpoint");
}
```

Checkout page catches the thrown error and shows a friendly "Payment provider not connected yet" state so the UI is demoable without a backend.

## Component inventory (`src/components/`)

- `layout/AnnouncementBar.tsx`, `layout/Navbar.tsx`, `layout/Footer.tsx`
- `landing/Hero.tsx`, `landing/Problem.tsx`, `landing/HowItWorks.tsx`, `landing/AgentOffice.tsx`, `landing/Features.tsx`, `landing/Pricing.tsx`, `landing/FAQ.tsx`, `landing/FinalCTA.tsx`
- `demo/InteractiveDemo.tsx`, `demo/ConversationPanel.tsx`, `demo/AgentWorkflow.tsx`, `demo/WorkflowNode.tsx`, `demo/EvidencePanel.tsx`, `demo/ConfidenceMeter.tsx`
- `auth/SignupModal.tsx`
- `ui/GradientButton.tsx`, `ui/SurfaceCard.tsx`, `ui/SectionHeader.tsx`, `ui/GlowBackdrop.tsx` (plus existing shadcn primitives)

Every component is typed, prop-driven, and reusable. Copy lives in a single `src/content/mira.ts` module so it's easy to edit.

## Technical details

- Fonts loaded via `<link>` in `__root.tsx` head; families registered in `@theme` in `src/styles.css`.
- `<html class="dark">` set in `RootShell` so dark tokens apply from first paint (no flash).
- Framer Motion (`motion`) already suitable for this stack; install via `bun add framer-motion`.
- `react-hook-form` + `zod` for signup validation (both fit Worker SSR).
- Workspace/feature imagery: generate 2–3 hero/product shots with imagegen and import as ES modules.
- Head metadata: real MIRA title/description on `__root.tsx`; leaf routes override with page-specific text; og:image generated for landing only.
- No backend calls, no secrets, no env reads on the client. All payment logic sits behind `services/dodo.ts` awaiting Hermes.

## Out of scope

- Actual authentication, session, and workspace app.
- Real Dodo Payments integration (service stubs only).
- Light mode toggle.
