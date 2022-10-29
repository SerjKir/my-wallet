import React, {useContext, useState} from 'react';
import {Button, Paper, TextField, Typography} from '@mui/material';
import styles from './Auth.module.scss';
import {useForm} from 'react-hook-form';
import {loginApi, registerApi} from '../../api/mainApi';
import {useNavigate} from 'react-router-dom';
import {MainContext} from "../../context/MainContext";
import {removeSpaces} from "../../helpers";
import {useTranslation} from "react-i18next";

const Auth = () => {
  const {t} = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const {login, catchHandler} = useContext(MainContext);
  const {
    register, handleSubmit, formState: {errors, isValid},
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async values => {
    let token = null;
    await (isLogin ? loginApi : registerApi)(values).then(res => {
      token = res.data;
    }).catch(error => catchHandler(error));
    if (token) {
      await login(token);
      navigate('/', {replace: true});
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
            required: `Вкажіть ім'я`,
            minLength: {value: 3, message: 'Мінімум 3 символи'},
            maxLength: {value: 16, message: 'Максимум 16 символів'}
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
            required: 'Вкажіть пароль',
            minLength: {value: 3, message: 'Мінімум 3 символи'},
            maxLength: {value: 16, message: 'Максимум 16 символів'}
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