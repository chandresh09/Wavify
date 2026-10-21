import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';
import { sendSupportMessage } from '../services/supportService';
import ErrorMessage from '../components/ErrorMessage';
import LoginBanner from '../components/LoginBanner';
import supportBanner from '../assets/support-banner.svg';


const TOPICS = ['Account and login', 'Playback problem', 'Uploading music', 'Report a bug', 'Other'];

export default function Support() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: '',
    topic: TOPICS[0],
    subject: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    if (form.phone.trim() && !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number, or leave it empty.';
    if (!form.subject.trim()) errors.subject = 'Enter a subject.';
    if (form.message.trim().length < 10) errors.message = 'Write at least 10 characters.';
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
      await sendSupportMessage({ ...form, name: form.name.trim(), subject: form.subject.trim(), message: form.message.trim() });
      showToast('Thanks! We received your message.');
      setForm({ ...form, phone: '', subject: '', message: '' });
    } catch (err) {
      setApiError(getErrorMessage(err, 'Could not send your message. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page">
        <LoginBanner />
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Support</h1>
      <p className="muted page-lead">Tell us what's wrong and we'll get back to you by email.</p>

      <div className="support-layout">
        <div className="support-hero">
          <img src={supportBanner} alt="Headphones surrounded by sound waves" />
        </div>

        <form className="auth-card support-form" onSubmit={handleSubmit} noValidate>
          <ErrorMessage message={apiError} />

          <div className="field-row">
            <label className="field">
              <span>Full name</span>
              <input name="name" value={form.name} onChange={handleChange} autoComplete="name" />
              {fieldErrors.name && <em className="field-error">{fieldErrors.name}</em>}
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
              {fieldErrors.email && <em className="field-error">{fieldErrors.email}</em>}
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Phone (optional)</span>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
              {fieldErrors.phone && <em className="field-error">{fieldErrors.phone}</em>}
            </label>
            <label className="field">
              <span>Topic</span>
              <select name="topic" value={form.topic} onChange={handleChange}>
                {TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Subject</span>
            <input name="subject" value={form.subject} onChange={handleChange} />
            {fieldErrors.subject && <em className="field-error">{fieldErrors.subject}</em>}
          </label>

          <label className="field">
            <span>Message</span>
            <textarea name="message" rows="5" value={form.message} onChange={handleChange} />
            {fieldErrors.message && <em className="field-error">{fieldErrors.message}</em>}
          </label>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}
