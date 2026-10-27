import { Link } from 'react-router-dom';
import CoverArt from './CoverArt';

export default function AlbumCard({ album }) {
  return (
    <Link to={`/albums/${album._id}`} className="music-card album-card">
      <div className="music-card-art">
        <CoverArt src={album.cover} title={album.title} />
      </div>
      <h3 className="card-title" title={album.title}>{album.title}</h3>
      <p className="card-subtitle">{album.artist?.username || 'Album'}</p>
    </Link>
  );
}
