import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="relative z-40 border-b border-hairline bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2.5 text-xs text-muted-foreground">
        <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand)]" />
        <span>
          Launch offer — <span className="text-foreground">₹49 for 48 hours</span> of MIRA. Ends this quarter.
        </span>
        <button
          onClick={() => setHidden(true)}
          className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
          aria-label="Dismiss announcement"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
