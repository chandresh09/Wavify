import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AudioLines } from 'lucide-react';

export default function Footer() {
  const { isAuthenticated, isArtist } = useAuth();

  return (
    <footer className="footer">
      <div>
        <div className='footer-logo'>
          <NavLink to="/" className="footer-logo-brand" aria-label="Wavify home">
            <AudioLines size={22} />
          </NavLink>
          <h2>Wavify</h2>
        </div>
        <p>Stream music from the artists on your platform.</p>
        <div className='footer-socialmedia'>
          <span>
            <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-101040-icon" viewBox="0 0 16 16"><path d="M8 1.44c2.136 0 2.389.009 3.233.047.78.036 1.203.166 1.485.276.348.128.663.332.921.598.266.258.47.573.599.921.11.282.24.706.275 1.485.039.844.047 1.097.047 3.233s-.008 2.389-.047 3.232c-.035.78-.166 1.204-.275 1.486a2.65 2.65 0 0 1-1.518 1.518c-.282.11-.706.24-1.486.275-.843.039-1.097.047-3.233.047s-2.39-.008-3.232-.047c-.78-.035-1.204-.165-1.486-.275a2.5 2.5 0 0 1-.921-.599 2.5 2.5 0 0 1-.599-.92c-.11-.282-.24-.706-.275-1.486-.038-.844-.047-1.096-.047-3.232s.009-2.39.047-3.233c.036-.78.166-1.203.275-1.485.129-.348.333-.663.599-.921a2.5 2.5 0 0 1 .92-.599c.283-.11.707-.24 1.487-.275.843-.038 1.096-.047 3.232-.047L8 1.441zm.001-1.442c-2.172 0-2.445.01-3.298.048-.854.04-1.435.176-1.943.373a3.9 3.9 0 0 0-1.417.923c-.407.4-.722.883-.923 1.417-.198.508-.333 1.09-.372 1.942S0 5.826 0 8c0 2.172.01 2.445.048 3.298.04.853.174 1.433.372 1.941.2.534.516 1.017.923 1.417.4.407.883.722 1.417.923.508.198 1.09.333 1.942.372s1.126.048 3.299.048 2.445-.01 3.298-.048c.853-.04 1.433-.174 1.94-.372a4.1 4.1 0 0 0 2.34-2.34c.199-.508.334-1.09.373-1.942S16 10.172 16 7.999s-.01-2.445-.048-3.298c-.04-.853-.174-1.433-.372-1.94a3.9 3.9 0 0 0-.923-1.418A3.9 3.9 0 0 0 13.24.42c-.508-.197-1.09-.333-1.942-.371-.851-.041-1.125-.05-3.298-.05z"></path><path d="M8 3.892a4.108 4.108 0 1 0 0 8.216 4.108 4.108 0 0 0 0-8.216m0 6.775a2.668 2.668 0 1 1 0-5.335 2.668 2.668 0 0 1 0 5.335m4.27-5.978a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92"></path></svg>
          </span>
          <span>
            <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-101040-icon" viewBox="0 0 16 16"><path d="M9.303 6.928 14.403 1h-1.208L8.766 6.147 5.23 1H1.15L6.5 8.784 1.15 15h1.208l4.676-5.436L10.77 15h4.08zM7.648 8.852l-.542-.775L2.795 1.91H4.65l3.48 4.977.541.775 4.523 6.47H11.34l-3.691-5.28Z"></path></svg>
          </span>
          <span>
            <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-101040-icon" viewBox="0 0 16 16"><path d="M16 8a8 8 0 1 0-9.25 7.903v-5.59H4.719V8H6.75V6.237c0-2.005 1.194-3.112 3.022-3.112.875 0 1.79.156 1.79.156V5.25h-1.008c-.994 0-1.304.617-1.304 1.25V8h2.219l-.355 2.313H9.25v5.59A8 8 0 0 0 16 8"></path></svg>
          </span>
        </div>
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
