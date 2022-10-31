import React from 'react';
import styles from './EmptyDataText.module.scss';
import {useTranslation} from "react-i18next";

const EmptyDataText = ({name}) => {
  const {t} = useTranslation();
  return (
    <h3 className={styles.info}>
      {t("infoAboutYour")} {name}
    </h3>
  );
};

export default EmptyDataText;