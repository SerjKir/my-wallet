import {createContext} from "react";

function noop() {}

export const MainContext = createContext({
  login: noop,
  logout: noop,
  setUserData: noop,
  getUserData: noop,
  isAuthenticated: false,
  userData: null,
  changeItemData: null,
  setChangeItemData: null,
  availableCurrency: null,
  selectedCurrency: null,
  setSelectedCurrency: noop,
  handleSelectChange: noop,
})