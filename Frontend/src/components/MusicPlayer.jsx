import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import CoverArt from './CoverArt';
import { usePlayer } from '../context/MusicPlayerContext';
import { formatTime } from '../utils/formatTime';

export default function MusicPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, playbackError,
    hasNext, hasPrevious, togglePlay, seek, next, previous, setVolume,
  } = usePlayer();

  if (!currentTrack) return null;

  const canPlay = Boolean(currentTrack.audioUrl) && !playbackError;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section className="player" aria-label="Music player">
      <div className="player-track">
        <CoverArt src={currentTrack.cover} title={currentTrack.title} className="player-cover" />
        <div className="player-meta">
          <strong title={currentTrack.title}>{currentTrack.title}</strong>
          <small>{playbackError || currentTrack.artistName}</small>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button type="button" className="icon-btn" aria-label="Previous track" onClick={previous} disabled={!hasPrevious && currentTime < 1}>
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button type="button" className="play-btn" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay} disabled={!canPlay}>
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button type="button" className="icon-btn" aria-label="Next track" onClick={next} disabled={!hasNext}>
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        <div className="player-progress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            style={{ '--fill': `${progress}%` }}
            disabled={!canPlay || !duration}
            aria-label="Seek"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <button type="button" className="icon-btn" aria-label={volume === 0 ? 'Unmute' : 'Mute'} onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          className="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ '--fill': `${volume * 100}%` }}
          aria-label="Volume"
        />
      </div>
    </section>
  );
}
