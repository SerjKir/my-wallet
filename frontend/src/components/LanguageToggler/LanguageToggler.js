import React, {useContext, useEffect} from 'react';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useTranslation} from "react-i18next";
import {UserContext} from "../../context/UserContext";
import {MainContext} from "../../context/MainContext";
import {setUserLang} from "../../api/mainApi";

const LanguageToggler = () => {
  const {catchHandler} = useContext(MainContext);
  const {userData, setUserData} = useContext(UserContext);
  const {i18n} = useTranslation();
  const handleChange = async (event, newLang) => {
    await setUserLang({lang: newLang}).then(res => {
      setUserData(prev => ({...prev, lang: res.data}))
    }).catch(error => catchHandler(error));
    await i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    i18n.changeLanguage(userData.lang);
  }, [userData.lang, i18n]);

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={userData.lang}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="uk">UK</ToggleButton>
      <ToggleButton value="en">EN</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageToggler;