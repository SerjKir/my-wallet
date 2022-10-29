import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './AddCard.module.scss';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {addCard} from '../../api/mainApi';
import {ExpireDatePicker} from '../';
import {MainContext} from '../../context/MainContext';
import {checkCard, toNumber, numbersOnly} from '../../helpers';
import {useTranslation} from "react-i18next";

const AddCard = ({setPage}) => {
  const {t} = useTranslation();
  const formRef = useRef(null);
  const {
    setWalletData,
    currency,
    handleSelectChange,
    catchHandler,
  } = useContext(MainContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {register, handleSubmit, formState: {errors, isValid},} = useForm({mode: 'onBlur',});

  const onClose = () => {
    handleSelectChange();
    setPage('Cards');
  }

  const onSubmit = async values => {
    await addCard({currency: currency.selectedCurrency, expDate: selectedDate, ...values})
      .then(res => {
        setWalletData(res.data);
        setPage('Cards');
      }).catch(error => catchHandler(error));
  };

  useEffect(() => {
    formRef.current.scrollIntoView({block: 'center', behavior: 'smooth'});
  }, [formRef]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" className={styles.title}>{t("addCard")}</Typography>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'text'} label={t("cardNumber")} variant="outlined"
                   onInput={event => numbersOnly(event)}
                   inputProps={{maxLength: 19}}
                   error={!!errors.number}
                   helperText={errors.number?.message}
                   {...register('number', {
                     validate: checkCard,
                     required: 'Вкажіть номер картки',
                     minLength: {value: 19, message: 'Потрібно 16 цифр'}
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
                     minLength: {value: 3, message: 'Вкажіть 3 цифри'}
                   })}
        />
      </div>
      <div className={styles.row}>
        <TextField fullWidth label={t("cardHolder")} variant="outlined"
                   error={!!errors.holder}
                   helperText={errors.holder?.message}
                   {...register('holder', {
                     minLength: {value: 3, message: 'Мінімум 3 символи'},
                     maxLength: {value: 16, message: 'Максимум 16 символів'}
                   })}
        />
      </div>
      <div className={styles.row}>
        <TextField required={true} fullWidth type={'number'} label={t("sum")} variant="outlined"
                   error={!!errors.amount}
                   helperText={errors.amount?.message}
                   onInput={event => toNumber(event)}
                   {...register('amount', {
                     required: 'Вкажіть суму',
                     min: {value: 0, message: 'Мінімальна сума 0'},
                     max: {value: 1000000, message: 'Максимальна сума 1 000 000'}
                   })}
        />
        <FormControl fullWidth>
          <InputLabel>{t("currency")}</InputLabel>
          <Select
            label={t("currency")}
            value={currency.selectedCurrency}
            onChange={handleSelectChange}
          >
            {currency.availableCurrency.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className={`${styles.row} ${styles.buttons}`}>
        <Button className={"medium-btn"} variant={'contained'} type={'submit'} color={'primary'}
                disabled={!isValid}>{t("add")}</Button>
        <Button className={"medium-btn"} variant={'contained'} color={'error'} onClick={onClose}>{t("cancel")}</Button>
      </div>
    </form>
  );
};

export default AddCard;