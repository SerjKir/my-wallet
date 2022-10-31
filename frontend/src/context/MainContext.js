import {createContext} from 'react';

export const MainContext = createContext({
  walletData: null,
  setWalletData: null,
  changeItemData: null,
  setChangeItemData: null,
  currency: null,
  handleSelectChange: null,
  catchHandler: null,
  setNotification: null,
});