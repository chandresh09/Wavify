import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAlbum } from '../services/musicService';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useMusicLibrary from '../hooks/useMusicLibrary';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

const STORAGE_KEY = 'created_albums';

// The API has no "list albums" endpoint, so albums made here are remembered on this device.
export function readCreatedAlbums() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function rememberAlbum(album) {
  if (!album.id) return;
  const next = [album, ...readCreatedAlbums().filter((a) => a.id !== album.id)].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function CreateAlbum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { tracks, loading, error: loadError, reload } = useMusicLibrary();
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const myTracks = useMemo(() => tracks.filter((t) =>
    (user.id && t.artistId === user.id) || (user.username && t.artistName === user.username)), [tracks, user]);
  // If the API gives no artist info to match on, fall back to showing every track.
  const choices = myTracks.length > 0 ? myTracks : tracks;

  const toggleTrack = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errors = {};
    if (!title.trim()) errors.title = 'Give your album a title.';
    if (selected.length === 0) errors.tracks = 'Select at least one track.';
    setFieldErrors(errors);
    setApiError('');
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const album = await createAlbum({ title: title.trim(), musicIds: selected });
      rememberAlbum(album);
      showToast('Album created.');
      navigate(album.id ? `/albums/${album.id}` : '/dashboard');
    } catch (err) {
      setApiError(getErrorMessage(err, 'Could not create the album. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page-center">
      <form className="auth-card wide" onSubmit={handleSubmit} noValidate>
        <h1>Create album</h1>
        <p className="muted">Name the album and choose its tracks.</p>
        <ErrorMessage message={apiError} />

        <label className="field">
          <span>Album title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          {fieldErrors.title && <em className="field-error">{fieldErrors.title}</em>}
        </label>

        <fieldset className="field">
          <legend>Tracks</legend>
          {loading && <Loading label="Loading tracks…" />}
          <ErrorMessage message={loadError} onRetry={reload} />
          {!loading && !loadError && choices.length === 0 && (
            <p className="muted">No tracks yet. <Link to="/dashboard/music/new">Create music</Link> first.</p>
          )}
          <ul className="check-list">
            {choices.map((track) => (
              <li key={track.id}>
                <label className={`check-row ${selected.includes(track.id) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={selected.includes(track.id)} onChange={() => toggleTrack(track.id)} />
                  <span><strong>{track.title}</strong><small>{track.artistName}</small></span>
                </label>
              </li>
            ))}
          </ul>
          {fieldErrors.tracks && <em className="field-error">{fieldErrors.tracks}</em>}
        </fieldset>

        <div className="form-actions">
          <Link to="/dashboard" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create album'}
          </button>
        </div>
      </form>
    </div>
  );
}
