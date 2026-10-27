import { NavLink, useNavigate } from 'react-router-dom';
import { Disc3, Home, LayoutDashboard, AudioLines, PlusCircle, User, MessageSquareText, LogOut, ListMusic } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, isArtist, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
    showToast('You have been logged out.');
  };

  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-brand" aria-label="Wavify home">
        <AudioLines size={22} />
      </NavLink>
      <nav className="sidebar-nav" aria-label="Main">
        <NavLink to="/" end title="Home" className="sidebar-link">
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        {!isAuthenticated && (
          <>
            <NavLink to="/register" end title="Register" className="sidebar-link">
              <User size={22} />
              <span>Sign Up</span>
            </NavLink>
          </>
        )}
        {user?.role == "user" && (
          <>
            <NavLink to="/albums" end title="Albums" className="sidebar-link">
              <ListMusic size={22} />
              <span>Albums</span>
            </NavLink>
            <NavLink to="/support" end title="Support" className="sidebar-link">
              <MessageSquareText size={22} />
              <span>Support</span>
            </NavLink>
            <button type="button" className="sidebar-link" aria-label="Log out" title="Log out" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        )}
        {isArtist && (
          <>
            <NavLink to="/dashboard" title="Dashboard" className="sidebar-link">
              <LayoutDashboard size={22} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/dashboard/music/new" title="Create music" className="sidebar-link">
              <PlusCircle size={22} />
              <span>New music</span>
            </NavLink>
            <NavLink to="/dashboard/albums/new" title="Create album" className="sidebar-link">
              <Disc3 size={22} />
              <span>New album</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
