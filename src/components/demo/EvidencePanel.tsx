import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function EvidencePanel() {
  return (
    <div className="flex h-full min-h-[520px] flex-col p-6">
      <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Evidence</span>
        <span>Live</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Metric label="Employees analysed" to={1284} suffix="" />
        <Metric label="Signals reviewed" to={47_920} suffix="" />
        <Metric label="Recommendations" to={12} suffix="" />
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Timeline</div>
        <ul className="space-y-2">
          <TL time="09:04" body="Planner scoped IT department scan" />
          <TL time="09:04" body="Attrition risk model refreshed" />
          <TL time="09:05" body="3 managers flagged for review" />
          <TL time="09:05" body="Recommendation drafted" />
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <ConfidenceMeter value={0.86} />
      </div>
    </div>
  );
}

function Metric({ label, to, suffix }: { label: string; to: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <div ref={ref} className="hairline rounded-2xl bg-surface/60 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl text-foreground">
        {v.toLocaleString("en-IN")}
        {suffix}
      </div>
    </div>
  );
}

function TL({ time, body }: { time: string; body: string }) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]" />
      <span className="w-11 shrink-0 text-[11px] tabular-nums text-muted-foreground">{time}</span>
      <span className="text-foreground/85">{body}</span>
    </li>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="hairline flex items-center gap-4 rounded-2xl bg-surface/60 p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--hairline)"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--brand)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - value) }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-xl text-foreground">
          {pct}%
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Confidence</div>
        <div className="text-sm text-foreground/90">High — 3 corroborating signals</div>
      </div>
    </div>
  );
}
