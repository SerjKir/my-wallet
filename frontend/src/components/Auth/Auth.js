import React, {useContext, useState} from 'react';
import {Button, Paper, TextField, Typography} from '@mui/material';
import styles from './Auth.module.scss';
import {useForm} from 'react-hook-form';
import {loginApi, registerApi} from '../../api/mainApi';
import {useNavigate} from 'react-router-dom';
import {MainContext} from "../../context/MainContext";
import {removeSpaces} from "../../helpers";
import {useTranslation} from "react-i18next";
import {UserContext} from "../../context/UserContext";

const Auth = () => {
  const {t} = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const {catchHandler} = useContext(MainContext);
  const {login} = useContext(UserContext);
  const {
    register, handleSubmit, formState: {errors, isValid},
  } = useForm({
    mode: 'onChange',
  });
  const minSymbols = `${t("common.min")} 3 ${t("common.symbols_1")}`;
  const maxSymbols = `${t("common.max")} 16 ${t("common.symbols_2")}`;

  const onSubmit = async values => {
    let token = null;
    const res = await (isLogin ? loginApi : registerApi)(values).catch(error => catchHandler(error));
    if (res) {
      token = res.data;
      if (token) {
        await login(token);
        navigate('/', {replace: true});
      }
    }
  };

  return (
    <Paper className={styles.main}>
      <Typography variant="h5" classes={{root: styles.title}}>
        {isLogin ? t("auth.loginToAccount") : t("auth.accountRegistration")}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={t("auth.name")}
          fullWidth
          required={true}
          className={styles.field}
          onInput={event => removeSpaces(event)}
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register('username', {
            required: t("auth.enterName"),
            minLength: {value: 3, message: minSymbols},
            maxLength: {value: 16, message:maxSymbols}
          })}
        />
        <TextField
          label={t("auth.password")}
          type={"password"}
          fullWidth
          required={true}
          className={styles.field}
          onInput={event => removeSpaces(event)}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: t("auth.enterPassword"),
            minLength: {value: 3, message: minSymbols},
            maxLength: {value: 16, message: maxSymbols}
          })}
        />
        {isLogin ? <div className={styles.buttons}>
          <Button type={'submit'} size="large" variant="contained" color={'primary'} disabled={!isValid}>
            {t("auth.login")}
          </Button>
          <span onClick={() => setIsLogin(false)}>{t("auth.dontHaveAccountRegister")}</span>
        </div> : <div className={styles.buttons}>
          <Button type={'submit'} size="large" variant="contained" color={'primary'} disabled={!isValid}>
            {t("auth.register")}
          </Button>
          <span onClick={() => setIsLogin(true)}>{t("auth.haveAccountLogin")}</span>
        </div>}
      </form>
    </Paper>
  );
};

export default Auth;
