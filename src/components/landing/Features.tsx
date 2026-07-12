import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <SectionHeader
        eyebrow="Inside the workspace"
        title="Executive-grade surfaces, built for HR leaders."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-6 md:grid-rows-2">
        <SurfaceCard className="relative overflow-hidden p-8 md:col-span-4 md:row-span-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Department Investigation
          </div>
          <h3 className="mt-2 font-display text-3xl text-foreground">
            One canvas per department. Every signal on it.
          </h3>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Health score, attrition trajectory, manager map, workload heat and the recommendations
            MIRA is confident enough to ship.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Engineering", "Operations", "Sales"].map((d, i) => (
              <div key={d} className="hairline rounded-2xl bg-background/60 p-4">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {d}
                </div>
                <div className="mt-1 font-display text-2xl text-foreground">
                  {[92, 78, 84][i]}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-glow)]"
                    style={{ width: `${[92, 78, 84][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 md:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Confidence</div>
          <div className="mt-3 font-display text-2xl text-foreground">Evidence, not opinions.</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Every recommendation ships with the signals that produced it.
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-6 md:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Conversation Guides
          </div>
          <div className="mt-3 font-display text-2xl text-foreground">
            The manager talk track, pre-written.
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Because "flight risk detected" is not a plan.
          </p>
        </SurfaceCard>
      </div>
    </section>
  );
}
