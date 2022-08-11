import React, {useContext, useState} from 'react';
import {Button, Paper, TextField, Typography} from '@mui/material';
import styles from './Login.module.scss';
import {useForm} from 'react-hook-form';
import {loginApi, registerApi} from '../../api/mainApi';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {login} = useContext(AuthContext)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {name: '', password: ''},
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    let data = null;
    await (isLogin ? loginApi : registerApi)(values).then(res => {
      data = res;
    }).catch(error => {
      console.log(isLogin ? 'Не вдалося авторизуватися' : 'Не вдалося зареєструватися');
    });
    if (data?.token) {
      await login(data.token, data.userId);
      navigate('/', {replace: true});
    }
  };

  return (
    <Paper classes={{root: styles.root}}>
      <Typography variant="h5" classes={{root: styles.title}}>
        {isLogin ? 'Вхід до аккаунта' : 'Реєстрація аккаунта'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          className={styles.field}
          error={!!errors.name?.message}
          helperText={errors.name?.message}
          {...register('name', {required: "Вкажіть им'я"})}
        />
        <TextField
          label="Password"
          fullWidth
          className={styles.field}
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register('password', {required: 'Вкажіть пароль'})}
        />
        {isLogin ?
          <div className={styles.buttons} >
            <Button
              type={'submit'}
              size="large"
              variant="contained"
              color={'primary'}
              disabled={!isValid}
            >
              Войти
            </Button>
            <span onClick={() => setIsLogin(false)}>Немає облікового запису? Реєстрація.</span>
          </div>
          :
          <div className={styles.buttons} >
            <Button
              type={'submit'}
              size="large"
              variant="contained"
              color={'primary'}
              disabled={!isValid}
            >
              Регистрация
            </Button>
            <span onClick={() => setIsLogin(true)}>Є обліковий запис? Вхід.</span>
          </div>
        }
      </form>
    </Paper>
  );
};

export default Index;