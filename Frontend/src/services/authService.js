import api, { TOKEN_KEY } from './api';

// Backend responses are not documented, so we read the user from the most common shapes.
function extractUser(data, fallback = {}) {
  const raw = data?.user || data?.data?.user || null;
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    id: source._id || source.id || null,
    username: source.username || source.name || fallback.username || '',
    email: source.email || fallback.email || '',
    // Used for UI only. The backend still enforces permissions.
    role: source.role || 'user',
    hasServerUser: Object.keys(source).length > 0,
  };
}

function saveToken(data) {
  const token = data?.token || data?.accessToken;
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export async function register({ username, email, password, role }) {
  const { data } = await api.post('/auth/register', { username, email, password, role });
  saveToken(data);
  return extractUser(data, { username, email });
}

export async function login({ identifier, password }) {
  // Sends "email" when the identifier looks like an email, otherwise "username".
  const body = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };
  const { data } = await api.post('/auth/login', body);
  saveToken(data);
  return extractUser(data, body);
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
}
