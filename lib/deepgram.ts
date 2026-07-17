/**
 * Deepgram Nova-3 transcription utility.
 * Accepts an audio buffer URL and returns transcribed text.
 * Enforces voice note max duration.
 */

import { PHILO_VOICE_NOTE_MAX_SECONDS } from "@/lib/config";

const DEEPGRAM_API_URL = "https://api.deepgram.com/v1/listen";

export interface DeepgramTranscriptionResult {
  transcript: string;
  duration: number;
  confidence: number;
}

export async function transcribeAudio(
  audioUrl: string,
  durationSeconds: number
): Promise<DeepgramTranscriptionResult> {
  if (durationSeconds > PHILO_VOICE_NOTE_MAX_SECONDS) {
    throw new Error(
      `Voice note exceeds max duration of ${PHILO_VOICE_NOTE_MAX_SECONDS}s`
    );
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY not configured");
  }

  const response = await fetch(
    `${DEEPGRAM_API_URL}?model=nova-3&smart_format=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: audioUrl }),
    }
  );

  if (!response.ok) {
    throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const transcript =
    data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  const confidence =
    data.results?.channels?.[0]?.alternatives?.[0]?.confidence ?? 0;
  const duration = data.metadata?.duration ?? durationSeconds;

  return { transcript, duration, confidence };
}
