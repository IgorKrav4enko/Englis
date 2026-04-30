import { Link } from "react-router-dom";
import type { LessonResultData } from "../lib/types";

type Props = {
  courseId: string;
  result: LessonResultData;
};

export function LessonResult({ courseId, result }: Props) {
  return (
    <section className="card result-card">
      <p className="eyebrow">Lesson completed</p>
      <h1>Nice work</h1>
      <div className="stats-grid">
        <div>
          <strong>{result.correctCount}</strong>
          <span>Correct</span>
        </div>
        <div>
          <strong>{result.wrongCount}</strong>
          <span>Wrong</span>
        </div>
        <div>
          <strong>{result.xpEarned}</strong>
          <span>XP earned</span>
        </div>
      </div>
      <div className="actions">
        <Link className="button primary" to={`/course/${courseId}`}>
          Back to course
        </Link>
        {result.mistakeExerciseIds.length ? (
          <Link className="button secondary" to="/review">
            Review mistakes
          </Link>
        ) : null}
      </div>
    </section>
  );
}
