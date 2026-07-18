# Philo Study Section — Development Roadmap

> Target: fully fleshed-out study experience supporting 100+ philosophers with complete works, AI tutoring, annotations, and knowledge graphs.

---

## Current State (Scaffold)

| Layer | Status |
|-------|--------|
| Database schema | ✅ Complete — 9 migrations, all tables + RLS + pgvector |
| Auth (login/signup) | ✅ Working — Supabase email/password |
| Philosopher list page | ⚠️ Static — hardcoded Thomas Aquinas only |
| Philosopher profile page | ⚠️ Static — hardcoded bios, works, links |
| E-Reader page | ⚠️ Static — placeholder passage, no annotation tools wired |
| AI Tutor page | ⚠️ Static — chat UI only, no backend connection |
| `/api/tutor` route | ✅ Working — RAG pipeline, rate limiting, energy spending |
| Knowledge graph component | ❌ Placeholder only |
| Study components (`components/study/`, `components/reader/`) | ❌ All `return null` stubs |
| Admin ingest | ✅ Working — accepts JSON, inserts with embeddings |
| Corpus content | ⚠️ 6 sample passages only |

---

## Phase 1: Dynamic Data Layer

**Goal:** Replace every hardcoded value with live Supabase queries. No more static data anywhere in the study pages.

### 1.1 Server data-fetching layer
Create `lib/data.ts` — all study data functions live here:

```typescript
// lib/data.ts
export async function getPhilosophers(filters?: PhilosopherFilters): Promise<Philosopher[]>
export async function getPhilosopherBySlug(slug: string): Promise<PhilosopherDetail>
export async function getWorks(philosopherId: string): Promise<Work[]>
export async function getChapters(workId: string): Promise<Chapter[]>
export async function getPassage(passageId: string): Promise<Passage>
export async function getPassagesByChapter(chapterId: string): Promise<Passage[]>
export async function getRelatedPhilosophers(philosopherId: string): Promise<RelatedPhilosopher[]>
export async function getUserAnnotations(userId: string, passageId: string): Promise<UserAnnotations>
export async function getUserHighlights(userId: string, passageId: string): Promise<Highlight[]>
export async function searchPhilosophers(query: string): Promise<Philosopher[]>
```

All functions use `createSupabaseServer()` for server components and return typed objects from `types/database.ts`. Include proper `notFound()` throws for missing slugs.

### 1.2 Page conversions
- **`/philo/sophy/page.tsx`** → async server component, calls `getPhilosophers()`
- **`/philo/sophy/[slug]/page.tsx`** → async, calls `getPhilosopherBySlug(slug)` + `getWorks()` + `getRelatedPhilosophers()`
- **`/philo/sophy/[slug]/read/[workId]/[chapter]/[passageId]/page.tsx`** → async, calls `getPassage()` + `getChapters()` + `getUserAnnotations()`
- **`/philo/[suffix]/page.tsx`** → redirects to `/philo/sophy` (only suffix active)
- Generate `metadata` dynamically from DB data on every page

### 1.3 Loading & error states
- Add `loading.tsx` skeletons at each route level
- Add `error.tsx` boundaries with retry buttons
- Add `not-found.tsx` for invalid slugs/IDs

### Files touched
```
lib/data.ts                        (new)
app/(app)/philo/sophy/page.tsx     (rewrite)
app/(app)/philo/sophy/[slug]/page.tsx  (rewrite)
app/(app)/philo/sophy/[slug]/read/[workId]/[chapter]/[passageId]/page.tsx  (rewrite)
app/(app)/philo/sophy/loading.tsx  (new)
app/(app)/philo/sophy/error.tsx    (new)
app/(app)/philo/sophy/[slug]/loading.tsx  (new)
app/(app)/philo/sophy/[slug]/not-found.tsx  (new)
```

---

## Phase 2: Philosopher Browser

**Goal:** Searchable, filterable, sortable philosopher directory that scales to 100+ entries with sub-100ms response times.

