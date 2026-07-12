import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { HERO } from "@/content/mira";
import { Button } from "@/components/ui/MiraButton";
import { useSignupModal } from "@/components/auth/SignupModalProvider";
import { InteractiveDemo } from "@/components/demo/InteractiveDemo";

export function Hero() {
  const { open } = useSignupModal();
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px]">
        <div className="absolute left-1/2 top-[-200px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_35%,transparent),transparent)] blur-3xl" />
        <div className="absolute left-[10%] top-[100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-cyan)_18%,transparent),transparent)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            {HERO.eyebrow}
          </div>
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-[80px]">
            {HERO.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            {HERO.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={open}>
              {HERO.primary} <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href={HERO.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-surface px-6 py-3.5 text-sm font-medium tracking-tight text-foreground transition-all duration-200 hover:bg-surface-elevated"
            >
              <Play className="h-3.5 w-3.5" /> {HERO.secondary}
            </a>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            48-hour trial · No credit card auto-renewal · Cancel anytime
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-16"
          id="product"
        >
          <InteractiveDemo />
        </motion.div>
      </div>
    </section>
  );
}
