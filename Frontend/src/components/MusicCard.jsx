import { Pause, Play } from 'lucide-react';
import CoverArt from './CoverArt';
import { usePlayer } from '../context/MusicPlayerContext';

export default function MusicCard({ track, queue }) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  return (
    <article className={`music-card ${isCurrent ? 'is-active' : ''}`}>
      <div className="music-card-art">
        <CoverArt src={track.cover} title={track.title} />
        <button
          type="button"
          className="play-overlay"
          aria-label={`${isCurrent && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
          onClick={() => playTrack(track, queue)}
        >
          {isCurrent && isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
        </button>
      </div>
      <h3 className="card-title" title={track.title}>{track.title}</h3>
      <p className="card-subtitle">{track.artistName}</p>
    </article>
  );
}
