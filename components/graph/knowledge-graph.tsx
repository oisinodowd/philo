"use client";

/**
 * Knowledge graph placeholder component.
 * Will be wired to react-force-graph + d3-force in a future iteration.
 */

import { Network } from "lucide-react";

export default function KnowledgeGraphPlaceholder() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center border rounded-lg border-dashed bg-card/30">
      <div className="text-center">
        <Network className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">
          Knowledge graph visualization coming soon.
        </p>
      </div>
    </div>
  );
}
