import {createContext} from 'react';

export const MainContext = createContext({
  logout: null,
  userData: null,
  getUserData: null,
  changeItemData: null,
  setChangeItemData: null,
  currency: null,
  handleSelectChange: null,
  catchHandler: null,
  setNotification: null,
})