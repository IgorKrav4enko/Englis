import { useMemo } from "react";
import type { Exercise } from "../lib/types";

type Props = {
  exercise: Exercise;
  value: string[];
  disabled?: boolean;
  onChange: (answer: string[]) => void;
};

function stableShuffle(words: string[]): string[] {
  return [...words].sort((a, b) => b.localeCompare(a));
}

export function BuildSentenceExercise({ exercise, value, disabled, onChange }: Props) {
  const words = useMemo(() => stableShuffle(exercise.correctOrder ?? []), [exercise.correctOrder]);

  function addWord(word: string) {
    onChange([...value, word]);
  }

  function removeWord(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  const usedCounts = value.reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="exercise-body">
      <p className="prompt">{exercise.prompt}</p>
      <div className="sentence-builder">
        {value.length ? (
          value.map((word, index) => (
            <button disabled={disabled} key={`${word}-${index}`} type="button" onClick={() => removeWord(index)}>
              {word}
            </button>
          ))
        ) : (
          <span className="muted">Build your sentence here.</span>
        )}
      </div>
      <div className="word-bank">
        {words.map((word, index) => {
          const total = words.filter((item) => item === word).length;
          const used = usedCounts[word] ?? 0;
          return (
            <button
              disabled={disabled || used >= total}
              key={`${word}-${index}`}
              type="button"
              onClick={() => addWord(word)}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
