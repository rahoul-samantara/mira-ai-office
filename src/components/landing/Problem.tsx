import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { PROBLEMS } from "@/content/mira";
import { motion } from "framer-motion";

export function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <SectionHeader
        eyebrow="The problem"
        title="Your HR stack is loud. Your leadership signal isn't."
        sub="Every tool reports state. None of them tell a leader what to do about it before Monday."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.06 }}
          >
            <SurfaceCard className="h-full p-6">
              <div className="mb-3 font-display text-4xl text-muted-foreground/40">0{i + 1}</div>
              <h3 className="font-display text-2xl text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </SurfaceCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
