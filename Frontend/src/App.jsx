import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { usePlayer } from './context/MusicPlayerContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AlbumDetails from './pages/AlbumDetails';
import ArtistDashboard from './pages/ArtistDashboard';
import CreateMusic from './pages/CreateMusic';
import CreateAlbum from './pages/CreateAlbum';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

export default function App() {
  const { currentTrack, stop } = usePlayer();
  const { isAuthenticated } = useAuth();

  // Stop playback and clear the queue as soon as the user logs out or the session expires.
  useEffect(() => {
    if (!isAuthenticated) stop();
  }, [isAuthenticated, stop]);

  return (
    <div className={`app-shell ${currentTrack ? 'has-player' : ''}`}>
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/support" element={<Support />} />
            <Route path="/albums/:albumId" element={<AlbumDetails />} />
            <Route path="/dashboard" element={<ProtectedRoute role="artist"><ArtistDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/music/new" element={<ProtectedRoute role="artist"><CreateMusic /></ProtectedRoute>} />
            <Route path="/dashboard/albums/new" element={<ProtectedRoute role="artist"><CreateAlbum /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <MusicPlayer />
    </div>
  );
}
