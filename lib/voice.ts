/**
 * Voice note handling: upload to Supabase Storage, transcribe with Deepgram.
 */

import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { transcribeAudio } from "@/lib/deepgram";
import { PHILO_VOICE_NOTE_MAX_SECONDS } from "@/lib/config";

export interface VoiceNoteResult {
  id: string;
  audioUrl: string;
  transcript: string;
  durationSeconds: number;
}

export async function processVoiceNote(
  userId: string,
  passageId: string,
  audioBuffer: Buffer,
  mimetype: string = "audio/mp3",
  durationSeconds: number = 0
): Promise<VoiceNoteResult> {
  if (mimetype !== "audio/mp3" && mimetype !== "audio/mpeg") {
    throw new Error("Only MP3 audio is accepted for voice notes");
  }

  if (durationSeconds > PHILO_VOICE_NOTE_MAX_SECONDS) {
    throw new Error(
      `Voice note exceeds max duration of ${PHILO_VOICE_NOTE_MAX_SECONDS}s`
    );
  }

  const supabase = await createSupabaseServer();

  const filePath = `${userId}/${Date.now()}.mp3`;
  const { error: uploadError } = await supabase.storage
    .from("voice_notes")
    .upload(filePath, audioBuffer, {
      contentType: "audio/mp3",
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: urlData } = supabase.storage
    .from("voice_notes")
    .getPublicUrl(filePath);

  const audioUrl = urlData.publicUrl;

  const { transcript } = await transcribeAudio(audioUrl, durationSeconds);

  const { data: voiceNote, error: insertError } = await supabase
    .from("voice_notes")
    .insert({
      user_id: userId,
      passage_id: passageId,
      audio_url: audioUrl,
      transcript,
      duration_seconds: Math.round(durationSeconds),
    } as any)
    .select()
    .single();

  if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

  const vn = voiceNote as Record<string, unknown>;

  return {
    id: vn.id as string,
    audioUrl,
    transcript,
    durationSeconds,
  };
}

export async function getVoiceNotesForPassage(
  userId: string,
  passageId: string
) {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("voice_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("passage_id", passageId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
