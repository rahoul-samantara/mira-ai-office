import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/MiraButton";
import { useSignupModal } from "@/components/auth/SignupModalProvider";

export function FinalCTA() {
  const { open } = useSignupModal();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="hairline grain relative overflow-hidden rounded-[36px] bg-surface p-12 md:p-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_28%,transparent),transparent)] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Meet MIRA
          </div>
          <h2 className="font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
            The office your leadership already needed.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Spend ₹49 and 48 hours. If MIRA hasn't earned a real conversation with your team by
            then, we don't deserve one after.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={open}>
              Try MIRA for ₹49 <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary">
              Talk to us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
