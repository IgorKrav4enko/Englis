import { Link } from "react-router-dom";
import { getAllLessons, getCompletedLessonCount, getCourses } from "../lib/courseLoader";
import { getProgress } from "../lib/progressStorage";

export function HomePage() {
  const [course] = getCourses();
  const progress = getProgress();
  const completedLessons = getCompletedLessonCount(progress.completedLessonIds);
  const totalLessons = getAllLessons().length;

  return (
    <section className="page-stack">
      <div className="hero">
        <div>
          <p className="eyebrow">Ukrainian to English</p>
          <h1>Learn practical English A1</h1>
          <p>Short lessons, instant feedback, saved progress, and review when words are due.</p>
        </div>
        <div className="xp-pill">{progress.totalXp} XP</div>
      </div>

      <article className="card course-card">
        <div>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p className="muted">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        <div className="actions">
          <Link className="button primary" to={`/course/${course.id}`}>
            Continue learning
          </Link>
          <Link className="button secondary" to="/review">
            Review mistakes
          </Link>
        </div>
      </article>
    </section>
  );
}
