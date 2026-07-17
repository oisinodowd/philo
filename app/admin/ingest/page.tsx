"use client";

/**
 * Admin ingest page — service-role gated.
 * Upload JSON manifests to populate the corpus.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminIngestPage() {
  const [apiKey, setApiKey] = useState("");
  const [manifest, setManifest] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const parsed = JSON.parse(manifest);
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${String(err)}`);
    }
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="font-serif text-2xl font-bold mb-2">Admin: Corpus Ingest</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Service-role gated. Paste the full JSON manifest below.
      </p>

      <div className="space-y-6">
        <div>
          <Label htmlFor="api-key">Service Role Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="supabase service role key"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="manifest">JSON Manifest</Label>
          <ScrollArea className="h-64 mt-1 border rounded-md">
            <textarea
              id="manifest"
              className="w-full h-full min-h-[250px] p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
              value={manifest}
              onChange={(e) => setManifest(e.target.value)}
              placeholder={`{
  "philosopher_slug": "thomas-aquinas",
  "works": [...]
}`}
            />
          </ScrollArea>
        </div>

        <Button onClick={handleSubmit} disabled={loading || !apiKey || !manifest}>
          {loading ? "Ingesting..." : "Submit for Review"}
        </Button>

        {result && (
          <pre className="p-4 rounded-lg border bg-card text-sm font-mono whitespace-pre-wrap overflow-auto max-h-96">
            {result}
          </pre>
        )}
      </div>

      <div className="mt-12 p-6 rounded-lg border bg-card/50">
        <h2 className="font-serif text-lg font-semibold mb-2">Manifest Format</h2>
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
{`{
  "philosopher_slug": "thomas-aquinas",
  "works": [
    {
      "title": "Summa Theologica",
      "title_original": "Summa Theologiae",
      "year_written": 1274,
      "language": "la",
      "source_url": "https://...",
      "chapters": [
        {
          "chapter_number": 1,
          "title": "Treatise on Sacred Doctrine",
          "passages": [
            {
              "passage_offset": 1,
              "content": "Whether, besides philosophy..."
            }
          ]
        }
      ]
    }
  ]
}`}
        </pre>
        <p className="text-xs text-muted-foreground mt-4">
          Works and passages are deduplicated by (work_id, passage_offset,
          content_hash). A human reviewer must approve passages before they are
          published. Embeddings are generated asynchronously on ingest.
        </p>
      </div>
    </div>
  );
}
