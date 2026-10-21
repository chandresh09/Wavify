import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mic2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const ROLES = [
  { value: 'user', label: 'Listener', text: 'Browse and play music.', Icon: User },
  { value: 'artist', label: 'Artist', text: 'Also publish music and albums.', Icon: Mic2 },
];

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    if (form.username.trim().length < 3) errors.username = 'Username must be at least 3 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
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
      const user = await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      if (user.hasServerUser) {
        showToast('Account created. Welcome!');
        navigate(user.role === 'artist' ? '/dashboard' : '/', { replace: true });
      } else {
        showToast('Account created. Please log in.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setApiError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page-center">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create account</h1>
        <p className="muted">Join to listen, or publish as an artist.</p>
        <ErrorMessage message={apiError} />

        <label className="field">
          <span>Username</span>
          <input name="username" value={form.username} onChange={handleChange} autoComplete="username" autoFocus />
          {fieldErrors.username && <em className="field-error">{fieldErrors.username}</em>}
        </label>

        <label className="field">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
          {fieldErrors.email && <em className="field-error">{fieldErrors.email}</em>}
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-with-button">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button type="button" className="icon-btn" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && <em className="field-error">{fieldErrors.password}</em>}
        </label>

        <fieldset className="role-picker">
          <legend>I am a</legend>
          {ROLES.map(({ value, label, text, Icon }) => (
            <label key={value} className={`role-option ${form.role === value ? 'selected' : ''}`}>
              <input type="radio" name="role" value={value} checked={form.role === value} onChange={handleChange} />
              <Icon size={20} />
              <span><strong>{label}</strong><small>{text}</small></span>
            </label>
          ))}
        </fieldset>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="muted center">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
