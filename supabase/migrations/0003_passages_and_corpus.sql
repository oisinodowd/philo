-- Philosophers table
CREATE TABLE IF NOT EXISTS public.philosophers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_native TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    tradition TEXT,
    category TEXT,
    bio_short TEXT,
    bio_full TEXT,
    avatar_url TEXT,
    system_prompt TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_philosophers_slug ON public.philosophers(slug);
CREATE INDEX idx_philosophers_tradition ON public.philosophers(tradition);
CREATE INDEX idx_philosophers_category ON public.philosophers(category);
CREATE INDEX idx_philosophers_birth_year ON public.philosophers(birth_year);

-- Works
CREATE TABLE IF NOT EXISTS public.works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    philosopher_id UUID NOT NULL REFERENCES public.philosophers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_original TEXT,
    year_written INTEGER,
    language TEXT DEFAULT 'en',
    source_url TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_works_philosopher ON public.works(philosopher_id);

-- Chapters
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chapters_work ON public.chapters(work_id);

-- Passages with vector embedding
CREATE TABLE IF NOT EXISTS public.passages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    passage_offset INTEGER NOT NULL,
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    embedding VECTOR(1536),
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_passages_work ON public.passages(work_id);
CREATE INDEX idx_passages_chapter ON public.passages(chapter_id);
CREATE INDEX idx_passages_content_hash ON public.passages(content_hash);
CREATE UNIQUE INDEX idx_passages_dedupe ON public.passages(work_id, passage_offset, content_hash);

-- pgvector index for similarity search
CREATE INDEX IF NOT EXISTS idx_passages_embedding
    ON public.passages
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Philosopher relations
CREATE TABLE IF NOT EXISTS public.philosopher_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    philosopher_id UUID NOT NULL REFERENCES public.philosophers(id) ON DELETE CASCADE,
    related_philosopher_id UUID NOT NULL REFERENCES public.philosophers(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL DEFAULT 'related',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(philosopher_id, related_philosopher_id, relation_type)
);

CREATE INDEX idx_phil_rel_phil ON public.philosopher_relations(philosopher_id);

-- Enable RLS
ALTER TABLE public.philosophers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philosopher_relations ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Published content is publicly readable"
    ON public.philosophers FOR SELECT
    USING (published = true);

CREATE POLICY "Published works are publicly readable"
    ON public.works FOR SELECT
    USING (published = true);

CREATE POLICY "Published chapters are publicly readable"
    ON public.chapters FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.works w
        WHERE w.id = chapters.work_id AND w.published = true
    ));

CREATE POLICY "Published passages are publicly readable"
    ON public.passages FOR SELECT
    USING (published = true);

CREATE POLICY "Philosopher relations are publicly readable"
    ON public.philosopher_relations FOR SELECT
    USING (true);

-- Apply triggers
CREATE TRIGGER update_philosophers_updated_at
    BEFORE UPDATE ON public.philosophers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON public.works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
