import { SectionHeader } from "@/components/ui/SectionHeader";
import { FAQS } from "@/content/mira";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24 md:py-32">
      <SectionHeader align="center" eyebrow="FAQ" title="Answers for HR leaders." />
      <div className="mt-14 divide-y divide-hairline overflow-hidden rounded-3xl border border-hairline bg-surface">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-surface-elevated"
              >
                <span className="text-base text-foreground">{f.q}</span>
                <Plus
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-45 text-foreground" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
