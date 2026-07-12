import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NODES = [
  { id: "planner", label: "Planner", role: "Chief of Staff" },
  { id: "dept", label: "Department Health", role: "Diagnostician" },
  { id: "attr", label: "Attrition", role: "Forecaster" },
  { id: "mgr", label: "Manager Effectiveness", role: "Coach" },
  { id: "anly", label: "Analytics", role: "Analyst" },
  { id: "rec", label: "Recommendation", role: "Advisor" },
];

export function AgentWorkflow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % (NODES.length + 1));
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-full min-h-[520px] flex-col overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Agent Office</span>
        <span>Orchestration</span>
      </div>

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_10%,transparent),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-2">
        {NODES.map((n, i) => (
          <div key={n.id} className="flex flex-col items-center">
            <Node label={n.label} role={n.role} state={stateOf(i, active)} />
            {i < NODES.length - 1 && <Connector active={active > i} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function stateOf(i: number, active: number): "done" | "active" | "idle" {
  if (i < active) return "done";
  if (i === active) return "active";
  return "idle";
}

function Node({
  label,
  role,
  state,
}: {
  label: string;
  role: string;
  state: "done" | "active" | "idle";
}) {
  const isActive = state === "active";
  const isDone = state === "done";
  return (
    <motion.div
      layout
      className={`hairline relative w-full rounded-2xl px-4 py-3 backdrop-blur transition-all duration-300 ${
        isActive
          ? "bg-surface-elevated shadow-[0_0_0_1px_color-mix(in_oklab,var(--brand)_50%,transparent),0_0_40px_-4px_color-mix(in_oklab,var(--brand)_45%,transparent)]"
          : isDone
            ? "bg-surface/80"
            : "bg-surface/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`relative flex h-2 w-2 items-center justify-center rounded-full ${
            isActive
              ? "bg-[var(--brand)]"
              : isDone
                ? "bg-[var(--brand-cyan)]"
                : "bg-muted-foreground/40"
          }`}
        >
          {isActive && (
            <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-[var(--brand)]/40" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{label}</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{role}</div>
        </div>
        <span
          className={`text-[10px] uppercase tracking-[0.14em] ${
            isActive ? "text-[var(--brand)]" : isDone ? "text-[var(--brand-cyan)]/80" : "text-muted-foreground/60"
          }`}
        >
          {isActive ? "Running" : isDone ? "Done" : "Queued"}
        </span>
      </div>
    </motion.div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="relative h-6 w-[2px] overflow-hidden">
      <div className="absolute inset-0 bg-hairline" />
      {active && (
        <motion.div
          initial={{ y: -24 }}
          animate={{ y: 24 }}
          transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
          className="absolute left-0 h-3 w-[2px] bg-gradient-to-b from-transparent via-[var(--brand)] to-transparent"
        />
      )}
    </div>
  );
}
