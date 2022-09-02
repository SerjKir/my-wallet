import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './AddCard.module.scss';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {addCard} from '../../api/mainApi';
import ExpireDatePicker from '../ExpireDatePicker/ExpireDatePicker';
import {MainContext} from '../../context/MainContext';
import {checkCard, numbersOnly} from '../../helpers';

const AddCard = ({setPage, catchHandler}) => {
  const {
    getUserData,
    currency,
    handleSelectChange,
  } = useContext(MainContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {number: '', cvv: '', holder: '', amount: ''},
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    await addCard({currency: currency.selectedCurrency, expDate: selectedDate, ...values})
      .then(() => {
        getUserData();
        setPage('CardsInfo');
      }).catch(error => {
        catchHandler(error);
      });
  };

  const ref = useRef(null);
  useEffect(() => {
    ref.current.scrollIntoView({block: "center", behavior: "smooth"});
  }, [])

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" className={styles.title}>
        Додавання картки
      </Typography>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'text'} label="Номер картки" variant="outlined"
                   onInput={event => numbersOnly(event)}
                   inputProps={{maxLength: 19}}
                   error={!!errors.number?.message}
                   helperText={errors.number?.message}
                   {...register('number', {validate: checkCard, required: 'Вкажіть номер картки', minLength: 13})}
        />
      </div>
      <div className={styles.row}>
        <ExpireDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        <TextField required={true} fullWidth type={'password'} label="CVV" variant="outlined"
                   onInput={event => numbersOnly(event)}
                   inputProps={{maxLength: 3}}
                   error={!!errors.cvv?.message}
                   helperText={errors.cvv?.message}
                   {...register('cvv', {required: 'Вкажіть CVV', minLength: 3})}
        />
      </div>
      <div className={styles.row}>
        <TextField fullWidth label="Власник картки" variant="outlined"
                   error={!!errors.holder?.message}
                   helperText={errors.holder?.message}
                   {...register('holder')}
        />
      </div>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'number'} label="Сума" variant="outlined"
                   error={!!errors.amount?.message}
                   helperText={errors.amount?.message}
                   {...register('amount', {required: 'Вкажіть суму'})}
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
      <div className={styles.row}>
        <Button variant={'contained'} type={'submit'} color={'primary'} disabled={!isValid}>Додати картку</Button>
        <Button variant={'contained'} color={'error'} onClick={() => setPage('CardsInfo')}>Скасувати</Button>
      </div>
    </form>
  );
};

export default AddCard;