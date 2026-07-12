import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { unwrapDodoWebhook } from "@/services/dodo.server";

export const Route = createFileRoute("/api/webhooks/dodo")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const webhookId = request.headers.get("webhook-id") ?? "";
        const headers = {
          "webhook-id": webhookId,
          "webhook-signature": request.headers.get("webhook-signature") ?? "",
          "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
        };

        if (!webhookId || !headers["webhook-signature"] || !headers["webhook-timestamp"]) {
          return Response.json({ error: "Missing webhook signature headers" }, { status: 400 });
        }

        try {
          const event = unwrapDodoWebhook(body, headers);
          if (event.type !== "payment.succeeded") {
            return Response.json({ received: true });
          }

          const userId = event.data.metadata.mira_user_id;
          const checkoutSessionId = event.data.checkout_session_id;
          if (typeof userId !== "string" || !checkoutSessionId) {
            throw new Error("Payment is missing MIRA checkout metadata.");
          }

          const { error } = await supabaseAdmin.rpc("activate_mira_trial", {
            p_webhook_id: webhookId,
            p_event_type: event.type,
            p_checkout_session_id: checkoutSessionId,
            p_payment_id: event.data.payment_id,
            p_user_id: userId,
          });
          if (error) throw error;

          return Response.json({ received: true });
        } catch (error) {
          console.error("Dodo webhook rejected", error);
          return Response.json({ error: "Invalid or unprocessable webhook" }, { status: 400 });
        }
      },
    },
  },
});
