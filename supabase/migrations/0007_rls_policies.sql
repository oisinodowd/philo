-- =====================================================================
-- RLS Policies for all user-owned tables
-- =====================================================================

-- user_notes: users can only CRUD their own
CREATE POLICY "Users can view own notes"
    ON public.user_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
    ON public.user_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
    ON public.user_notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
    ON public.user_notes FOR DELETE
    USING (auth.uid() = user_id);

-- user_highlights: users can only CRUD their own
CREATE POLICY "Users can view own highlights"
    ON public.user_highlights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own highlights"
    ON public.user_highlights FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own highlights"
    ON public.user_highlights FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own highlights"
    ON public.user_highlights FOR DELETE
    USING (auth.uid() = user_id);

-- voice_notes: users can only CRUD their own
CREATE POLICY "Users can view own voice notes"
    ON public.voice_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own voice notes"
    ON public.voice_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice notes"
    ON public.voice_notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice notes"
    ON public.voice_notes FOR DELETE
    USING (auth.uid() = user_id);

-- energy_charges: users can only read their own
CREATE POLICY "Users can view own energy charges"
    ON public.energy_charges FOR SELECT
    USING (auth.uid() = user_id);

-- subscriptions: users can only read their own
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- usage_events: users can read their own; insert via API only
CREATE POLICY "Users can view own usage events"
    ON public.usage_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create usage events"
    ON public.usage_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- matches: participants can view their matches
CREATE POLICY "Participants can view their matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);

CREATE POLICY "Users can create matches"
    ON public.matches FOR INSERT
    WITH CHECK (auth.uid() = player_a_id);

CREATE POLICY "Participants can update their matches"
    ON public.matches FOR UPDATE
    USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);

-- judges_log: viewable by match participants
CREATE POLICY "Participants can view judges log"
    ON public.judges_log FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.matches m
        WHERE m.id = judges_log.match_id
        AND (m.player_a_id = auth.uid() OR m.player_b_id = auth.uid())
    ));

-- Service role bypass: admin can do everything on all tables
-- (This is handled by service_role key usage, not RLS policies)
