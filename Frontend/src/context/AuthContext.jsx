import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { TOKEN_KEY } from '../services/api';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'auth_user';
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const { showToast } = useToast();

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(async (credentials) => {
    const nextUser = await authService.login(credentials);
    saveUser(nextUser);
    return nextUser;
  }, [saveUser]);

  const register = useCallback(async (details) => {
    const nextUser = await authService.register(details);
    // Only sign in automatically if the backend actually returned a user.
    if (nextUser.hasServerUser) saveUser(nextUser);
    return nextUser;
  }, [saveUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the request fails, clear the local session.
    }
    saveUser(null);
  }, [saveUser]);

  useEffect(() => {
    const handleExpired = () => {
      if (!localStorage.getItem(STORAGE_KEY)) return;
      localStorage.removeItem(TOKEN_KEY);
      saveUser(null);
      showToast('Your session has expired. Please log in again.', 'error');
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [saveUser, showToast]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isArtist: user?.role === 'artist',
    login,
    register,
    logout,
  }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
