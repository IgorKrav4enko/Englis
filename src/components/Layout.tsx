import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          English A1 Trainer
        </Link>
        <nav className="nav">
          <Link to="/course/english-a1">Course</Link>
          <Link to="/review">Review</Link>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
