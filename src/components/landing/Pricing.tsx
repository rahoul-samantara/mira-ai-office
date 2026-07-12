import { Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/MiraButton";
import { useSignupModal } from "@/components/auth/SignupModalProvider";
import { TRIAL_PRICE, PREMIUM_PRICE } from "@/content/mira";

export function Pricing() {
  const { open } = useSignupModal();
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <SectionHeader
        align="center"
        eyebrow="Pricing"
        title="Start with 48 hours. Stay if it earns it."
        sub="One transparent trial, one monthly plan. No annual lock-in."
      />

      <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Trial */}
        <div className="hairline relative overflow-hidden rounded-3xl bg-surface p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_35%,transparent),transparent)] blur-2xl" />
          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-hairline bg-background/50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" /> Launch offer
            </div>
            <h3 className="font-display text-3xl text-foreground">MIRA Trial</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl text-foreground">₹{TRIAL_PRICE}</span>
              <span className="text-sm text-muted-foreground">one-time · 48 hours</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Guided workspace",
                "Synthetic company data",
                "Department investigation",
                "Employee investigation",
                "Live AI workflow",
                "Executive dashboard",
                "Actionable recommendations",
              ].map((f) => (
                <Feature key={f}>{f}</Feature>
              ))}
            </ul>
            <Button size="lg" className="mt-8 w-full" onClick={open}>
              Try MIRA for ₹{TRIAL_PRICE}
            </Button>
          </div>
        </div>

        {/* Premium */}
        <div className="hairline relative rounded-3xl bg-background p-8">
          <h3 className="font-display text-3xl text-foreground">MIRA Premium</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-6xl text-foreground">
              ₹{PREMIUM_PRICE.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-muted-foreground">/ month</span>
          </div>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Organization setup",
              "HRMS integration",
              "Real employee data",
              "Department dashboards",
              "Full agent office",
              "Advanced analytics",
              "Recommendations engine",
              "Manager conversation guides",
            ].map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>
          <Button size="lg" variant="secondary" className="mt-8 w-full">
            Set up MIRA
          </Button>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-foreground/85">
      <Check className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
      <span>{children}</span>
    </li>
  );
}
