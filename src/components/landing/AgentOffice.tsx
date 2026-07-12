import { SectionHeader } from "@/components/ui/SectionHeader";
import { AGENTS } from "@/content/mira";
import { motion } from "framer-motion";

export function AgentOffice() {
  return (
    <section id="agents" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <SectionHeader
        eyebrow="The Agent Office"
        title="Not a chatbot. An office of specialists."
        sub="Each agent has a role, a scope, and a way of thinking. The Planner assigns; the office responds."
      />

      <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.04 }}
            className="hairline group relative overflow-hidden rounded-3xl bg-surface p-6 transition-colors hover:bg-surface-elevated"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_25%,transparent),transparent)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {a.role}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl text-foreground">{a.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
