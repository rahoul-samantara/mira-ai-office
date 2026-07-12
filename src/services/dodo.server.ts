import DodoPayments from "dodopayments";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

interface TrialCheckoutInput {
  origin: string;
  userId: string;
  email: string;
  fullName?: string;
  organization?: string;
}

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function dodoClient() {
  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";
  return new DodoPayments({
    bearerToken: env("DODO_PAYMENTS_API_KEY"),
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    environment,
  });
}

export async function createTrialCheckout(input: TrialCheckoutInput) {
  const session = await dodoClient().checkoutSessions.create({
    product_cart: [{ product_id: env("DODO_TRIAL_PRODUCT_ID"), quantity: 1 }],
    customer: { email: input.email, name: input.fullName },
    return_url: `${input.origin}/payment/success`,
    cancel_url: `${input.origin}/payment/cancel`,
    billing_currency: "INR",
    feature_flags: { redirect_immediately: true },
    metadata: {
      mira_user_id: input.userId,
      mira_product: "mira_trial",
      organization: input.organization ?? "",
    },
  });

  if (!session.checkout_url) throw new Error("Dodo Payments did not return a checkout URL.");

  const { error } = await supabaseAdmin.from("mira_trials").insert({
    user_id: input.userId,
    checkout_session_id: session.session_id,
    status: "pending",
    product_key: "mira_trial",
  });
  if (error) throw new Error(`Could not save checkout: ${error.message}`);

  return { checkout_url: session.checkout_url, session_id: session.session_id };
}

export async function getUserTrialStatus(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("mira_trials")
    .select("status, starts_at, expires_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Could not load trial status: ${error.message}`);
  return data ?? { status: "not_found", starts_at: null, expires_at: null };
}

export function unwrapDodoWebhook(body: string, headers: Record<string, string>) {
  return dodoClient().webhooks.unwrap(body, { headers });
}
