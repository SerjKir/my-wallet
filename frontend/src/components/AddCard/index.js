import React, {useContext, useState} from 'react';
import styles from './AddCard.module.scss';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {addCard} from '../../api/mainApi';
import DatePicker from '../DatePicker';
import {MainContext} from '../../context/MainContext';

const Index = ({setPage}) => {
  const {getUserData, availableCurrency, selectedCurrency, handleSelectChange} = useContext(MainContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const checkCard = (value) => {
    const check = !(value.replace(/\D/g, '').split('').reverse().reduce(function(a, d, i) {
      return a + d * (i % 2 ? 2.2 : 1) | 0;
    }, 0) % 10);
    if (!check) {
      return "Не валідна картка"
    }
    return check;
  };

  const maxLength = (e, maxLength) => {
    e.target.value = Math.max(parseInt(e.target.value)).toString().slice(0, maxLength)
  };

  const minLength = (value, min = 3) => {
    return  value.length === min ? true : `Потрібно мінімум ${min} символи`;
  }

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {number: '', cvv: '', holder: '', amount: ''},
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const expDate = selectedDate.toLocaleDateString().slice(-7).replace(".", "/").replace('20', '');
    await addCard({currency: selectedCurrency, expDate, ...values})
      .then(data => {
        getUserData();
        setPage('CardsInfo');
      })
      .catch(err => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" className={styles.title}>
        Додавання картки
      </Typography>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'number'} label="Card number" variant="outlined"
                   onInput={(e) => maxLength(e, 19)}
                   error={!!errors.number?.message}
                   helperText={errors.number?.message}
                   {...register('number', {validate: checkCard, required: 'Вкажіть номер картки', minLength: 13 } )}
        />
      </div>
      <div className={styles.row}>
        <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        <TextField required={true} fullWidth type={'number'} label="CVV" variant="outlined"
                   onInput={(e) => maxLength(e, 3)}
                   error={!!errors.cvv?.message}
                   helperText={errors.cvv?.message}
                   {...register('cvv', {required: 'Вкажіть CVV', validate: minLength})}
        />
      </div>
      <div className={styles.row}>
        <TextField fullWidth label="Card holder" variant="outlined"
                   error={!!errors.holder?.message}
                   helperText={errors.holder?.message}
                   {...register('holder')}
        />
      </div>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'number'} label="amount" variant="outlined"
                   error={!!errors.amount?.message}
                   helperText={errors.amount?.message}
                   {...register('amount', {required: 'Вкажіть баланс'})}
        />
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            label="currency"
            value={selectedCurrency}
            onChange={handleSelectChange}
          >
            {availableCurrency?.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
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

export default Index;