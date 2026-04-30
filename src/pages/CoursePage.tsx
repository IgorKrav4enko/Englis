import { Link, useParams } from "react-router-dom";
import { getCourse } from "../lib/courseLoader";
import { getProgress } from "../lib/progressStorage";
import { isDue } from "../lib/spacedRepetition";

export function CoursePage() {
  const { courseId } = useParams();
  const course = courseId ? getCourse(courseId) : undefined;
  const progress = getProgress();

  if (!course) {
    return (
      <section className="card">
        <h1>Course not found</h1>
        <p>This course is not available yet.</p>
        <Link className="button primary" to="/">
          Back home
        </Link>
      </section>
    );
  }

  const dueCount = Object.values(progress.exerciseProgress).filter((item) =>
    isDue(item.nextReviewAt),
  ).length;
  const reviewCount = new Set([...progress.mistakeExerciseIds, ...Object.keys(progress.exerciseProgress).filter((id) => isDue(progress.exerciseProgress[id].nextReviewAt))]).size;

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{progress.totalXp} XP</p>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        <Link className="button secondary" to="/review">
          Review {reviewCount ? `(${reviewCount})` : ""}
        </Link>
      </div>

      {course.topics.map((topic) => (
        <section className="topic-section" key={topic.id}>
          <h2>{topic.title}</h2>
          <div className="lesson-grid">
            {topic.lessons.map((lesson) => {
              const completed = progress.completedLessonIds.includes(lesson.id);
              return (
                <article className={`card lesson-card ${completed ? "completed" : ""}`} key={lesson.id}>
                  <div>
                    <p className="eyebrow">{completed ? "Completed" : "Lesson"}</p>
                    <h3>{lesson.title}</h3>
                    <p className="muted">{lesson.exercises.length} exercises</p>
                  </div>
                  <Link className="button primary" to={`/lesson/${lesson.id}`}>
                    {completed ? "Continue" : "Start"}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {dueCount ? <p className="muted">{dueCount} spaced repetition item(s) are due.</p> : null}
    </section>
  );
}
