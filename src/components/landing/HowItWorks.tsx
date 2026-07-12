import { SectionHeader } from "@/components/ui/SectionHeader";
import { HOW_STEPS } from "@/content/mira";
import { motion } from "framer-motion";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <SectionHeader eyebrow="How MIRA works" title="From signals to a specific next action." />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {HOW_STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="relative"
          >
            <div className="hairline rounded-3xl bg-surface p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <span className="font-display text-5xl text-foreground/90">{s.n}</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Step
                </span>
              </div>
              <h3 className="font-display text-2xl leading-tight text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
