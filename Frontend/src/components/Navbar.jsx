import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, LogOut, AudioLines, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAuthenticated, isArtist, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const goToSearch = (value, replace) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/', { replace });
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    // Filter live while on the home page.
    if (location.pathname === '/') goToSearch(e.target.value, true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToSearch(query, false);
  };

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
    showToast('You have been logged out.');
  };

  return (
    <header className="navbar">
      <button type="button" className="icon-btn nav-back" aria-label="Go back" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} />
      </button>
      <Link to="/" className="nav-logo" aria-label="Wavify home">
        <AudioLines size={20} />
      </Link>

      <nav className="nav-tabs" aria-label="Sections">
        <NavLink to="/" end>Music</NavLink>
        {isArtist && <NavLink to="/dashboard">Dashboard</NavLink>}
      </nav>

      <form className="nav-search" onSubmit={handleSubmit} role="search">
        <Search size={16} />
        <input
          type="search"
          placeholder="Search music"
          value={query}
          onChange={handleChange}
          aria-label="Search music"
        />
      </form>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <div className="nav-user" title={user.email || user.username}>
              <span className="avatar">{(user.username || user.email || '?').charAt(0).toUpperCase()}</span>
              <span className="nav-user-meta">
                <strong>{user.username || 'Account'}</strong>
                <small>{user.role}</small>
              </span>
            </div>
            <button type="button" className="icon-btn" aria-label="Log out" title="Log out" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
