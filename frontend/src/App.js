import React from 'react';
import {CircularProgress, Container} from '@mui/material';
import Home from './pages/Home';
import Auth from './pages/Auth';
import {Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import {useAuth} from './hooks/auth.hook';
import {AuthContext} from "./context/AuthContext";

const App = () => {
  const {token, login, logout, ready} = useAuth();
  const isAuthenticated = !!token;

  if (!ready) {
    return <CircularProgress />
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{
        login, logout, isAuthenticated, ready
      }}>
        <Container maxWidth={'md'}>
          <Routes>
            {isAuthenticated ? (<Route path={'/'} element={<Home/>}/> ) : <Route path={'/auth'} element={<Auth/>}/>}
            <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace />} />
          </Routes>
        </Container>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;