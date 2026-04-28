import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

/**
 * AuthProvider — Manages user authentication state
 * Uses Firebase Auth when configured, falls back to localStorage mock
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    try {
      const saved = localStorage.getItem('civicq-user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // In production, this would call Firebase Auth
    // For demo, we create a mock user
    const mockUser = {
      uid: 'demo-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('civicq-user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    const mockUser = {
      uid: 'demo-' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('civicq-user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('civicq-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
