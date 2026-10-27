import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useAlbumsLibrary from '../hooks/useAlbumsLibrary';
import AlbumCard from '../components/AlbumCard';
import { CardSkeletons } from '../components/Loading';

const Albums = () => {

  const { isAuthenticated } = useAuth();
  const { tracks, loading, error, reload } = useAlbumsLibrary(isAuthenticated);

  if (loading) {
      return (
        <div className="page">
          <div className="hero hero-loading skeleton" />
          <h2 className="section-title">Albums</h2>
          <CardSkeletons />
        </div>
      );
    }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    );
  }

  if (!tracks.length) {
    return <div className="page"><p>No albums found.</p></div>;
  }

  return (
    <div className="page">
    <section className="section">
      <h2 className="section-title">Albums</h2>
      <div className="card-grid">
        {tracks.map((album) => (
            <AlbumCard album={album} />
        ))}
      </div>
    </section>
    </div>
  )
}

export default Albums