import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page page-center">
      <div className="not-found">
        <p className="not-found-code">404</p>
        <h1>This page doesn't exist</h1>
        <p className="muted">The link may be broken, or the page may have moved.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
