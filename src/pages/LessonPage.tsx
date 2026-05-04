import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExerciseRenderer } from "../components/ExerciseRenderer";
import { LessonResult } from "../components/LessonResult";
import { ProgressBar } from "../components/ProgressBar";
import { checkAnswer } from "../lib/exerciseChecker";
import { getLesson, getLessonCourseId } from "../lib/courseLoader";
import { completeLesson, recordExerciseAnswer } from "../lib/progressStorage";
import type { CheckResult, LessonResultData } from "../lib/types";

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const courseId = lessonId ? getLessonCourseId(lessonId) ?? "english-a1" : "english-a1";
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>("");
  const [feedback, setFeedback] = useState<CheckResult | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [result, setResult] = useState<LessonResultData | null>(null);

  if (!lesson) {
    return (
      <section className="card">
        <h1>Lesson not found</h1>
        <p>This lesson is not available.</p>
        <Link className="button primary" to="/course/english-a1">
          Back to course
        </Link>
      </section>
    );
  }

  if (result) {
    return <LessonResult courseId={courseId} result={result} />;
  }

  const currentLesson = lesson;
  const exercise = currentLesson.exercises[index];

  function handleCheck() {
    if (!exercise) {
      return;
    }
    const check = checkAnswer(exercise, answer);
    setFeedback(check);
    setIsRevealed(false);
    recordExerciseAnswer(exercise.id, check.isCorrect);
    if (check.isCorrect) {
      setCorrectCount((value) => value + 1);
    } else {
      setWrongCount((value) => value + 1);
      setMistakes((value) => [...new Set([...value, exercise.id])]);
    }
  }

  function handleShow() {
    if (!exercise) {
      return;
    }
    setFeedback({
      ...checkAnswer(exercise, answer),
      isCorrect: false,
    });
    setIsRevealed(true);
  }

  function handleNext() {
    const isLast = index === currentLesson.exercises.length - 1;
    if (isLast) {
      const finalCorrect = correctCount;
      const finalWrong = wrongCount;
      const xpEarned = finalCorrect * 10 + 2;
      const finalResult = {
        correctCount: finalCorrect,
        wrongCount: finalWrong,
        xpEarned,
        mistakeExerciseIds: mistakes,
      };
      completeLesson(currentLesson.id, finalResult);
      setResult(finalResult);
      return;
    }

    setIndex((value) => value + 1);
    setAnswer("");
    setFeedback(null);
    setIsRevealed(false);
  }

  return (
    <section className="lesson-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{currentLesson.title}</p>
          <h1>{exercise.type === "fill-blank" ? "Заповни пропуски" : exercise.prompt}</h1>
        </div>
        <Link className="button secondary" to={`/course/${courseId}`}>
          Exit
        </Link>
      </div>
      <ProgressBar current={index + 1} total={currentLesson.exercises.length} />
      <div className="card exercise-card">
        <ExerciseRenderer
          answer={answer}
          disabled={Boolean(feedback)}
          exercise={exercise}
          onAnswerChange={setAnswer}
        />
        {feedback ? (
          <div className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}>
            <strong>{isRevealed ? "Показано відповідь" : feedback.isCorrect ? "Правильно" : "Неправильно"}</strong>
            {!feedback.isCorrect || isRevealed ? <p>Правильна відповідь: {feedback.correctAnswer}</p> : null}
            {feedback.explanation ? <p>{feedback.explanation}</p> : null}
            {feedback.rule ? <p>Правило: {feedback.rule}</p> : null}
          </div>
        ) : null}
        <div className="actions">
          {!feedback ? (
            <>
              <button className="button check-button" type="button" onClick={handleCheck}>
                CHECK
              </button>
              <button className="button check-button" type="button" onClick={handleShow}>
                SHOW
              </button>
            </>
          ) : (
            <button className="button primary" type="button" onClick={handleNext}>
              {index === currentLesson.exercises.length - 1 ? "See result" : "Next"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
