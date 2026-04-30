import type { Exercise } from "../lib/types";

type Props = {
  exercise: Exercise;
  value: string | string[];
  disabled?: boolean;
  onChange: (answer: string | string[]) => void;
};

export function FillBlankExercise({ exercise, value, disabled, onChange }: Props) {
  const blankCount = Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.length : 1;
  const optionValues = exercise.options ?? ["in", "on", "at", "-"];
  const multiValue = Array.isArray(value) ? value : Array(blankCount).fill("");

  function updateMultiBlank(index: number, answer: string) {
    const next = [...multiValue];
    next[index] = answer;
    onChange(next);
  }

  if (blankCount > 1) {
    return (
      <div className="exercise-body">
        <p className="prompt">{exercise.prompt}</p>
        {exercise.question ? <p className="muted">{exercise.question}</p> : null}
        <div className="blank-grid">
          {Array.from({ length: blankCount }, (_, index) => (
            <label className="blank-select" key={index}>
              <span>Blank {index + 1}</span>
              <select
                disabled={disabled}
                value={multiValue[index] ?? ""}
                onChange={(event) => updateMultiBlank(index, event.target.value)}
              >
                <option value="">Choose</option>
                {optionValues.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
    );
  }

  const singleValue = typeof value === "string" ? value : "";

  return (
    <div className="exercise-body">
      <p className="prompt">{exercise.prompt}</p>
      {exercise.question ? <p className="muted">{exercise.question}</p> : null}
      {exercise.options?.length ? (
        <div className="option-grid">
          {exercise.options.map((option) => (
            <button
              className={`option-button ${singleValue === option ? "selected" : ""}`}
              disabled={disabled}
              key={option}
              type="button"
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
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
