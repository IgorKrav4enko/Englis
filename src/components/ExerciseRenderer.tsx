import { BuildSentenceExercise } from "./BuildSentenceExercise";
import { FillBlankExercise } from "./FillBlankExercise";
import { MatchPairsExercise } from "./MatchPairsExercise";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import type { Exercise, Pair } from "../lib/types";

type Props = {
  exercise: Exercise;
  answer: unknown;
  disabled?: boolean;
  onAnswerChange: (answer: unknown) => void;
};

export function ExerciseRenderer({ exercise, answer, disabled, onAnswerChange }: Props) {
  if (exercise.type === "multiple-choice") {
    return (
      <MultipleChoiceExercise
        disabled={disabled}
        exercise={exercise}
        value={typeof answer === "string" ? answer : ""}
        onChange={onAnswerChange}
      />
    );
  }

  if (exercise.type === "fill-blank") {
    return (
      <FillBlankExercise
        disabled={disabled}
        exercise={exercise}
        value={typeof answer === "string" || Array.isArray(answer) ? (answer as string | string[]) : ""}
        onChange={onAnswerChange}
      />
    );
  }

  if (exercise.type === "match-pairs") {
    return (
      <MatchPairsExercise
        disabled={disabled}
        exercise={exercise}
        value={Array.isArray(answer) ? (answer as Pair[]) : []}
        onChange={onAnswerChange}
      />
    );
  }

  return (
    <BuildSentenceExercise
      disabled={disabled}
      exercise={exercise}
      value={Array.isArray(answer) ? (answer as string[]) : []}
      onChange={onAnswerChange}
    />
  );
}
