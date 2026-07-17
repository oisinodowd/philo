-- Add unique constraints for upsert operations
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'works_philosopher_title_unique') THEN
        ALTER TABLE public.works ADD CONSTRAINT works_philosopher_title_unique UNIQUE (philosopher_id, title);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chapters_work_chapter_unique') THEN
        ALTER TABLE public.chapters ADD CONSTRAINT chapters_work_chapter_unique UNIQUE (work_id, chapter_number);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'passages_work_offset_hash_unique') THEN
        ALTER TABLE public.passages ADD CONSTRAINT passages_work_offset_hash_unique UNIQUE (work_id, passage_offset, content_hash);
    END IF;
END $$;

-- =====================================================================
-- match_passages RPC for pgvector similarity search
-- Used by the RAG pipeline in lib/rag.ts
-- =====================================================================
CREATE OR REPLACE FUNCTION public.match_passages(
    query_embedding VECTOR(1536),
    match_count INT DEFAULT 8,
    filter_philosopher_id UUID DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    content TEXT,
    work_title TEXT,
    chapter_title TEXT,
    passage_offset INT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.content,
        w.title AS work_title,
        c.title AS chapter_title,
        p.passage_offset,
        1 - (p.embedding <=> query_embedding) AS similarity
    FROM public.passages p
    JOIN public.works w ON p.work_id = w.id
    JOIN public.chapters c ON p.chapter_id = c.id
    WHERE
        p.published = true
        AND p.embedding IS NOT NULL
        AND (filter_philosopher_id IS NULL OR w.philosopher_id = filter_philosopher_id)
    ORDER BY p.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Create Supabase Storage bucket for voice notes
-- Note: This must be run via the Supabase dashboard SQL editor or API,
-- as CREATE BUCKET is a Supabase-specific extension.
-- Run separately: SELECT storage.create_bucket('voice_notes', '{"public": false}');
