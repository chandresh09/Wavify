import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createMusic } from '../services/musicService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import ErrorMessage from '../components/ErrorMessage';

export default function CreateMusic() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ title: '', mode: 'file', audioUrl: '', coverUrl: '' });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Give your track a title.';
    if (form.mode === 'file') {
      if (!file) errors.file = 'Choose an audio file.';
      else if (!file.type.startsWith('audio/')) errors.file = 'That file is not an audio file.';
    } else if (!/^https?:\/\/\S+$/.test(form.audioUrl.trim())) {
      errors.audioUrl = 'Enter a full URL starting with http:// or https://.';
    }
    if (form.coverUrl.trim() && !/^https?:\/\/\S+$/.test(form.coverUrl.trim())) {
      errors.coverUrl = 'Enter a full image URL, or leave it empty.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errors = validate();
    setFieldErrors(errors);
    setApiError('');
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await createMusic({
        title: form.title.trim(),
        mode: form.mode,
        file,
        audioUrl: form.audioUrl.trim(),
        coverUrl: form.coverUrl.trim(),
      });
      showToast('Music published.');
      navigate('/dashboard');
    } catch (err) {
      setApiError(getErrorMessage(err, 'Could not create the music. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page-center">
      <form className="auth-card wide" onSubmit={handleSubmit} noValidate>
        <h1>Create music</h1>
        <p className="muted">Publish a new track to the library.</p>
        <ErrorMessage message={apiError} />

        <label className="field">
          <span>Title</span>
          <input name="title" value={form.title} onChange={handleChange} autoFocus />
          {fieldErrors.title && <em className="field-error">{fieldErrors.title}</em>}
        </label>

        <div className="segmented" role="radiogroup" aria-label="Audio source">
          <button type="button" role="radio" aria-checked={form.mode === 'file'} className={form.mode === 'file' ? 'on' : ''} onClick={() => setForm({ ...form, mode: 'file' })}>Upload file</button>
          <button type="button" role="radio" aria-checked={form.mode === 'url'} className={form.mode === 'url' ? 'on' : ''} onClick={() => setForm({ ...form, mode: 'url' })}>Audio URL</button>
        </div>

        {form.mode === 'file' ? (
          <label className="field">
            <span>Audio file</span>
            <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {fieldErrors.file && <em className="field-error">{fieldErrors.file}</em>}
          </label>
        ) : (
          <label className="field">
            <span>Audio URL</span>
            <input name="audioUrl" type="url" placeholder="https://…" value={form.audioUrl} onChange={handleChange} />
            {fieldErrors.audioUrl && <em className="field-error">{fieldErrors.audioUrl}</em>}
          </label>
        )}

        <label className="field">
          <span>Cover image URL (optional)</span>
          <input name="coverUrl" type="url" placeholder="https://…" value={form.coverUrl} onChange={handleChange} />
          {fieldErrors.coverUrl && <em className="field-error">{fieldErrors.coverUrl}</em>}
        </label>

        <div className="form-actions">
          <Link to="/dashboard" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish music'}
          </button>
        </div>
      </form>
    </div>
  );
}
