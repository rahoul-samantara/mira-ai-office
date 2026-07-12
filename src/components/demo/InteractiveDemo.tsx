import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { ConversationPanel } from "./ConversationPanel";
import { AgentWorkflow } from "./AgentWorkflow";
import { EvidencePanel } from "./EvidencePanel";

export function InteractiveDemo() {
  return (
    <SurfaceCard className="grain overflow-hidden p-2 md:p-3">
      <div className="hairline overflow-hidden rounded-2xl bg-background/80">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.6_0.15_25)]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.75_0.15_85)]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.15_150)]/60" />
          <span className="ml-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            MIRA · Employee Success Office
          </span>
          <span className="ml-auto text-[11px] text-muted-foreground">Live investigation</span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="bg-background/70">
            <ConversationPanel />
          </div>
          <div className="bg-background/70">
            <AgentWorkflow />
          </div>
          <div className="bg-background/70">
            <EvidencePanel />
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
