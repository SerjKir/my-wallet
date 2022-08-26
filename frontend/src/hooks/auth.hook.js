import {useCallback, useEffect, useState} from 'react';

export const useAuth = (setUserData, setChangeItemData) => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((token) => {
    setToken(token);
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserData(null);
    setChangeItemData(null);
    localStorage.removeItem('token');
  }, [setUserData, setChangeItemData]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    token && login(token);
    setReady(true);
  }, [login])

  return {login, logout, token, ready};
};