export type ExerciseType =
  | "multiple-choice"
  | "match-pairs"
  | "fill-blank"
  | "build-sentence";

export type Pair = {
  left: string;
  right: string;
};

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  question?: string;
  options?: string[];
  pairs?: Pair[];
  correctAnswer?: string | string[];
  correctOrder?: string[];
  explanation?: string;
  rule?: string;
  ruleId?: string;
};

export type Lesson = {
  id: string;
  title: string;
  exercises: Exercise[];
};

export type Topic = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
};

export type ExerciseProgress = {
  exerciseId: string;
  level: number;
  lastAnsweredAt?: string;
  nextReviewAt?: string;
  correctCount: number;
  wrongCount: number;
};

export type UserProgress = {
  completedLessonIds: string[];
  totalXp: number;
  mistakeExerciseIds: string[];
  exerciseProgress: Record<string, ExerciseProgress>;
};

export type LessonResultData = {
  correctCount: number;
  wrongCount: number;
  xpEarned: number;
  mistakeExerciseIds: string[];
};

export type CheckResult = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  rule?: string;
  ruleId?: string;
};
