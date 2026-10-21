import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AudioLines, Pause, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginBanner from '../components/LoginBanner';
import { fetchAlbum } from '../services/musicService';
import { getErrorMessage } from '../services/api';
import { usePlayer } from '../context/MusicPlayerContext';
import CoverArt from '../components/CoverArt';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function AlbumDetails() {
  const { albumId } = useParams();
  const { isAuthenticated } = useAuth();
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      setAlbum(await fetchAlbum(albumId));
    } catch (err) {
      const status = err.response?.status;
      setError(status === 404 || status === 400
        ? 'This album could not be found. The link may be wrong or the album was removed.'
        : getErrorMessage(err, 'Could not load this album.'));
    } finally {
      setLoading(false);
    }
  }, [albumId, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isAuthenticated) return <div className="page"><LoginBanner /></div>;
  if (loading) return <div className="page"><Loading label="Loading album…" /></div>;
  if (error) return <div className="page"><ErrorMessage message={error} onRetry={load} /></div>;

  const albumPlaying = album.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  return (
    <div className="page">
      <section className="album-header">
        <CoverArt src={album.cover || album.tracks[0]?.cover} title={album.title} className="album-cover" />
        <div className="album-info">
          <p className="hero-kicker">Album</p>
          <h1>{album.title}</h1>
          {album.artistName && <p className="hero-sub">by {album.artistName}</p>}
          <p className="muted">{album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}</p>
          {album.tracks.length > 0 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => playTrack(albumPlaying ? currentTrack : album.tracks[0], album.tracks)}
            >
              {albumPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {albumPlaying ? 'Pause' : 'Play album'}
            </button>
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Tracks</h2>
        {album.tracks.length === 0 ? (
          <EmptyState title="This album has no tracks" text="Tracks added to the album will appear here." />
        ) : (
          <ol className="track-list">
            {album.tracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <li key={`${track.id}-${i}`} className={`track-row ${isCurrent ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    className="track-play"
                    aria-label={`${isCurrent && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
                    onClick={() => playTrack(track, album.tracks)}
                  >
                    {isCurrent && isPlaying ? <AudioLines size={18} /> : <Play size={18} fill="currentColor" />}
                  </button>
                  <div className="track-meta">
                    <strong>{track.title}</strong>
                    <small>{track.artistName}</small>
                  </div>
                  {!track.audioUrl && <span className="badge">Audio unavailable</span>}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
