import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/MiraButton";

export const Route = createFileRoute("/payment/cancel")({
  head: () => ({
    meta: [
      { title: "Payment cancelled — MIRA" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CancelPage,
});

function CancelPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Payment cancelled
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl">
          No worries — nothing was charged.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          You can pick up where you left off, or head back to the landing page.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => navigate({ to: "/checkout" })}>Try again</Button>
          <Button variant="secondary" onClick={() => navigate({ to: "/" })}>
            Return home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
