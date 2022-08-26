import React, {useCallback, useEffect, useState} from 'react';
import {Container} from '@mui/material';
import Home from './pages/Home/HomePage';
import Auth from './pages/Auth/AuthPage';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import {useAuth} from './hooks/auth.hook';
import {MainContext} from './context/MainContext';
import {getMe} from './api/mainApi';
import Snackbar from './components/Informer/Informer';
import ProgressMain from './components/ProgressMain/ProgressMain';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [currency, setCurrency] = useState({availableCurrency: null, selectedCurrency: ''});
  const [changeItemData, setChangeItemData] = useState(null);
  const [notification, setNotification] = useState({});
  const {token, login, logout, ready} = useAuth(setUserData, setChangeItemData);
  const isAuthenticated = !!token && window.localStorage.getItem('token');

  const handleSelectChange = useCallback((event) => {
    setCurrency({
      availableCurrency: currency.availableCurrency,
      selectedCurrency: event.target.value
    });
  }, [currency.availableCurrency]);

  const getUserData = useCallback(async () => {
    await getMe().then(res => {
      setUserData(res.data.user);
      setCurrency({
        availableCurrency: res.data.availableCurrency,
        selectedCurrency: res.data.availableCurrency[0]
      })
    }).catch(error => {
      error.response.status === 401 && logout();
      setNotification({open: true, message: error.response.data.message, style: 'error'});
    });
  }, [logout]);

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
        setNotification: setNotification,
      }}>
        <Container maxWidth={'md'}>
          <Routes>
            {isAuthenticated
              ? <Route path={'/'} element={<Home userData={userData}/>}/>
              : <Route path={'/'} element={<Auth login={login} setNotification={setNotification}/>}/>}
          </Routes>
          <Snackbar snack={notification} handleClose={setNotification}/>
        </Container>
      </MainContext.Provider>
    </BrowserRouter>
  );
};

export default App;