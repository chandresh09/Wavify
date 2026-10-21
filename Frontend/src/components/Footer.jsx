import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAuthenticated, isArtist } = useAuth();

  return (
    <footer className="footer">
      <div>
        <strong>Wavify</strong>
        <p>Stream music from the artists on your platform.</p>
      </div>
      <nav className="footer-links" aria-label="Footer">
        <Link to="/">Home</Link>
        <Link to="/support">Support</Link>
        {!isAuthenticated && <Link to="/login">Log in</Link>}
        {!isAuthenticated && <Link to="/register">Sign up</Link>}
        {isArtist && <Link to="/dashboard">Artist dashboard</Link>}
      </nav>
    </footer>
  );
}
