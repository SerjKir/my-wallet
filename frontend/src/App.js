import React, {useCallback, useEffect, useState} from 'react';
import {Container} from '@mui/material';
import Home from './pages/Home/HomePage';
import Auth from './pages/Auth/AuthPage';
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {useAuth} from './hooks/auth.hook';
import {MainContext} from './context/MainContext';
import {getData} from './api/mainApi';
import Informer from './components/Informer/Informer';
import ProgressMain from './components/ProgressMain/ProgressMain';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [currency, setCurrency] = useState({availableCurrency: null, selectedCurrency: ''});
  const [changeItemData, setChangeItemData] = useState(null);
  const [notification, setNotification] = useState({});
  const {token, login, logout, ready} = useAuth(setUserData, setChangeItemData);
  const isAuthenticated = !!token && window.localStorage.getItem('token');

  const catchHandler = useCallback((error) => {
    error.response.status === 401 && logout();
    setNotification({open: true, message: error.response.data.message, style: 'error'});
  }, [logout]);

  const handleSelectChange = (event) => {
    setCurrency({
      availableCurrency: currency.availableCurrency,
      selectedCurrency: event.target.value
    })
  };

  const getUserData = useCallback(async () => {
    await getData().then(res => {
      setUserData(res.data.user);
      setCurrency({
        availableCurrency: res.data.availableCurrency,
        selectedCurrency: res.data.availableCurrency[0]
      })
    }).catch(error => {
      catchHandler(error);
    });
  }, [catchHandler]);

  useEffect(() => {
    ready && isAuthenticated && getUserData();
  }, [ready, isAuthenticated, getUserData]);

  if (!ready) {
    return <ProgressMain/>
  }

  return (
    <BrowserRouter>
      <MainContext.Provider value={{
        logout,
        userData,
        getUserData,
        changeItemData,
        setChangeItemData,
        currency,
        handleSelectChange,
      }}>
        <Container maxWidth={'md'}>
          <Routes>
            {isAuthenticated
              ? <Route path={'/'} element={<Home catchHandler={catchHandler} userData={userData} setNotification={setNotification}/>}/>
              : <Route path={'/'} element={<Auth login={login} catchHandler={catchHandler}/>}/>}
            <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
          </Routes>
          <Informer snack={notification} setNotification={setNotification}/>
        </Container>
      </MainContext.Provider>
    </BrowserRouter>
  );
};

export default App;