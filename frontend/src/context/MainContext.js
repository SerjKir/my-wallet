import {createContext} from 'react';

function noop() {}

export const MainContext = createContext({
  logout: noop,
  userData: null,
  getUserData: noop,
  changeItemData: null,
  setChangeItemData: noop,
  currency: null,
  handleSelectChange: noop,
  setNotification: noop,
})