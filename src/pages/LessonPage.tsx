import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExerciseRenderer } from "../components/ExerciseRenderer";
import { LessonResult } from "../components/LessonResult";
import { ProgressBar } from "../components/ProgressBar";
import { checkAnswer } from "../lib/exerciseChecker";
import { getLesson, getLessonCourseId } from "../lib/courseLoader";
import { completeLesson, recordExerciseAnswer } from "../lib/progressStorage";
import type { CheckResult, Exercise, LessonResultData } from "../lib/types";

const WORKSHEET_PAGE_SIZE = 20;

type WorksheetFeedback = CheckResult & {
  isRevealed?: boolean;
};

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
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, unknown>>({});
  const [worksheetFeedback, setWorksheetFeedback] = useState<Record<string, WorksheetFeedback>>({});
  const [recordedExerciseIds, setRecordedExerciseIds] = useState<string[]>([]);

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
  const isWorksheetLesson = currentLesson.exercises.every((item) => item.type === "fill-blank");
  const worksheetExercises = currentLesson.exercises.slice(0, WORKSHEET_PAGE_SIZE);
  const exercise = currentLesson.exercises[index];

  function updateWorksheetAnswer(exerciseId: string, nextAnswer: unknown) {
    setWorksheetAnswers((current) => ({
      ...current,
      [exerciseId]: nextAnswer,
    }));
  }

  function checkWorksheetExercise(item: Exercise) {
    const check = checkAnswer(item, worksheetAnswers[item.id] ?? "");
    setWorksheetFeedback((current) => ({
      ...current,
      [item.id]: check,
    }));

    if (!recordedExerciseIds.includes(item.id)) {
      recordExerciseAnswer(item.id, check.isCorrect);
      setRecordedExerciseIds((current) => [...current, item.id]);
    }
  }

  function showWorksheetExercise(item: Exercise) {
    const check = checkAnswer(item, worksheetAnswers[item.id] ?? "");
    setWorksheetFeedback((current) => ({
      ...current,
      [item.id]: {
        ...check,
        isCorrect: false,
        isRevealed: true,
      },
    }));
  }

  function finishWorksheetLesson() {
    const feedbackItems = worksheetExercises
      .map((item) => worksheetFeedback[item.id])
      .filter((item): item is WorksheetFeedback => Boolean(item));
    const finalCorrect = feedbackItems.filter((item) => item.isCorrect).length;
    const finalWrong = feedbackItems.length - finalCorrect;
    const mistakeExerciseIds = worksheetExercises
      .filter((item) => {
        const itemFeedback = worksheetFeedback[item.id];
        return itemFeedback && !itemFeedback.isCorrect && !itemFeedback.isRevealed;
      })
      .map((item) => item.id);
    const finalResult = {
      correctCount: finalCorrect,
      wrongCount: finalWrong,
      xpEarned: finalCorrect * 10 + 2,
      mistakeExerciseIds,
    };
    completeLesson(currentLesson.id, finalResult);
    setResult(finalResult);
  }

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

  if (isWorksheetLesson) {
    const answeredCount = worksheetExercises.filter((item) => worksheetFeedback[item.id]).length;
    const canFinish = answeredCount === worksheetExercises.length;

    return (
      <section className="lesson-page worksheet-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">{currentLesson.title}</p>
            <h1>Заповни пропуски</h1>
          </div>
          <Link className="button secondary" to={`/course/${courseId}`}>
            Exit
          </Link>
        </div>
        <ProgressBar current={answeredCount} total={worksheetExercises.length} />
        <div className="worksheet-list">
          {worksheetExercises.map((item, itemIndex) => {
            const itemFeedback = worksheetFeedback[item.id];
            return (
              <article className="card worksheet-item" key={item.id}>
                <div className="worksheet-row">
                  <span className="worksheet-number">{itemIndex + 1})</span>
                  <ExerciseRenderer
                    answer={worksheetAnswers[item.id] ?? ""}
                    disabled={Boolean(itemFeedback)}
                    exercise={item}
                    onAnswerChange={(nextAnswer) => updateWorksheetAnswer(item.id, nextAnswer)}
                  />
                  {!itemFeedback ? (
                    <div className="worksheet-actions">
                      <button className="button check-button" type="button" onClick={() => checkWorksheetExercise(item)}>
                        CHECK
                      </button>
                      <button className="button check-button" type="button" onClick={() => showWorksheetExercise(item)}>
                        SHOW
                      </button>
                    </div>
                  ) : null}
                </div>
                {itemFeedback ? (
                  <div className={`feedback compact ${itemFeedback.isCorrect ? "correct" : "incorrect"}`}>
                    <strong>
                      {itemFeedback.isRevealed
                        ? "Показано відповідь"
                        : itemFeedback.isCorrect
                          ? "Правильно"
                          : "Неправильно"}
                    </strong>
                    {!itemFeedback.isCorrect || itemFeedback.isRevealed ? (
                      <p>Правильна відповідь: {itemFeedback.correctAnswer}</p>
                    ) : null}
                    {itemFeedback.explanation ? <p>{itemFeedback.explanation}</p> : null}
                    {itemFeedback.rule ? <p>Правило: {itemFeedback.rule}</p> : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <div className="actions">
          <button className="button primary" disabled={!canFinish} type="button" onClick={finishWorksheetLesson}>
            Finish lesson
          </button>
        </div>
      </section>
    );
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