### 2.1 Search
- **Fuzzy name search** using PostgreSQL `pg_trgm` with `ilike` + `similarity()`:
  ```sql
  SELECT *, similarity(name, $query) AS sim
  FROM philosophers
  WHERE published = true AND name % $query
  ORDER BY sim DESC
  LIMIT 25;
  ```
- Debounced input (300ms), results appear as user types
- Keyboard-accessible with `aria-combobox` pattern
- `useSearchParams` to make search query URL-shareable (`?q=aristotle`)

### 2.2 Filter bar
- **Time Period:** dual-thumb range slider (BCE → CE). Min/max computed from DB min/max birth years. URL: `?from=-500&to=1500`
- **Tradition:** checkbox group — Analytic, Continental, Scholastic, Islamic, Indian, Chinese, African. AND logic across filter types. URL: `?tradition=Scholastic,Islamic`
- **Category:** checkbox group — Epistemology, Metaphysics, Theology, Ethics, Logic, Aesthetics, Political, Natural Philosophy. AND logic. URL: `?category=Theology,Ethics`
- Active filter count badge on the filter button
- "Clear all filters" link when any filter is active
- Mobile: filter sheet slides up from bottom. Desktop: sticky sidebar

### 2.3 Sorting
- Dropdown: Name (A-Z), Name (Z-A), Birth Year (oldest first), Birth Year (newest first), Works Count (most first)
- URL: `?sort=birth_asc`

### 2.4 Philosopher cards
- Circular avatar placeholder with initial letter (colored by tradition)
- Name, lifespan, tradition + category badges, work count, short bio (2-line clamp)
- Hover: subtle border highlight, scale 1.01, shadow
- Click: navigate to profile with Next.js `<Link>` prefetch
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop

### 2.5 Pagination
- Server-side with `LIMIT`/`OFFSET` or cursor-based for 100+ entries
- 24 per page on desktop, 12 on mobile
- Page numbers + prev/next, URL: `?page=3`
- Total count display ("Showing 1–24 of 127 philosophers")

### Files touched
```
lib/data.ts                        (add getPhilosophers, searchPhilosophers)
components/study/philosopher-search.tsx  (new)
components/study/filter-bar.tsx    (new, replaces stub)
components/study/time-slider.tsx   (new)
components/study/philosopher-card.tsx  (new)
components/study/philosopher-grid.tsx  (new)
components/study/pagination.tsx    (new)
app/(app)/philo/sophy/page.tsx     (rewrite with full interactivity)
```

---

## Phase 3: Philosopher Profile

**Goal:** Rich, editorial profile page for each philosopher that feels scholarly — not a database dump.

### 3.1 Profile header
- Large avatar (200px initial letter + tradition-colored gradient background)
- Full name + native name + honorifics from DB
- Life dates (`1225–1274`) formatted with approximate marker (`c.` prefix when year is uncertain)
- Full bio (`bio_full` field) rendered from DB with proper typography
- Tradition + category badges, linked to filtered philosopher list
- "Read Works" and "Talk to His AI" CTAs (real links to works list + tutor)

### 3.2 Works list
- Sortable table/grid of works with: title, original title, year, language, chapter count, source
- Sort by: title, year, chapter count
- Each work links to its first chapter's first passage or a work-level landing page
- "Coming soon" badge for works with 0 chapters
- Expandable description per work

### 3.3 Related philosophers
- Horizontal scrollable row of philosopher cards
- Relation type label: "Influenced by", "Influenced", "Contemporaries", "Opposed"
- Sourced from `philosopher_relations` table

### 3.4 Mini knowledge graph
- 200px embedded graph showing this philosopher + related philosophers as nodes
- Simple force layout, no interaction needed at this size
- Tap/click expands to full Knowledge Graph tab

### 3.5 Metadata & SEO
- Dynamic `metadata` export with philosopher name, bio, OG image
- Structured data (Schema.org `Person`) for rich search results
- Canonical URL

### Files touched
```
components/study/philosopher-header.tsx  (new)
components/study/works-list.tsx     (new)
components/study/related-philosophers.tsx  (new)
components/study/mini-graph.tsx     (new)
app/(app)/philo/sophy/[slug]/page.tsx  (rewrite)
```

