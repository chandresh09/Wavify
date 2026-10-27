import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useMusicLibrary from '../hooks/useMusicLibrary';
import { usePlayer } from '../context/MusicPlayerContext';
import MusicCard from '../components/MusicCard';
import AlbumCard from '../components/AlbumCard';
import Carousel from '../components/Carousel';
import CoverArt from '../components/CoverArt';
import LoginBanner from '../components/LoginBanner';
import PopularArtists from '../components/PopularArtists';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { CardSkeletons } from '../components/Loading';

// Newest first. Uses createdAt when available, otherwise assumes the API lists oldest first.
function sortRecent(tracks) {
  if (tracks.some((t) => t.createdAt)) {
    return [...tracks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
  return [...tracks].reverse();
}

// Albums are only known through tracks that reference them.
function collectAlbums(tracks) {
  const albums = new Map();
  tracks.forEach((track) => {
    if (track.albumId && !albums.has(track.albumId)) {
      albums.set(track.albumId, {
        id: track.albumId,
        title: track.albumTitle || 'Album',
        artistName: track.artistName,
        cover: track.cover,
      });
    }
  });
  return [...albums.values()];
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const { isAuthenticated } = useAuth();
  const { tracks, loading, error, reload } = useMusicLibrary(isAuthenticated);
  const { playTrack } = usePlayer();

  const recent = useMemo(() => sortRecent(tracks), [tracks]);
  const albums = useMemo(() => collectAlbums(tracks), [tracks]);
  console.log("Albums",albums);
  const results = useMemo(() => {
    if (!query) return [];
    return tracks.filter((t) =>
      [t.title, t.artistName, t.albumTitle].some((field) => field?.toLowerCase().includes(query)));
  }, [tracks, query]);

  const featured = recent[0];

  if (!isAuthenticated) {
    return (
      <div className="page">
        <LoginBanner />
        <PopularArtists />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <div className="hero hero-loading skeleton" />
        <h2 className="section-title">Music</h2>
        <CardSkeletons />
      </div>
    );
  }

  if (error) {
    return <div className="page"><ErrorMessage message={error} onRetry={reload} /></div>;
  }

  if (tracks.length === 0) {
    return (
      <div className="page">
        <EmptyState title="No music yet" text="Tracks uploaded by artists will show up here." />
      </div>
    );
  }

  if (query) {
    return (
      <div className="page">
        <section className="section">
          <h2 className="section-title">Results for “{searchParams.get('q')}”</h2>
          {results.length === 0 ? (
            <EmptyState title="Nothing matches" text="Try a different title, artist or album name." />
          ) : (
            <div className="card-grid">
              {results.map((track) => <MusicCard key={track.id} track={track} queue={results} />)}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-art">
          <CoverArt src={featured.cover} title={featured.title} />
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">Latest on Wavify</p>
          <h1>{featured.title}</h1>
          <p className="hero-sub">by {featured.artistName}</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => playTrack(featured, recent)}>
              <Play size={16} fill="currentColor" /> Listen now
            </button>
            <a href="#all-music" className="btn btn-outline">Browse all</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Recently added</h2>
        <Carousel>
          {recent.slice(0, 12).map((track) => (
            <div className="carousel-item" key={track.id}>
              <MusicCard track={track} queue={recent} />
            </div>
          ))}
        </Carousel>
      </section>

      <PopularArtists />

      {albums.length > 0 && (
        <section className="section">
          <h2 className="section-title">Albums</h2>
          <Carousel>
            {albums.map((album) => (
              <div className="carousel-item" key={album.id}>
                <AlbumCard album={album} />
              </div>
            ))}
          </Carousel>
        </section>
      )}

      <section className="section" id="all-music">
        <h2 className="section-title">All music</h2>
        <div className="card-grid">
          {tracks.map((track) => <MusicCard key={track.id} track={track} queue={tracks} />)}
        </div>
      </section>
    </div>
  );
}
