import type { Exercise, Pair } from "../lib/types";

type Props = {
  exercise: Exercise;
  value: Pair[];
  disabled?: boolean;
  onChange: (answer: Pair[]) => void;
};

function shuffle(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

export function MatchPairsExercise({ exercise, value, disabled, onChange }: Props) {
  const pairs = exercise.pairs ?? [];
  const selectedByLeft = new Map(value.map((pair) => [pair.left, pair.right]));
  const rightOptions = shuffle(pairs.map((pair) => pair.right));

  function updatePair(left: string, right: string) {
    const next = pairs.map((pair) => ({
      left: pair.left,
      right: pair.left === left ? right : selectedByLeft.get(pair.left) ?? "",
    }));
    onChange(next);
  }

  return (
    <div className="exercise-body">
      <p className="prompt">{exercise.prompt}</p>
      <div className="match-list">
        {pairs.map((pair) => (
          <label className="match-row" key={pair.left}>
            <span>{pair.left}</span>
            <select
              disabled={disabled}
              value={selectedByLeft.get(pair.left) ?? ""}
              onChange={(event) => updatePair(pair.left, event.target.value)}
            >
              <option value="">Choose</option>
              {rightOptions.map((option) => (
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