---

## Phase 4: E-Reader

**Goal:** A clean, distraction-free reading experience with annotation tools that feel native. This is the heart of the study experience.

### 4.1 Passage rendering
- Fetch `passage.content` from DB by `passageId`
- Render with proper typography: serif font (`font-serif`), comfortable line height (1.8), max-width ~65ch, generous padding
- Anchor badge at bottom: `thomas-aquinas:st:1:1:1` — styled as a subtle pill
- Breadcrumb: Philosopher → Work → Chapter → Article
- Previous/Next passage navigation (prev/next in same chapter, then cross-chapter)

### 4.2 Chapter navigation
- **Desktop:** collapsible sidebar with chapter tree (indented by hierarchy)
- **Mobile:** bottom sheet triggered by a chapter-list button in header
- Active chapter highlighted; scrolls into view on load
- Chapter progress indicator (X of Y passages read, based on user's reading history)

### 4.3 Text selection & highlighting
- User selects text with mouse/touch → floating toolbar appears
- Toolbar: Highlight (4 color options), Add Note, Cancel
- Highlight saved to `user_highlights` with `start_offset`, `end_offset`, `color`
- Highlighted text renders with background color overlay
- Click existing highlight → shows note if attached, or option to delete highlight
- Highlights persist across sessions, loaded on page entry

### 4.4 Note editor
- **Desktop:** side panel (right, 320px) showing all notes for current passage
- **Mobile:** full-screen sheet triggered by note button
- Rich text? No — keep it simple: plain text with markdown rendering on display
- Auto-save with debounce (1.5s after last keystroke)
- Note is bound to `passage_id` forever via stable anchor
- Show created/updated timestamps
- Delete note with confirmation dialog

### 4.5 Voice notes
- **Record button** in toolbar triggers browser `MediaRecorder` API
- Recording UI: waveform visualization, timer, pause/resume, stop
- Max duration: `PHILO_VOICE_NOTE_MAX_SECONDS` (default 300s / 5 min)
- On stop: upload MP3 to Supabase Storage (`voice_notes` bucket)
- Call `/api/voice/transcribe` → Deepgram Nova-3 → store transcript + audio URL in `voice_notes`
- Transcription appears as a note in the notes panel, tagged with 🎤 icon
- Playback: inline audio player on the transcription note
- Free tier: configurable cap on voice notes per day

### 4.6 Reader toolbar
- Font size adjustment (small / medium / large) — stored in localStorage
- Theme toggle (light / sepia / dark) — applies to reader area only
- Fullscreen mode toggle

### Files touched
```
components/reader/passage-content.tsx  (new)
components/reader/chapter-nav.tsx      (new)
components/reader/chapter-nav-mobile.tsx  (new)
components/reader/highlight-toolbar.tsx  (new)
components/reader/highlight-renderer.tsx  (new)
components/reader/note-panel.tsx       (new)
components/reader/note-editor.tsx      (new)
components/reader/voice-recorder.tsx   (new)
components/reader/reader-toolbar.tsx   (new)
components/reader/reader-controls.tsx  (new)
app/api/voice/transcribe/route.ts      (new)
app/(app)/philo/sophy/[slug]/read/[workId]/[chapter]/[passageId]/page.tsx  (rewrite)
```

---

## Phase 5: AI Tutor

**Goal:** A polished chat experience where users converse with any philosopher, with answers strictly grounded in the corpus via RAG.

### 5.1 Chat interface
- Message bubbles: philosopher on left (with small avatar), user on right
- Philosopher's greeting at top — sourced from `system_prompt` intro or a friendly default
- Auto-scroll to bottom on new message, with "scroll to bottom" button if scrolled up
- Loading state: animated ellipsis (`...`) in philosopher bubble while waiting
- Timestamps on hover (relative: "2 min ago")
- Empty state: suggested questions (3–5) generated from philosopher's key topics

### 5.2 Streaming
- Migrate `/api/tutor` from single-response to streaming via `ai` SDK or raw `ReadableStream`
- Token-by-token text rendering (typewriter effect) in the philosopher bubble
- Citations stream inline as bracketed numbers `[1]`, `[2]` → rendered as clickable pills

### 5.3 RAG pipeline (already built in `lib/rag.ts`)
- Embed user question → `match_passages` RPC (pgvector cosine) → top 8 passages → build context → GPT-4o-mini → validate with Zod
- Add: pass full philosopher `system_prompt` from DB
- Add: track citations and render them as links that navigate to the cited passage in the reader

### 5.4 Citation rendering
- Each citation: `[Work, Chapter, §offset]` with a link to `/philo/sophy/{slug}/read/{workId}/{chapter}/{passageId}`
- Hover on citation → tooltip preview of the cited text (first 200 chars)
- Click → opens passage in a new tab or slides open a side panel with the passage

### 5.5 Refusal gate
- `PHILO_REFUSAL_COSINE_THRESHOLD` check BEFORE calling GPT
- If max similarity < threshold: don't spend tokens, return editorial refusal with related philosopher suggestions from `philosopher_relations`
- Display refusal message in a distinct style (amber/warning tone)

### 5.6 Rate limiting & energy
- Free tier: 20 AI queries/day (configurable)
- Per-minute rate limit: 5 queries max in 60s window
- Energy charge: 1 charge per tutor query
- Show remaining queries in chat header (pill: "12 queries left today")
- When limit reached: show premium upsell CTA with Stripe checkout link

### 5.7 Session management
- Chat history stored in `localStorage` keyed by `tutor-{philosopherId}`
- "Clear conversation" button
- Export conversation as markdown or PDF? Out of scope for this phase — leave stubbed

### Files touched
```
components/tutor/chat-bubble.tsx    (new)
components/tutor/chat-input.tsx     (new)
components/tutor/citation-tooltip.tsx  (new)
components/tutor/refusal-message.tsx   (new)
components/tutor/suggested-questions.tsx  (new)
app/api/tutor/route.ts              (rewrite for streaming)
app/(app)/philo/sophy/[slug]/tutor/page.tsx  (rewrite)
```

---

## Phase 6: Knowledge Graph

**Goal:** A per-user, force-directed knowledge graph that visualizes the user's intellectual journey through the corpus.

### 6.1 Data model
- **Nodes:** every passage the user has read or annotated
  - Unread but in the corpus: not shown (too many nodes)
  - Read: small node, neutral color
  - Highlighted: medium node, colored by passage category
  - Annotated (note attached): large node, brighter color
- **Edges:** connect passages that share:
  - Same work (co-reading)
  - Same category or tradition
  - Co-annotation (both annotated in same session)
- Edge weight proportional to number of shared attributes

### 6.2 Visualization (`react-force-graph`)
- `ForceGraph2D` with `d3-force` simulation
- Node size: 3px (read) → 8px (annotated), scaled by annotation depth
- Node color: mapped to category palette (Epistemology=blue, Ethics=green, Theology=gold, etc.)
- Edge opacity: 0.15–0.4 based on weight
- Hover on node: tooltip with passage title, work name, annotation count
- Click on node: navigate to passage in reader
- Zoom + pan with mouse/touch; reset view button
- Responsive: full viewport height on desktop, half-height card on mobile

### 6.3 Philosophical Profile panel
- Side panel or modal triggered by a "Profile" button on the graph
- **Most-read philosopher** — name + works count
- **Dominant tradition** — pie chart or percentage bar
- **Top category** — same
- **Total passages read / annotated** — counters
- **Closeness vector to canonical philosophers** — cosine similarity over per-category tag density. e.g. "Your reading profile is 78% similar to Aquinas, 54% to Aristotle"
- **Streak & energy** — pulled from `energy_charges`

### 6.4 Filter controls
- Date range slider for annotations
- Toggle: show only annotated nodes, show only highlighted nodes, show all
- Category/tradition filter pills

### Files touched
```
components/graph/knowledge-graph.tsx    (rewrite from placeholder)
components/graph/graph-controls.tsx     (new)
components/graph/philosophical-profile.tsx  (new)
components/graph/node-tooltip.tsx       (new)
lib/graph.ts                            (new — graph data builder)
app/(app)/account/page.tsx              (rewrite with full graph)
app/(app)/philo/sophy/[slug]/[slug]/page.tsx  (add mini-graph embed)
```

---

## Phase 7: Study Resources

**Goal:** AI-generated study aids gated by energy/subscription tier, giving premium users real value.

### 7.1 Slide decks
- Trigger: "Generate Slide Deck" button on any philosopher profile or chapter
- AI prompt: "Create a 10-slide markdown outline covering {topic} based on the following passages..."
- Output: Markdown with `---` slide separators, rendered as a carousel or printable view
- Free tier: 3 slides max; Premium: 20 slides
- Export: copy markdown, download as `.md`
- Energy cost: 3 charges (free), 0 (premium)

### 7.2 Mind maps
- Trigger: "Generate Mind Map" button
- AI prompt: "Create a JSON tree structure mapping the conceptual relationships in {topic}..."
- Output: JSON tree rendered as an interactive collapsible tree or simple D3 tree
- Free tier: 3 levels deep; Premium: unlimited
- Export: PNG (html2canvas), JSON download

### 7.3 Study notes
- Trigger: "Generate Study Notes" on a chapter or work
- AI prompt: "Summarize the following passages into concise study notes with key arguments, objections, and conclusions..."
- Output: formatted markdown rendered with headings, bullet points, bold key terms
- Length budget: 500 words (free), 5000 words (premium)
- Save notes to `user_notes` bound to the chapter/work
- "Regenerate" button, "Append to my notes" button

### 7.4 Resource generation endpoint
- New API route: `/api/study/generate` — accepts `type`, `resource_id`, `format`
- Applies energy check + premium gating
- Returns generated content
- Rate limited separately from AI tutor queries

### Files touched
```
components/study/resource-generator.tsx   (new)
components/study/slide-deck-viewer.tsx    (new)
components/study/mind-map-viewer.tsx      (new)
app/api/study/generate/route.ts           (new)
lib/energy.ts                             (add spendForResource function)
```

---

## Phase 8: Corpus Scaling Pipeline

**Goal:** A repeatable, efficient process for ingesting 100+ philosophers and their complete works.

### 8.1 Bulk manifest format
Extend the manifest schema to support multiple philosophers in one submission:
```json
{
  "philosophers": [
    {
      "slug": "aristotle",
      "name": "Aristotle",
      "metadata": { ... },
      "works": [ ... ]
    }
  ]
}
```

### 8.2 Improved admin ingest page
- File upload (drag-and-drop JSON)
- Progress bar per philosopher (works created / chapters / passages / embeddings)
- Validation: pre-flight check that catches schema errors before any DB writes
- Dry-run mode: validates manifest without inserting
- Resume: skip already-ingested passages (dedupe by content_hash)
- Rollback: delete all passages for a given manifest batch

### 8.3 Async embedding queue
- Instead of embedding inline (which blocks the response), queue embedding jobs
- New table: `embedding_jobs` — `passage_id`, `status` (pending/processing/done/failed), `attempts`
- Background worker: Next.js route handler hit by a cron or admin-triggered endpoint
- Or: Supabase Edge Function triggered by new `passages` rows
- Batch embedding: send multiple texts to OpenAI in one API call (up to 2048 inputs per batch with `text-embedding-3-small`)

### 8.4 Automated manifest generators
Write Node.js scripts (not part of the Next.js app, in `scripts/`) that:
- Scrape Project Gutenberg for a given work → structured manifest
- Parse Internet Archive MARC records → philosopher metadata + work list
- Extract structured data from Wikipedia infoboxes → philosopher metadata
- Combine sources into a single manifest file

Scripts live in `scripts/ingest/` and are run from the command line:
```bash
npx ts-node scripts/ingest/gutenberg-to-manifest.ts --url https://www.gutenberg.org/ebooks/17611 --philosopher thomas-aquinas --work "Summa Theologica" > manifests/aquinas-summa.json
```

### 8.5 100+ Philosopher priority list
The plan for selecting and ordering philosophers (stored in `docs/philosopher-priority.md`):

**Tier 1 — Foundational (0–20):** Plato, Aristotle, Augustine, Aquinas, Descartes, Hume, Kant, Hegel, Nietzsche, Kierkegaard, Wittgenstein, Heidegger, Sartre, Arendt, Beauvoir, Confucius, Laozi, Ibn Sina, Al-Ghazali, Sankara

**Tier 2 — Major (21–50):** Anselm, Boethius, Maimonides, Spinoza, Leibniz, Locke, Berkeley, Rousseau, Mill, Marx, Schopenhauer, Peirce, James, Dewey, Russell, Husserl, Merleau-Ponty, Levinas, Derrida, Foucault, Rawls, Nozick, MacIntyre, Nagarjuna, Zhuangzi, Mencius, Ibn Rushd, Mulla Sadra, Ramanuja, Dogen

**Tier 3 — Significant (51–80):** 30 more across traditions — fill based on corpus gaps

**Tier 4 — Specialized (81–100+):** Niche philosophers, contemporary thinkers, underrepresented traditions

### 8.6 Content sources per philosopher
Each entry in the priority list maps to one or more sources:
- Project Gutenberg (English translations of public domain works)
- Internet Archive (scanned editions)
- Wikisource (transcribed texts)
- Stanford Encyclopedia of Philosophy (bios, not passages)
- Wikipedia (metadata only)

### Files touched
```
scripts/ingest/gutenberg-to-manifest.ts   (new)
scripts/ingest/ia-metadata-extractor.ts   (new)
scripts/ingest/wikipedia-extractor.ts     (new)
docs/philosopher-priority.md              (new)
app/admin/ingest/page.tsx                 (enhance)
app/api/admin/ingest/route.ts             (add batching + async embedding)
supabase/migrations/0010_embedding_jobs.sql  (new)
```

---

## Phase 9: Premium & Economy Integration

**Goal:** The energy/subscription layer is fully integrated into the study experience.

### 9.1 Energy dashboard
- Display on `/account` page: current balance, streak, premium status
- Streak calendar (GitHub-style contribution grid) showing daily check-ins
- "Claim daily bonus" button (calls `applyDailyCheckin`)
- Transaction history: where charges were spent (tutor queries, resource generation, debate matches)

### 9.2 Premium gating
- Free tier gated features: AI tutor query cap, resource length budget, voice note cap
- Premium: all caps removed, badges displayed on profile
- Premium upsell: modal or inline CTA when user hits a free-tier limit
- Stripe Checkout integration for subscription purchase
- Stripe Customer Portal for managing subscription

### 9.3 Streak rewards
- Visual streak tracker on account page
- Badge milestones: 3-day, 7-day, 30-day, 100-day streaks
- Each milestone grants bonus charges or a 1-hour premium unlock
- Badge display: SVG icons rendered inline

### 9.4 One-off premium unlocks
- "1-hour premium pass" purchasable via Stripe (one-off product)
- During the hour: all premium features unlocked
- Timer displayed in header during active pass
- Pass stored in `subscriptions` table with `current_period_end`

### Files touched
```
components/account/energy-dashboard.tsx   (new)
components/account/streak-calendar.tsx    (new)
components/account/premium-upsell.tsx     (new)
components/account/badge-display.tsx      (new)
app/(app)/account/page.tsx                (rewrite)
lib/energy.ts                             (enhance with transaction history)
app/api/stripe/checkout/route.ts          (new)
app/api/stripe/portal/route.ts            (new)
```

---

## Phase 10: Polish & Performance

**Goal:** Production-quality UX, performance, and accessibility.

### 10.1 Loading states
- Skeleton screens for every data-dependent component (philosopher cards, passage content, graph, tutor messages)
- Use Next.js `loading.tsx` + React `Suspense` boundaries
- Streaming SSR where possible (`loading.js` at route level)

### 10.2 Error boundaries
- Per-route `error.tsx` with friendly messages + retry
- Global error boundary in root layout for uncaught errors
- API error handling: consistent JSON error format, appropriate status codes

### 10.3 Caching strategy
- Next.js `fetch` cache for philosopher list (revalidate every 5 min via `next.revalidate`)
- Supabase Realtime subscription for annotation updates (highlights/notes sync across tabs)
- `unstable_cache` for expensive DB queries (related philosophers, works list)
- ISR for philosopher profile pages (revalidate on content update webhook)

### 10.4 Accessibility
- Full keyboard navigation on all interactive elements
- Screen reader labels (`aria-label`, `aria-describedby`) on icons and icon-only buttons
- Focus management: trap focus in modals/sheets, restore on close
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Reduced motion: respect `prefers-reduced-motion` for animations
- Semantic HTML: proper heading hierarchy, landmark regions

### 10.5 Mobile refinements
- Bottom tab bar: Study, Debate, Account — persistent across app routes
- Gesture: swipe back on reader (browser-native), pull-to-refresh on philosopher list
- Touch targets: minimum 44×44px (WCAG AAA)
- Safe area padding for notched phones
- Orientation: reader works in both portrait and landscape

### 10.6 Performance
- Bundle analysis: `@next/bundle-analyzer` to find large chunks
- `react-force-graph` lazy-loaded with `next/dynamic` (it's heavy)
- Image optimization: `next/image` for any avatars/illustrations
- Font loading: `next/font` with `font-display: swap`
- Core Web Vitals: monitor with `@vercel/speed-insights`

### Files touched
```
app/(app)/layout.tsx                    (add bottom tab bar)
app/(app)/philo/sophy/loading.tsx       (enhance)
app/(app)/philo/sophy/error.tsx         (enhance)
app/error.tsx                           (new global error boundary)
components/ui/skeleton.tsx              (new)
next.config.ts                          (add bundle-analyzer config)
```

---

## Dependency Graph

```
Phase 1 ──► Phase 2 ──► Phase 3
                │            │
                ▼            ▼
            Phase 4 ◄─── Phase 6 (parallel with 4)
                │            │
                ▼            │
            Phase 5 ◄────────┘
                │
                ▼
            Phase 7 ──► Phase 9
                              │
            Phase 8 ─────────┘
                │
                ▼
            Phase 10 (ongoing, applies to all phases)
```

- **Phases 1–3 are linear** — each builds on the previous.
- **Phases 4 and 6 can run in parallel** — the reader and graph share no code dependency.
- **Phase 5 depends on 4** — citations link to reader passages.
- **Phase 7 depends on 5** — shares the AI generation pipeline.
- **Phase 8 runs independently** — it's a content pipeline, not a feature.
- **Phase 9 depends on 7** — gates the resource generation.
- **Phase 10 is continuous** — applied incrementally throughout all phases.

---

## Estimated Effort

| Phase | Description | Est. Files | Est. Hours |
|-------|-------------|-----------|------------|
| 1 | Dynamic data layer | ~12 | 6–8 |
| 2 | Philosopher browser | ~8 | 10–14 |
| 3 | Philosopher profile | ~4 | 6–8 |
| 4 | E-Reader (full) | ~12 | 16–22 |
| 5 | AI Tutor | ~6 | 10–14 |
| 6 | Knowledge graph | ~5 | 12–16 |
| 7 | Study resources | ~4 | 8–10 |
| 8 | Corpus scaling | ~8 | 14–20 |
| 9 | Premium & economy | ~6 | 8–12 |
| 10 | Polish | ~5 | 10–14 |
| **Total** | | **~70 files** | **100–138 hours** |

---

## Post-Roadmap: Beyond 100 Philosophers

After Phase 10, the study section is feature-complete. The ongoing work shifts to:

- **Corpus growth:** continuous ingestion of new philosophers and works
- **Community features:** shared annotations, public reading lists, discussion threads per passage
- **Multi-language:** original-language texts side-by-side with translations
- **Advanced AI:** philosopher vs. philosopher debates, cross-reference analysis, argument mapping
- **Academic tools:** citation export (BibTeX, MLA, Chicago), Zotero integration
