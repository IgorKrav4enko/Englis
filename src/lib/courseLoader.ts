import course from "../data/english-a1.json";
import type { Course, Exercise, Lesson } from "./types";

export function getCourses(): Course[] {
  return [course as Course];
}

export function getCourse(courseId: string): Course | undefined {
  return getCourses().find((item) => item.id === courseId);
}

export function getAllLessons(): Lesson[] {
  return getCourses().flatMap((item) => item.topics.flatMap((topic) => topic.lessons));
}

export function getLesson(lessonId: string): Lesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === lessonId);
}

export function getExercise(exerciseId: string): Exercise | undefined {
  return getAllLessons()
    .flatMap((lesson) => lesson.exercises)
    .find((exercise) => exercise.id === exerciseId);
}

export function getLessonCourseId(lessonId: string): string | undefined {
  return getCourses().find((item) =>
    item.topics.some((topic) => topic.lessons.some((lesson) => lesson.id === lessonId)),
  )?.id;
}

export function getCompletedLessonCount(completedLessonIds: string[]): number {
  const lessonIds = new Set(getAllLessons().map((lesson) => lesson.id));
  return completedLessonIds.filter((id) => lessonIds.has(id)).length;
}
