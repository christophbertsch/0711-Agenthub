import { useState, useEffect } from 'react';
import { User } from '../types';

const AUTH_KEY = 'agenthub_auth';
const VALID_USERNAME = '0711';
const VALID_PASSWORD = '0711';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const userData: User = {
        username,
        isAuthenticated: true
      };
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user?.isAuthenticated || false
  };
}