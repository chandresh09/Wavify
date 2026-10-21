import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const MusicPlayerContext = createContext(null);

export function MusicPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackError, setPlaybackError] = useState('');

  const currentTrack = index >= 0 ? queue[index] || null : null;
  const hasNext = index >= 0 && index < queue.length - 1;
  const hasPrevious = index > 0;

  // Load and play whenever the selected track changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaybackError('');
    setCurrentTime(0);
    setDuration(0);

    if (!currentTrack || !currentTrack.audioUrl) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      setIsPlaying(false);
      if (currentTrack) setPlaybackError('Audio is not available for this track.');
      return;
    }

    audio.src = currentTrack.audioUrl;
    audio.play().catch(() => {
      setIsPlaying(false);
      setPlaybackError('This track could not be played.');
    });
  }, [currentTrack?.id, currentTrack?.audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;
    if (audio.paused) {
      audio.play().catch(() => setPlaybackError('This track could not be played.'));
    } else {
      audio.pause();
    }
  }, [currentTrack]);

  const playTrack = useCallback((track, list = [track]) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    const startIndex = list.findIndex((item) => item.id === track.id);
    setQueue(list);
    setIndex(startIndex >= 0 ? startIndex : 0);
  }, [currentTrack, togglePlay]);

  const stop = useCallback(() => {
    setQueue([]);
    setIndex(-1);
  }, []);

  const seek = useCallback((time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i < queue.length - 1 ? i + 1 : i));
  }, [queue.length]);

  const previous = useCallback(() => {
    if (currentTime > 3 || index <= 0) seek(0);
    else setIndex((i) => i - 1);
  }, [currentTime, index, seek]);

  const handleEnded = () => {
    if (hasNext) next();
    else setIsPlaying(false);
  };

  const value = useMemo(() => ({
    currentTrack, isPlaying, currentTime, duration, volume, playbackError,
    hasNext, hasPrevious,
    playTrack, togglePlay, seek, next, previous, setVolume, stop,
  }), [currentTrack, isPlaying, currentTime, duration, volume, playbackError,
    hasNext, hasPrevious, playTrack, togglePlay, seek, next, previous, stop]);

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        onError={() => {
          if (audioRef.current?.getAttribute('src')) {
            setIsPlaying(false);
            setPlaybackError('This track could not be loaded.');
          }
        }}
      />
    </MusicPlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error('usePlayer must be used inside MusicPlayerProvider');
  return context;
}
