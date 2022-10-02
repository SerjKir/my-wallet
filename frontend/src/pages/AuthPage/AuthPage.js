import React from 'react';
import styles from './AuthPage.module.scss';
import Auth from "../../components/Auth/Auth";

const AuthPage = () => {
  return (
    <div className={styles.main}>
      <Auth/>
    </div>
  );
};

export default AuthPage;