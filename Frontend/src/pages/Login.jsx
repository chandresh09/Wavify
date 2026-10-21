import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    if (!form.identifier.trim()) errors.identifier = 'Enter your email or username.';
    if (!form.password) errors.password = 'Enter your password.';
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
      const user = await login({ identifier: form.identifier.trim(), password: form.password });
      showToast(`Welcome back${user.username ? `, ${user.username}` : ''}!`);
      const fallback = user.role === 'artist' ? '/dashboard' : '/';
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err, 'Login failed. Check your details and try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page-center">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>
        <p className="muted">Pick up where you left off.</p>
        <ErrorMessage message={apiError} />

        <label className="field">
          <span>Email or username</span>
          <input name="identifier" value={form.identifier} onChange={handleChange} autoComplete="username" autoFocus />
          {fieldErrors.identifier && <em className="field-error">{fieldErrors.identifier}</em>}
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-with-button">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button type="button" className="icon-btn" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && <em className="field-error">{fieldErrors.password}</em>}
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
        <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
