export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      philosophers: {
        Row: {
          id: string;
          slug: string;
          name: string;
          name_native: string | null;
          birth_year: number | null;
          death_year: number | null;
          tradition: string | null;
          category: string | null;
          bio_short: string | null;
          bio_full: string | null;
          avatar_url: string | null;
          system_prompt: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          name_native?: string | null;
          birth_year?: number | null;
          death_year?: number | null;
          tradition?: string | null;
          category?: string | null;
          bio_short?: string | null;
          bio_full?: string | null;
          avatar_url?: string | null;
          system_prompt?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["philosophers"]["Insert"]>;
      };
      philosopher_relations: {
        Row: {
          id: string;
          philosopher_id: string;
          related_philosopher_id: string;
          relation_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          philosopher_id: string;
          related_philosopher_id: string;
          relation_type: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["philosopher_relations"]["Insert"]>;
      };
      works: {
        Row: {
          id: string;
          philosopher_id: string;
          title: string;
          title_original: string | null;
          year_written: number | null;
          language: string | null;
          source_url: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          philosopher_id: string;
          title: string;
          title_original?: string | null;
          year_written?: number | null;
          language?: string | null;
          source_url?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["works"]["Insert"]>;
      };
      chapters: {
        Row: {
          id: string;
          work_id: string;
          chapter_number: number;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          chapter_number: number;
          title: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chapters"]["Insert"]>;
      };
      passages: {
        Row: {
          id: string;
          work_id: string;
          chapter_id: string;
          passage_offset: number;
          content: string;
          content_hash: string;
          embedding: number[] | null;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          chapter_id: string;
          passage_offset: number;
          content: string;
          content_hash: string;
          embedding?: number[] | null;
          published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["passages"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          favorite_traditions: string[] | null;
          favorite_categories: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          favorite_traditions?: string[] | null;
          favorite_categories?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      user_notes: {
        Row: {
          id: string;
          user_id: string;
          passage_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passage_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_notes"]["Insert"]>;
      };
      user_highlights: {
        Row: {
          id: string;
          user_id: string;
          passage_id: string;
          start_offset: number;
          end_offset: number;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passage_id: string;
          start_offset: number;
          end_offset: number;
          color?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_highlights"]["Insert"]>;
      };
      voice_notes: {
        Row: {
          id: string;
          user_id: string;
          passage_id: string;
          audio_url: string;
          transcript: string | null;
          duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passage_id: string;
          audio_url: string;
          transcript?: string | null;
          duration_seconds: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["voice_notes"]["Insert"]>;
      };
      energy_charges: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          streak_length: number;
          last_reset_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          streak_length?: number;
          last_reset_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["energy_charges"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      usage_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          resource_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          resource_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["usage_events"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          match_type: string;
          topic: string;
          format: string;
          player_a_id: string;
          player_b_id: string;
          side_a: string;
          side_b: string;
          status: string;
          winner_id: string | null;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_type: string;
          topic: string;
          format: string;
          player_a_id: string;
          player_b_id: string;
          side_a: string;
          side_b: string;
          status?: string;
          winner_id?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      judges_log: {
        Row: {
          id: string;
          match_id: string;
          persona: string;
          section_id: string;
          score_a: number;
          score_b: number;
          reasoning_short: string;
          reasoning_full: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          persona: string;
          section_id: string;
          score_a: number;
          score_b: number;
          reasoning_short: string;
          reasoning_full?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["judges_log"]["Insert"]>;
      };
      leaderboards: {
        Row: {
          id: string;
          user_id: string;
          rating: number;
          peak_rating: number;
          win_streak: number;
          total_wins: number;
          total_losses: number;
          ranked_games_played: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          rating?: number;
          peak_rating?: number;
          win_streak?: number;
          total_wins?: number;
          total_losses?: number;
          ranked_games_played?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leaderboards"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
