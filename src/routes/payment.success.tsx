import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight, LoaderCircle, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/MiraButton";
import { getTrialStatus } from "@/services/dodo";

export const Route = createFileRoute("/payment/success")({
  head: () => ({
    meta: [
      { title: "Payment status — MIRA" },
      { name: "description", content: "Verify your MIRA trial payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

type ViewState = "checking" | "active" | "pending" | "error";

function SuccessPage() {
  const [state, setState] = useState<ViewState>("checking");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      for (let attempt = 0; attempt < 6; attempt++) {
        try {
          const trial = await getTrialStatus();
          if (cancelled) return;
          if (trial.status === "paid") {
            setExpiresAt(trial.expires_at);
            setState("active");
            return;
          }
          if (attempt < 5) await new Promise((resolve) => window.setTimeout(resolve, 1500));
        } catch {
          if (!cancelled) setState("error");
          return;
        }
      }
      if (!cancelled) setState("pending");
    };
    void verify();
    return () => {
      cancelled = true;
    };
  }, []);

  const active = state === "active";
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_25%,transparent),transparent)] blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-xl text-center"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-glow)]">
          {state === "checking" ? (
            <LoaderCircle className="h-10 w-10 animate-spin text-background" />
          ) : active ? (
            <Check className="h-10 w-10 text-background" />
          ) : (
            <ShieldAlert className="h-10 w-10 text-background" />
          )}
        </div>
        <div className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {state === "checking"
            ? "Verifying payment"
            : active
              ? "Payment verified"
              : "Verification pending"}
        </div>
        <h1 className="mt-3 font-display text-5xl leading-tight text-foreground md:text-6xl">
          {state === "checking"
            ? "One moment."
            : active
              ? "Trial activated."
              : "We're confirming your payment."}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {active
            ? `Your access is active${expiresAt ? ` until ${new Date(expiresAt).toLocaleString()}` : ""}.`
            : state === "error"
              ? "Sign in again, then return to this page to check your access."
              : "Dodo Payments may take a few seconds to notify MIRA. Refresh this page shortly."}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {active && (
            <Button size="lg">
              Enter MIRA Workspace <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            Return home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
