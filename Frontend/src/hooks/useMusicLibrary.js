import { useCallback, useEffect, useState } from 'react';
import { fetchAllMusic } from '../services/musicService';
import { getErrorMessage } from '../services/api';

// Loads every track (only when `enabled`; clears the list when it turns off) from GET /music/ and exposes loading and error state.
export default function useMusicLibrary(enabled = true) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!enabled) {
      setTracks([]);
      setError('');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setTracks(await fetchAllMusic());
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load music.'));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { tracks, loading, error, reload: load };
}
