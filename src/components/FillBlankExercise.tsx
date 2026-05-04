import type { Exercise } from "../lib/types";

type Props = {
  exercise: Exercise;
  value: string | string[];
  disabled?: boolean;
  onChange: (answer: string | string[]) => void;
};

export function FillBlankExercise({ exercise, value, disabled, onChange }: Props) {
  const blankCount = Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.length : 1;
  const multiValue = Array.isArray(value) ? value : Array(blankCount).fill("");
  const promptParts = exercise.prompt.split("___");

  function updateMultiBlank(index: number, answer: string) {
    const next = [...multiValue];
    next[index] = answer;
    onChange(next);
  }

  const singleValue = typeof value === "string" ? value : "";

  if (exercise.options?.length && promptParts.length > 1) {
    return (
      <div className="exercise-body">
        {exercise.question ? <p className="muted">{exercise.question}</p> : null}
        <p className="inline-blank-prompt">
          {promptParts.map((part, index) => (
            <span key={`${part}-${index}`}>
              {part}
              {index < blankCount ? (
                <input
                  aria-label={`Blank ${index + 1}`}
                  className="inline-blank-input"
                  disabled={disabled}
                  value={blankCount > 1 ? multiValue[index] ?? "" : singleValue}
                  onChange={(event) =>
                    blankCount > 1 ? updateMultiBlank(index, event.target.value) : onChange(event.target.value)
                  }
                />
              ) : null}
            </span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div className="exercise-body">
      <p className="prompt">{exercise.prompt}</p>
      {exercise.question ? <p className="muted">{exercise.question}</p> : null}
      {exercise.options?.length ? (
        <input
          className="text-input"
          disabled={disabled}
          value={singleValue}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="text-input"
          disabled={disabled}
          value={singleValue}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
