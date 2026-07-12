import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MIRA_LINE = "I'll ask my Employee Success Office.";

export function ConversationPanel() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setTyped(MIRA_LINE.slice(0, i));
      if (i >= MIRA_LINE.length) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-full min-h-[520px] flex-col p-6">
      <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Conversation</span>
        <span>CEO · MIRA</span>
      </div>

      <div className="flex-1 space-y-4">
        <Bubble side="right" who="CEO">
          MIRA, how is my IT department doing?
        </Bubble>
        <Bubble side="left" who="MIRA">
          {typed}
          <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 animate-pulse bg-foreground/60 align-middle" />
        </Bubble>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground"
        >
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand)]" />
          Planner is orchestrating 5 agents…
        </motion.div>
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface/50 px-3 py-2.5 text-xs text-muted-foreground">
        Ask MIRA anything about the workforce…
      </div>
    </div>
  );
}

function Bubble({
  side,
  who,
  children,
}: {
  side: "left" | "right";
  who: string;
  children: React.ReactNode;
}) {
  const isRight = side === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isRight ? 0 : 0.3 }}
      className={`flex ${isRight ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] ${isRight ? "text-right" : "text-left"}`}>
        <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{who}</div>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isRight
              ? "bg-foreground text-background"
              : "border border-hairline bg-surface text-foreground"
          }`}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
