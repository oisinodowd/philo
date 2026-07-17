-- User notes on passages
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    passage_id UUID NOT NULL REFERENCES public.passages(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_notes_user ON public.user_notes(user_id);
CREATE INDEX idx_user_notes_passage ON public.user_notes(passage_id);

-- User highlights
CREATE TABLE IF NOT EXISTS public.user_highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    passage_id UUID NOT NULL REFERENCES public.passages(id) ON DELETE CASCADE,
    start_offset INTEGER NOT NULL,
    end_offset INTEGER NOT NULL,
    color TEXT DEFAULT '#f5e6c8',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_highlights_user ON public.user_highlights(user_id);
CREATE INDEX idx_user_highlights_passage ON public.user_highlights(passage_id);

-- Voice notes
CREATE TABLE IF NOT EXISTS public.voice_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    passage_id UUID NOT NULL REFERENCES public.passages(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    transcript TEXT,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_voice_notes_user ON public.voice_notes(user_id);
CREATE INDEX idx_voice_notes_passage ON public.voice_notes(passage_id);

-- Enable RLS
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;

-- Apply triggers
CREATE TRIGGER update_user_notes_updated_at
    BEFORE UPDATE ON public.user_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
