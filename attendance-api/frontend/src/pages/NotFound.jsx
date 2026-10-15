import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="panel not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p className="muted">The page you requested doesn't exist.</p>
      <Link to="/" className="primary-button">Back to Dashboard</Link>
    </section>
  );
}