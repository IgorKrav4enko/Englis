import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExerciseRenderer } from "../components/ExerciseRenderer";
import { checkAnswer } from "../lib/exerciseChecker";
import { getExercise } from "../lib/courseLoader";
import { getProgress, recordExerciseAnswer } from "../lib/progressStorage";
import { isDue } from "../lib/spacedRepetition";
import type { CheckResult, Exercise } from "../lib/types";

function getReviewExercises(): Exercise[] {
  const progress = getProgress();
  const dueIds = Object.values(progress.exerciseProgress)
    .filter((item) => isDue(item.nextReviewAt))
    .map((item) => item.exerciseId);
  return [...new Set([...progress.mistakeExerciseIds, ...dueIds])]
    .map((id) => getExercise(id))
    .filter((exercise): exercise is Exercise => Boolean(exercise));
}

export function ReviewPage() {
  const initialExercises = useMemo(() => getReviewExercises(), []);
  const [exercises, setExercises] = useState(initialExercises);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>("");
  const [feedback, setFeedback] = useState<CheckResult | null>(null);
  const exercise = exercises[index];

  function handleCheck() {
    if (!exercise) {
      return;
    }
    const check = checkAnswer(exercise, answer);
    setFeedback(check);
    recordExerciseAnswer(exercise.id, check.isCorrect);
  }

  function handleNext() {
    const nextIndex = index + 1;
    if (nextIndex >= exercises.length) {
      setExercises(getReviewExercises());
      setIndex(0);
    } else {
      setIndex(nextIndex);
    }
    setAnswer("");
    setFeedback(null);
  }

  if (!exercise) {
    return (
      <section className="card">
        <h1>Review</h1>
        <p>No review items right now.</p>
        <Link className="button primary" to="/course/english-a1">
          Back to course
        </Link>
      </section>
    );
  }

  return (
    <section className="lesson-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Review {index + 1} / {exercises.length}
          </p>
          <h1>{exercise.prompt}</h1>
        </div>
        <Link className="button secondary" to="/course/english-a1">
          Exit
        </Link>
      </div>
      <div className="card exercise-card">
        <ExerciseRenderer
          answer={answer}
          disabled={Boolean(feedback)}
          exercise={exercise}
          onAnswerChange={setAnswer}
        />
        {feedback ? (
          <div className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}>
            <strong>{feedback.isCorrect ? "Правильно" : "Неправильно"}</strong>
            {!feedback.isCorrect ? <p>Правильна відповідь: {feedback.correctAnswer}</p> : null}
            {feedback.explanation ? <p>{feedback.explanation}</p> : null}
            {feedback.rule ? <p>Правило: {feedback.rule}</p> : null}
          </div>
        ) : null}
        <div className="actions">
          {!feedback ? (
            <button className="button primary" type="button" onClick={handleCheck}>
              Check
            </button>
          ) : (
            <button className="button primary" type="button" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
