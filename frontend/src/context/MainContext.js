import {createContext} from 'react';

export const MainContext = createContext({
  login: null,
  logout: null,
  userData: null,
  walletData: null,
  setWalletData: null,
  changeItemData: null,
  setChangeItemData: null,
  currency: null,
  handleSelectChange: null,
  catchHandler: null,
  setNotification: null,
})