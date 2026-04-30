import type { LessonResultData, UserProgress } from "./types";
import { updateSpacedRepetition } from "./spacedRepetition";

const STORAGE_KEY = "language-trainer-progress-v1";

export const defaultProgress: UserProgress = {
  completedLessonIds: [],
  totalXp: 0,
  mistakeExerciseIds: [],
  exerciseProgress: {},
};

function canUseLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function normalizeProgress(value: Partial<UserProgress>): UserProgress {
  return {
    completedLessonIds: Array.isArray(value.completedLessonIds) ? value.completedLessonIds : [],
    totalXp: typeof value.totalXp === "number" ? value.totalXp : 0,
    mistakeExerciseIds: Array.isArray(value.mistakeExerciseIds) ? value.mistakeExerciseIds : [],
    exerciseProgress:
      value.exerciseProgress && typeof value.exerciseProgress === "object"
        ? value.exerciseProgress
        : {},
  };
}

export function getProgress(): UserProgress {
  if (!canUseLocalStorage()) {
    return { ...defaultProgress };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeProgress(JSON.parse(raw) as Partial<UserProgress>) : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (!canUseLocalStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addMistake(exerciseId: string): UserProgress {
  const progress = getProgress();
  if (!progress.mistakeExerciseIds.includes(exerciseId)) {
    progress.mistakeExerciseIds.push(exerciseId);
  }
  saveProgress(progress);
  return progress;
}

export function removeMistake(exerciseId: string): UserProgress {
  const progress = getProgress();
  progress.mistakeExerciseIds = progress.mistakeExerciseIds.filter((id) => id !== exerciseId);
  saveProgress(progress);
  return progress;
}

export function recordExerciseAnswer(exerciseId: string, isCorrect: boolean): UserProgress {
  const progress = getProgress();
  progress.exerciseProgress[exerciseId] = updateSpacedRepetition(
    progress.exerciseProgress[exerciseId],
    exerciseId,
    isCorrect,
  );

  if (isCorrect) {
    progress.mistakeExerciseIds = progress.mistakeExerciseIds.filter((id) => id !== exerciseId);
  } else if (!progress.mistakeExerciseIds.includes(exerciseId)) {
    progress.mistakeExerciseIds.push(exerciseId);
  }

  saveProgress(progress);
  return progress;
}

export function completeLesson(lessonId: string, result: LessonResultData): UserProgress {
  const progress = getProgress();
  if (!progress.completedLessonIds.includes(lessonId)) {
    progress.completedLessonIds.push(lessonId);
  }
  progress.totalXp += result.xpEarned;
  saveProgress(progress);
  return progress;
}

export function resetProgress(): void {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
