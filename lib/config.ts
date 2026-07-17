export const PHILO_REFUSAL_COSINE_THRESHOLD =
  parseFloat(process.env.PHILO_REFUSAL_COSINE_THRESHOLD ?? "0.70");

export const PHILO_JUDGE_PRIMARY_WEIGHT =
  parseFloat(process.env.PHILO_JUDGE_PRIMARY_WEIGHT ?? "2.0");

export const PHILO_VOICE_NOTE_MAX_SECONDS =
  parseInt(process.env.PHILO_VOICE_NOTE_MAX_SECONDS ?? "300", 10);

export const PHILO_DAILY_AI_QUERIES_FREE =
  parseInt(process.env.PHILO_DAILY_AI_QUERIES_FREE ?? "20", 10);

export const PHILO_DAILY_AI_QUERIES_PREMIUM =
  parseInt(process.env.PHILO_DAILY_AI_QUERIES_PREMIUM ?? "200", 10);

export const ENERGY_BASE_CHARGES = 10;
export const ENERGY_STREAK_BONUS = 2;
export const ENERGY_DECAY_DAYS = 1;
export const ENERGY_SOFT_CAP = 50;

export const AI_QUERY_RATE_LIMIT_WINDOW_SECONDS = 60;
