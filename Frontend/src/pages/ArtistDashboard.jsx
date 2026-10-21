import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Disc3, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useMusicLibrary from '../hooks/useMusicLibrary';
import MusicCard from '../components/MusicCard';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { CardSkeletons } from '../components/Loading';
import { readCreatedAlbums } from './CreateAlbum';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { tracks, loading, error, reload } = useMusicLibrary();
  const createdAlbums = readCreatedAlbums();

  // Match by artist id when the API provides it, otherwise by username.
  const myTracks = useMemo(() => tracks.filter((t) =>
    (user.id && t.artistId === user.id) || (user.username && t.artistName === user.username)), [tracks, user]);

  return (
    <div className="page">
      <section className="dashboard-head">
        <div>
          <h1>Hi, {user.username || 'artist'}</h1>
          <p className="muted">Publish new music or group tracks into an album.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/dashboard/music/new" className="btn btn-primary"><PlusCircle size={16} /> Create music</Link>
          <Link to="/dashboard/albums/new" className="btn btn-outline"><Disc3 size={16} /> Create album</Link>
        </div>
      </section>

      <section className="stat-row">
        <div className="stat"><strong>{loading ? '–' : myTracks.length}</strong><span>Your tracks</span></div>
        <div className="stat"><strong>{loading ? '–' : tracks.length}</strong><span>Tracks on Wavify</span></div>
        <div className="stat"><strong>{createdAlbums.length}</strong><span>Albums created on this device</span></div>
      </section>

      {createdAlbums.length > 0 && (
        <section className="section">
          <h2 className="section-title">Albums created on this device</h2>
          <ul className="link-list">
            {createdAlbums.map((album) => (
              <li key={album.id}><Link to={`/albums/${album.id}`}>{album.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Your music</h2>
        {loading && <CardSkeletons count={4} />}
        <ErrorMessage message={error} onRetry={reload} />
        {!loading && !error && myTracks.length === 0 && (
          <EmptyState title="You haven't published anything yet" text="Create your first track to see it here.">
            <Link to="/dashboard/music/new" className="btn btn-primary btn-sm">Create music</Link>
          </EmptyState>
        )}
        {myTracks.length > 0 && (
          <div className="card-grid">
            {myTracks.map((track) => <MusicCard key={track.id} track={track} queue={myTracks} />)}
          </div>
        )}
      </section>
    </div>
  );
}
