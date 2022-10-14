import React, {useCallback, useEffect, useState} from 'react';
import {Container} from '@mui/material';
import {AuthPage, HomePage} from './pages';
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {useAuth} from './hooks/auth.hook';
import {MainContext} from './context/MainContext';
import {getUser, getWallet} from './api/mainApi';
import {Informer, ProgressMain} from './components';
import {getToken} from './helpers';
import './index.scss';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [currency, setCurrency] = useState({availableCurrency: null, selectedCurrency: ''});
  const [changeItemData, setChangeItemData] = useState(null);
  const [notification, setNotification] = useState({});
  const {token, login, logout, ready} = useAuth(setUserData, setChangeItemData);
  const isAuthenticated = !!token && getToken();
  const [dataReady, setDataReady] = useState(false);

  const catchHandler = useCallback(error => {
    error.response.status === 401 && logout();
    setNotification({open: true, message: error.response.data.message, style: 'error'});
  }, [logout]);

  const handleSelectChange = useCallback(event => {
    setCurrency(prevState => ({
      availableCurrency: prevState.availableCurrency,
      selectedCurrency: event?.target.value || 'UAH'
    }));
  }, []);

  const getUserData = useCallback(async () => {
    await getUser().then(res => {
      setUserData(res.data.user);
      setCurrency({
        availableCurrency: res.data.availableCurrency,
        selectedCurrency: res.data.availableCurrency[0]
      });
    }).catch(error => catchHandler(error));
  }, [catchHandler]);

  const getWalletData = useCallback(async () => {
    await getWallet().then(res => setWalletData(res.data)).catch(error => catchHandler(error));
  }, [catchHandler]);

  const getAllData = useCallback( async () => {
    setDataReady(false);
    await getUserData();
    await getWalletData();
    setDataReady(true);
  }, [getUserData, getWalletData]);

  useEffect(() => {
    ready && isAuthenticated && getAllData();
  }, [ready, isAuthenticated, getAllData]);

  if (!ready || (!dataReady && isAuthenticated)) return <ProgressMain/>;

  return (
    <BrowserRouter>
      <MainContext.Provider value={{
        login,
        logout,
        userData,
        getUserData,
        walletData,
        getWalletData,
        changeItemData,
        setChangeItemData,
        currency,
        handleSelectChange,
        catchHandler,
        setNotification,
      }}>
        <Container maxWidth={'md'}>
          <Routes>
            {isAuthenticated
              ? <Route path={'/'} element={<HomePage userData={!!userData}/>}/>
              : <Route path={'/'} element={<AuthPage/>}/>}
            <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
          </Routes>
          <Informer snack={notification} setNotification={setNotification}/>
        </Container>
      </MainContext.Provider>
    </BrowserRouter>
  );
};

export default App;