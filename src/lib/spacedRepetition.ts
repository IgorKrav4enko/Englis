import type { ExerciseProgress } from "./types";

const REVIEW_INTERVALS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

function addDays(date: Date, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

export function updateSpacedRepetition(
  current: ExerciseProgress | undefined,
  exerciseId: string,
  isCorrect: boolean,
  now = new Date(),
): ExerciseProgress {
  const base: ExerciseProgress = current ?? {
    exerciseId,
    level: 0,
    correctCount: 0,
    wrongCount: 0,
  };

  const level = isCorrect ? Math.min(base.level + 1, 5) : Math.max(base.level - 1, 0);

  return {
    ...base,
    exerciseId,
    level,
    lastAnsweredAt: now.toISOString(),
    nextReviewAt: isCorrect ? addDays(now, REVIEW_INTERVALS[level] ?? 1) : now.toISOString(),
    correctCount: base.correctCount + (isCorrect ? 1 : 0),
    wrongCount: base.wrongCount + (isCorrect ? 0 : 1),
  };
}

export function isDue(nextReviewAt: string | undefined, now = new Date()): boolean {
  return Boolean(nextReviewAt && new Date(nextReviewAt).getTime() <= now.getTime());
}
