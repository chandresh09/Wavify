import axios from 'axios';

export const TOKEN_KEY = 'auth_token';

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL || 'https://wavify-ec9l.onrender.com/api',
  // Cookie sessions need this. The backend CORS config must allow credentials.
  withCredentials: import.meta.env.VITE_USE_COOKIES !== 'false',
  timeout: 20000,
});

// If the backend returns a token on login, send it as a Bearer token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tell the app when a stored session is no longer valid.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.startsWith('/auth/')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (error?.request && !error?.response) {
    return 'Cannot reach the server. Check that the backend is running and the API URL is correct.';
  }
  const data = error?.response?.data;
  if (typeof data === 'string' && data.length < 200) return data;
  if (data?.message) return data.message;
  if (data?.error) return typeof data.error === 'string' ? data.error : fallback;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e.msg || e.message || String(e)).join('. ');
  }
  return error?.message && !error?.response ? error.message : fallback;
}

export default api;
