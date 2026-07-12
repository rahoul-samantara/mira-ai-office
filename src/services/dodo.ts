/**
 * Dodo Payments — placeholder service layer.
 *
 * ⚠️ Frontend-only. Do NOT put API keys or secrets in this file.
 * The real implementation must live on a backend endpoint that Hermes wires up.
 * The frontend only ever asks the backend to create a checkout session and
 * redirects the browser to the returned URL.
 */

export type DodoProductId = "mira_trial" | "mira_premium";

export interface DodoCheckoutInput {
  productId: DodoProductId;
  amount: number; // in INR
  currency: "INR";
  customer: {
    email: string;
    fullName?: string;
    organization?: string;
  };
  successUrl: string;
  cancelUrl: string;
}

export interface DodoCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface DodoVerifyResponse {
  status: "paid" | "pending" | "failed";
  session_id: string;
}

/**
 * Create a Dodo checkout session.
 *
 * TODO(Hermes): POST to `/api/checkout/dodo` (backend), which will:
 *   1. Read DODO_API_KEY from server env
 *   2. Call Dodo's create-session endpoint
 *   3. Return { checkout_url, session_id }
 *
 * Frontend must then `window.location.assign(checkout_url)`.
 */
export async function createDodoCheckout(
  _input: DodoCheckoutInput,
): Promise<DodoCheckoutResponse> {
  throw new Error(
    "Payment provider not connected yet. Backend endpoint /api/checkout/dodo must be wired by Hermes.",
  );
}

/**
 * Verify a Dodo checkout session server-side.
 * TODO(Hermes): GET `/api/checkout/dodo/verify?session_id=...`
 */
export async function verifyPayment(sessionId: string): Promise<DodoVerifyResponse> {
  throw new Error(
    `Payment verification not connected yet (session_id=${sessionId}).`,
  );
}
