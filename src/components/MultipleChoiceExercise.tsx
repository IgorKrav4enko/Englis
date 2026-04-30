import type { Exercise } from "../lib/types";

type Props = {
  exercise: Exercise;
  value: string;
  disabled?: boolean;
  onChange: (answer: string) => void;
};

export function MultipleChoiceExercise({ exercise, value, disabled, onChange }: Props) {
  return (
    <div className="exercise-body">
      <p className="prompt">{exercise.prompt}</p>
      <div className="option-grid">
        {exercise.options?.map((option) => (
          <button
            className={`option-button ${value === option ? "selected" : ""}`}
            disabled={disabled}
            key={option}
            type="button"
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
