import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SurfaceCard({
  children,
  className,
  elevated,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "hairline rounded-3xl",
        elevated ? "bg-surface-elevated" : "bg-surface",
        "shadow-[0_1px_0_0_oklch(1_0_0_/_0.04)_inset,0_20px_60px_-30px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
