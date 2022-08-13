import React, {useCallback, useEffect, useState} from 'react';
import {CircularProgress, Container} from '@mui/material';
import Home from './pages/Home';
import Auth from './pages/Auth';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import {useAuth} from './hooks/auth.hook';
import {MainContext} from './context/MainContext';
import {getMe} from './api/mainApi';

const App = () => {
  const {token, login, logout, ready} = useAuth();
  const [userData, setUserData] = useState(null);
  const [changeItemData, setChangeItemData] = useState(null);
  const [availableCurrency, setAvailableCurrency] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const isAuthenticated = !!token;

  const getUserData = useCallback(async () => {
    const data = await getMe();
    setUserData(data.user);
    setAvailableCurrency(data.availableCurrency);
    setSelectedCurrency(data.availableCurrency[0]);
  }, []);

  const handleSelectChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  useEffect(() => {
    if (ready) {
      if (isAuthenticated && window.localStorage.getItem('token')) {
        getUserData();
      }
    }
  }, [ready, isAuthenticated, getUserData])

  if (!ready) {
    return <CircularProgress/>
  }

  return (
    <BrowserRouter>
      <MainContext.Provider value={{
        login, logout, isAuthenticated, ready, userData,
        setUserData, getUserData, changeItemData, setChangeItemData,
        availableCurrency, selectedCurrency, setSelectedCurrency, handleSelectChange
      }}>
        <Container maxWidth={'md'}>
          <Routes>
            {isAuthenticated ? (<Route path={'/'} element={<Home/>}/>) : <Route path={'/'} element={<Auth/>}/>}
          </Routes>
        </Container>
      </MainContext.Provider>
    </BrowserRouter>
  );
};

export default App;