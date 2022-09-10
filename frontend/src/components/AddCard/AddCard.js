import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './AddCard.module.scss';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {addCard} from '../../api/mainApi';
import ExpireDatePicker from '../ExpireDatePicker/ExpireDatePicker';
import {MainContext} from '../../context/MainContext';
import {checkCard, numbersOnly} from '../../helpers';

const AddCard = ({setPage}) => {
  const formRef = useRef(null);
  const {
    getUserData,
    currency,
    handleSelectChange,
    catchHandler,
  } = useContext(MainContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (values) => {
    await addCard({currency: currency.selectedCurrency, expDate: selectedDate, ...values})
      .then(() => {
        getUserData();
        setPage('Cards');
      }).catch(error => {
        catchHandler(error);
      });
  };

  useEffect(() => {
    formRef.current.scrollIntoView({block: 'center', behavior: 'smooth'});
  }, [formRef]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" className={styles.title}>
        Додати картку
      </Typography>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'text'} label="Номер картки" variant="outlined"
                   onInput={event => numbersOnly(event)}
                   inputProps={{maxLength: 19}}
                   error={!!errors.number}
                   helperText={errors.number?.message}
                   {...register('number', {
                     validate: checkCard,
                     required: 'Вкажіть номер картки',
                     minLength: {value: 16, message: 'Мінімум 16 символів'}
                   })}
        />
      </div>
      <div className={styles.row}>
        <ExpireDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        <TextField required={true} fullWidth type={'password'} label="CVV" variant="outlined"
                   onInput={event => numbersOnly(event)}
                   inputProps={{maxLength: 3}}
                   error={!!errors.cvv}
                   helperText={errors.cvv?.message}
                   {...register('cvv', {
                     required: 'Вкажіть CVV',
                     minLength: {value: 3, message: 'Вкажіть 3 цифри'}})}
        />
      </div>
      <div className={styles.row}>
        <TextField fullWidth label="Власник картки" variant="outlined"
                   error={!!errors.holder}
                   helperText={errors.holder?.message}
                   {...register('holder')}
        />
      </div>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'number'} label="Сума" variant="outlined"
                   error={!!errors.amount}
                   helperText={errors.amount?.message}
                   {...register('amount', {
                     required: 'Вкажіть суму',
                     min: {value: 0, message: 'Мінімум 0'}})}
        />
        <FormControl fullWidth>
          <InputLabel>Валюта</InputLabel>
          <Select
            label="Валюта"
            value={currency.selectedCurrency}
            onChange={handleSelectChange}
          >
            {currency.availableCurrency.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className={`${styles.row} ${styles.buttons}`}>
        <Button variant={'contained'} type={'submit'} color={'primary'} disabled={!isValid}>Додати</Button>
        <Button variant={'contained'} color={'error'} onClick={() => setPage('Cards')}>Скасувати</Button>
      </div>
    </form>
  );
};

export default AddCard;