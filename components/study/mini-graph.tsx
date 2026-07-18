"use client";

import { Network } from "lucide-react";

interface Props {
  philosopherId: string;
  philosopherSlug: string;
}

export function KnowledgeGraphMini({ philosopherId, philosopherSlug }: Props) {
  return (
    <div className="scholar-card h-48 flex items-center justify-center border-dashed">
      <div className="text-center">
        <Network className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">
          Read and annotate works to build your knowledge graph.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Available on the Account page as you engage with the corpus.
        </p>
      </div>
    </div>
  );
}
