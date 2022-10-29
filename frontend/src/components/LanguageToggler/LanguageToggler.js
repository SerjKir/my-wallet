import React, {useEffect, useState} from 'react';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useTranslation} from "react-i18next";

const LanguageToggler = () => {
  const {i18n} = useTranslation();
  const [lang, setLang] = useState('ua');
  const handleChange = (event, newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };
  useEffect(() => {
    let lang = window.localStorage.getItem("i18nextLng");
    lang = lang === "en" ? "en" : "ua";
    window.localStorage.setItem("i18nextLng", lang)
    setLang(lang);
  }, []);
  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={lang}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="ua">UA</ToggleButton>
      <ToggleButton value="en">EN</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageToggler;