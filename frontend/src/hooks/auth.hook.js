import {useCallback, useEffect, useState} from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((token) => {
    setToken(token);
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      login(token)
    }
    setReady(true)
  }, [login])

  return {login, logout, token, ready}
}