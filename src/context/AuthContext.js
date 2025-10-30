'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      // HttpOnly auth-token cookie'si js-cookie ile okunamaz.
      // UI için "user-data" yeterlidir; route korumasını middleware yapıyor.
      const userData = Cookies.get('user-data');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        throw new Error('Giriş başarısız');
      }
      const data = await res.json();
      setUser(data.user);
      Cookies.set('user-data', JSON.stringify(data.user), { expires: 7 });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const logout = async () => {
    try { await fetch('/api/logout', { method: 'POST' }); } catch {}
    setUser(null);
    Cookies.remove('user-data');
    // Kullanıcı çıkışında kullanıcıyla ilişkili localStorage verilerini temizle
    try {
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    } catch {}
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
