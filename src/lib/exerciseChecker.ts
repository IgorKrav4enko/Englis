import type { CheckResult, Exercise, Pair } from "./types";

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function isMatchingFillBlankAnswer(answer: string, expected: string): boolean {
  const normalizedAnswer = normalize(answer);
  const normalizedExpected = normalize(expected);
  return normalizedAnswer === normalizedExpected || (normalizedExpected === "-" && normalizedAnswer === "");
}

function answerText(exercise: Exercise): string {
  if (exercise.correctAnswer) {
    if (Array.isArray(exercise.correctAnswer)) {
      return exercise.correctAnswer.join(" / ");
    }
    return exercise.correctAnswer;
  }
  if (exercise.correctOrder) {
    return exercise.correctOrder.join(" ");
  }
  if (exercise.pairs) {
    return exercise.pairs.map((pair) => `${pair.left} = ${pair.right}`).join(", ");
  }
  return "";
}

function isPairArray(value: unknown): value is Pair[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "left" in item &&
        "right" in item &&
        typeof item.left === "string" &&
        typeof item.right === "string",
    )
  );
}

function checkPairs(exercise: Exercise, userAnswer: unknown): boolean {
  if (!exercise.pairs) {
    return false;
  }

  const expected = new Map(exercise.pairs.map((pair) => [pair.left, pair.right]));

  if (isPairArray(userAnswer)) {
    return (
      userAnswer.length === exercise.pairs.length &&
      userAnswer.every((pair) => expected.get(pair.left) === pair.right)
    );
  }

  if (typeof userAnswer === "object" && userAnswer !== null) {
    return exercise.pairs.every((pair) => {
      const selected = (userAnswer as Record<string, unknown>)[pair.left];
      return typeof selected === "string" && selected === pair.right;
    });
  }

  return false;
}

export function checkAnswer(exercise: Exercise, userAnswer: unknown): CheckResult {
  let isCorrect = false;

  if (exercise.type === "multiple-choice") {
    isCorrect = typeof userAnswer === "string" && userAnswer === exercise.correctAnswer;
  }

  if (exercise.type === "fill-blank") {
    if (Array.isArray(exercise.correctAnswer)) {
      const expectedAnswers = exercise.correctAnswer;
      isCorrect =
        Array.isArray(userAnswer) &&
        userAnswer.length === expectedAnswers.length &&
        userAnswer.every(
          (answer, index) =>
            typeof answer === "string" &&
            isMatchingFillBlankAnswer(answer, expectedAnswers[index] ?? ""),
        );
    } else {
      isCorrect =
        typeof userAnswer === "string" &&
        typeof exercise.correctAnswer === "string" &&
        isMatchingFillBlankAnswer(userAnswer, exercise.correctAnswer);
    }
  }

  if (exercise.type === "build-sentence") {
    if (Array.isArray(userAnswer) && exercise.correctOrder) {
      isCorrect =
        userAnswer.length === exercise.correctOrder.length &&
        userAnswer.every((word, index) => word === exercise.correctOrder?.[index]);
    }
    if (!isCorrect && typeof userAnswer === "string" && exercise.correctOrder) {
      isCorrect = normalize(userAnswer) === normalize(exercise.correctOrder.join(" "));
    }
  }

  if (exercise.type === "match-pairs") {
    isCorrect = checkPairs(exercise, userAnswer);
  }

  return {
    isCorrect,
    correctAnswer: answerText(exercise),
    explanation: exercise.explanation,
    rule: exercise.rule,
    ruleId: exercise.ruleId,
  };
}
