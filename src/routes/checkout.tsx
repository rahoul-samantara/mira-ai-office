import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/MiraButton";
import { createDodoCheckout } from "@/services/dodo";
import { TRIAL_PRICE } from "@/content/mira";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MIRA" },
      { name: "description", content: "Confirm your MIRA 48-hour trial for ₹49." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

interface Draft {
  fullName?: string;
  email?: string;
  organization?: string;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mira.signupDraft");
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const email = draft.email ?? "you@company.com";

  const onPay = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { checkout_url } = await createDodoCheckout({
        productId: "mira_trial",
        amount: TRIAL_PRICE,
        currency: "INR",
        customer: {
          email,
          fullName: draft.fullName,
          organization: draft.organization,
        },
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });
      window.location.assign(checkout_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment couldn't start.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
        >
          ← Back to MIRA
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr]"
        >
          <div className="hairline rounded-3xl bg-surface p-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Order summary
            </div>
            <h1 className="mt-2 font-display text-4xl text-foreground">MIRA Trial</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              48 hours of guided access to the Employee Success Office.
            </p>

            <dl className="mt-8 space-y-3 text-sm">
              <Row label="Product">MIRA Trial · 48 hours</Row>
              <Row label="Access">Guided workspace + synthetic company</Row>
              <Row label="Customer">{email}</Row>
              {draft.organization && <Row label="Organization">{draft.organization}</Row>}
            </dl>

            <div className="mt-8 flex items-end justify-between border-t border-hairline pt-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Total
                </div>
                <div className="mt-1 font-display text-5xl text-foreground">₹{TRIAL_PRICE}</div>
                <div className="mt-1 text-xs text-muted-foreground">One-time · No auto-renewal</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Secured by Dodo Payments
              </div>
            </div>
          </div>

          <div className="hairline h-fit rounded-3xl bg-background p-8">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Secure checkout
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              You'll be redirected to Dodo Payments to complete payment. Your card details never
              touch MIRA.
            </p>

            <Button size="lg" className="mt-6 w-full" onClick={onPay} disabled={submitting}>
              {submitting ? "Redirecting…" : "Continue to secure payment"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            {error && (
              <div className="mt-4 rounded-2xl border border-hairline bg-surface p-3 text-xs text-muted-foreground">
                {error}
                <div className="mt-1 text-[11px] opacity-70">
                  (Hermes will wire the backend endpoint before launch.)
                </div>
              </div>
            )}

            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-4 w-full text-center text-xs text-muted-foreground transition hover:text-foreground"
            >
              Cancel and return home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline pb-3 last:border-0">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm text-foreground">{children}</dd>
    </div>
  );
}
