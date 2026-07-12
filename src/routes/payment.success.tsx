import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/MiraButton";

export const Route = createFileRoute("/payment/success")({
  head: () => ({
    meta: [
      { title: "Trial activated — MIRA" },
      { name: "description", content: "Your MIRA 48-hour trial is now active." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
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
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-glow)] shadow-[0_0_60px_-10px_color-mix(in_oklab,var(--brand)_60%,transparent)]"
        >
          <Check className="h-10 w-10 text-background" strokeWidth={2.5} />
        </motion.div>

        <div className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Payment successful
        </div>
        <h1 className="mt-3 font-display text-5xl leading-tight text-foreground md:text-6xl">
          Trial activated.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          48 hours remaining — the Employee Success Office is standing by.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            Enter MIRA Workspace <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Return home
          </Link>
        </div>

        <div className="mt-10 text-xs text-muted-foreground">
          A confirmation has been sent to your work email.
        </div>
      </motion.div>
    </div>
  );
}
