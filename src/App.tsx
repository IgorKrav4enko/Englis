import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CoursePage } from "./pages/CoursePage";
import { HomePage } from "./pages/HomePage";
import { LessonPage } from "./pages/LessonPage";
import { ReviewPage } from "./pages/ReviewPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
