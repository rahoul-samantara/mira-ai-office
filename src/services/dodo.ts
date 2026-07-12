import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DodoProductId = "mira_trial" | "mira_premium";

export interface DodoCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export const createDodoCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { productId: DodoProductId; origin: string }) => data)
  .handler(async ({ data, context }): Promise<DodoCheckoutResponse> => {
    if (data.productId !== "mira_trial") throw new Error("Unknown product.");

    const origin = new URL(data.origin).origin;
    const email = typeof context.claims.email === "string" ? context.claims.email : null;
    const metadata = isRecord(context.claims.user_metadata) ? context.claims.user_metadata : {};
    if (!email) throw new Error("Your account does not have an email address.");

    const { createTrialCheckout } = await import("./dodo.server");
    return createTrialCheckout({
      origin,
      userId: context.userId,
      email,
      fullName: typeof metadata.full_name === "string" ? metadata.full_name : undefined,
      organization: typeof metadata.organization === "string" ? metadata.organization : undefined,
    });
  });

export const getTrialStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getUserTrialStatus } = await import("./dodo.server");
    return getUserTrialStatus(context.userId);
  });

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
