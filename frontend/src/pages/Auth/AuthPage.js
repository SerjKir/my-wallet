import React, {useState} from 'react';
import {Button, Paper, TextField, Typography} from '@mui/material';
import styles from './Auth.module.scss';
import {useForm} from 'react-hook-form';
import {loginApi, registerApi} from '../../api/mainApi';
import {useNavigate} from 'react-router-dom';

const AuthPage = ({login, setNotification}) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const {
    register, handleSubmit, formState: {errors, isValid},
  } = useForm({
    defaultValues: {name: '', password: ''}, mode: 'onChange',
  });

  const onSubmit = async (values) => {
    let token = null;
    await (isLogin ? loginApi : registerApi)(values).then(res => {
      token = res.data;
    }).catch(error => {
      setNotification({open: true, message: error.response.data.message, style: 'error'});
    });
    if (token) {
      await login(token);
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
          label="Им'я"
          fullWidth
          required={true}
          className={styles.field}
          error={!!errors.name?.message}
          helperText={errors.name?.message}
          {...register('name', {required: 'Вкажіть им\'я'})}
        />
        <TextField
          label="Пароль"
          fullWidth
          required={true}
          className={styles.field}
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register('password', {required: 'Вкажіть пароль'})}
        />
        {isLogin ? <div className={styles.buttons}>
          <Button
            type={'submit'}
            size="large"
            variant="contained"
            color={'primary'}
            disabled={!isValid}
          >
            Вхід
          </Button>
          <span onClick={() => setIsLogin(false)}>Немає облікового запису? Реєстрація</span>
        </div> : <div className={styles.buttons}>
          <Button
            type={'submit'}
            size="large"
            variant="contained"
            color={'primary'}
            disabled={!isValid}
          >
            Реєстрація
          </Button>
          <span onClick={() => setIsLogin(true)}>Є обліковий запис? Вхід</span>
        </div>}
      </form>
    </Paper>
  );
};

export default AuthPage;