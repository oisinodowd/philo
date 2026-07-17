-- Debate matches
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_type TEXT NOT NULL CHECK (match_type IN ('practice', 'unranked', 'ranked')),
    topic TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'open',
    player_a_id UUID NOT NULL REFERENCES auth.users(id),
    player_b_id UUID REFERENCES auth.users(id),
    side_a TEXT NOT NULL DEFAULT 'proposition',
    side_b TEXT NOT NULL DEFAULT 'opposition',
    status TEXT NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'completed', 'cancelled')),
    winner_id UUID REFERENCES auth.users(id),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_type ON public.matches(match_type);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_player_a ON public.matches(player_a_id);
CREATE INDEX idx_matches_player_b ON public.matches(player_b_id);

-- Judges log
CREATE TABLE IF NOT EXISTS public.judges_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    persona TEXT NOT NULL,
    section_id TEXT NOT NULL,
    score_a NUMERIC(5,2) NOT NULL,
    score_b NUMERIC(5,2) NOT NULL,
    reasoning_short TEXT NOT NULL,
    reasoning_full TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_judges_log_match ON public.judges_log(match_id);

-- Leaderboards
CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL DEFAULT 1000,
    peak_rating INTEGER NOT NULL DEFAULT 1000,
    win_streak INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    total_losses INTEGER NOT NULL DEFAULT 0,
    ranked_games_played INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leaderboards_rating ON public.leaderboards(rating DESC);
CREATE INDEX idx_leaderboards_win_streak ON public.leaderboards(win_streak DESC);

-- View for weekly top
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT
    l.user_id,
    p.display_name,
    l.rating,
    l.peak_rating,
    l.win_streak,
    l.total_wins,
    l.total_losses,
    l.ranked_games_played
FROM public.leaderboards l
JOIN public.profiles p ON l.user_id = p.user_id
ORDER BY l.rating DESC;

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judges_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Leaderboards viewable by all
CREATE POLICY "Leaderboards are publicly viewable"
    ON public.leaderboards FOR SELECT
    USING (true);
