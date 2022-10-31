import {createContext} from 'react';

export const UserContext = createContext({
  login: null,
  logout: null,
  userData: null,
  setUserData: null,
});