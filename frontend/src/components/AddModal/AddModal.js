import React, {useContext, useEffect} from 'react';
import styles from './AddModal.module.scss'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {addCash, updateCard, updateCash} from '../../api/mainApi';
import {useForm} from 'react-hook-form';
import {MainContext} from '../../context/MainContext';
import {noScroll} from '../../helpers';

const AddModal = ({isModal, setIsModal, isEdit}) => {
  const {
    getUserData,
    currency,
    handleSelectChange,
    catchHandler,
    changeItemData,
    setChangeItemData
  } = useContext(MainContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    mode: 'onChange',
  });

  const handleClose = () => {
    handleSelectChange();
    setIsModal && setIsModal(false);
    setChangeItemData(false);
  }

  const onSubmit = async values => {
    if (isEdit) {
      if (changeItemData.isCash) {
        await updateCash(values.amount, changeItemData.currency).then(() => {
          getUserData();
          handleClose();
        }).catch(error => {
          catchHandler(error);
        });
      } else {
        await updateCard(changeItemData.id, values.amount, values.name).then(() => {
          getUserData();
          handleClose();
        }).catch(error => {
          catchHandler(error);
        });
      }
    } else {
      await addCash({currency: currency.selectedCurrency, amount: values.amount})
        .then(() => {
          getUserData();
          reset();
          handleClose();
        }).catch(error => {
          catchHandler(error);
        });
    }
  };

  useEffect(() => {
    noScroll();
    return () => {
      noScroll();
    }
  }, []);

  return (
    <div onClick={handleClose} style={{display: isModal || changeItemData.isOpen ? 'flex' : 'none'}}
         className={styles.background}>
      <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)} className={styles.inner}>
        <h5 className={styles.title}>{
          isEdit
            ? `Редагувати ${changeItemData.isCash ? 'готівку' : 'картку'}`
            : 'Додати готівку'}
        </h5>
        <div className={`${styles.row} ${styles.inputs}`}>
          <TextField required={true} type={'number'} fullWidth label="Сума" variant="outlined"
                     error={!!errors.amount}
                     helperText={errors.amount?.message}
                     {...register('amount', {
                       required: 'Вкажіть суму',
                       value: changeItemData?.amount,
                       min: {value: isEdit ? 0 : 1, message: `Мінімум ${isEdit ? 0 : 1}`},
                       max: {value: 1000000, message: 'Максимальна сума 1 000 000'}
                     })}
          />
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              disabled={isEdit}
              label="Валюта"
              value={isEdit ? changeItemData.currency : currency.selectedCurrency}
              onChange={handleSelectChange}
            >
              {currency.availableCurrency.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        {isEdit && !changeItemData.isCash &&
          <div className={styles.row}>
            <TextField required={true} type={'text'} fullWidth label="Назва" variant="outlined"
                       error={!!errors.name}
                       helperText={errors.name?.message}
                       {...register('name', {
                         required: 'Вкажіть назву',
                         value: changeItemData?.name,
                         minLength: {value: 3, message: 'Максимум 3 символи'},
                         maxLength: {value: 16, message: 'Максимум 16 символів'}
                       })}
            />
          </div>}
        <div className={styles.row}>
          <Button type={'submit'} variant={'contained'} color={'primary'}
                  disabled={!isValid}>{isEdit ? 'Зберегти' : 'Додати'}</Button>
          <Button variant={'contained'} color={'error'} onClick={handleClose}>Скасувати</Button>
        </div>
      </form>
    </div>
  );
};

export default AddModal;