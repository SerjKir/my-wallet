import React, {useContext, useEffect} from 'react';
import styles from './AddModal.module.scss'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {addCash, updateCard, updateCash} from '../../api/mainApi';
import {useForm} from 'react-hook-form';
import {MainContext} from '../../context/MainContext';

const AddModal = ({isModal, setIsModal, isEdit, data, catchHandler, formRef}) => {
  const {
    getUserData,
    currency,
    handleSelectChange,
  } = useContext(MainContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    if (isEdit) {
      if (data.isCash) {
        await updateCash(values.amount, data.currency).then(() => {
          getUserData();
          setIsModal(false);
        }).catch(error => {
          catchHandler(error);
        });
      } else {
        await updateCard(data.id, values.amount, values.name).then(() => {
          getUserData();
          setIsModal(false);
        }).catch(error => {
          catchHandler(error);
        });
      }
    } else {
      await addCash({currency: currency.selectedCurrency, amount: values.amount})
        .then(() => {
          getUserData();
          reset();
          setIsModal(false);
        }).catch(error => {
          catchHandler(error);
        });
    }
  };

  useEffect(() => {
    formRef.current.scrollIntoView({block: 'center', behavior: 'smooth'});
  }, [isModal, data?.isOpen, formRef]);

  return (
    <div style={{display: isModal || data.isOpen ? 'flex' : 'none'}} className={styles.background}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className={styles.inner}>
        <div className={`${styles.row} ${styles.inputs}`}>
          <TextField required={true} type={'number'} fullWidth label="Сума" variant="outlined"
                     error={!!errors.amount?.message}
                     helperText={errors.amount?.message}
                     {...register('amount', {
                       required: 'Вкажіть суму',
                       value: data?.amount,
                       min: {value: isEdit ? 0 : 1, message: `Мінімум ${isEdit ? 0 : 1}`}
                     })}
          />
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              disabled={isEdit}
              label="Валюта"
              value={isEdit ? data.currency : currency.selectedCurrency}
              onChange={handleSelectChange}
            >
              {currency.availableCurrency.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
            </Select>
          </FormControl>
          {isEdit && !data.isCash &&
            <TextField required={true} type={'text'} fullWidth label="Назва" variant="outlined"
                       error={!!errors.name?.message}
                       helperText={errors.name?.message}
                       {...register('name', {
                         required: 'Вкажіть назву',
                         value: data?.name
                       })}
            />}
        </div>
        <div className={styles.row}>
          <Button type={'submit'} variant={'contained'} color={'primary'}
                  disabled={!isValid}>{isEdit ? 'Зберегти' : 'Додати'}</Button>
          <Button variant={'contained'} color={'error'} onClick={() => setIsModal(false)}>Скасувати</Button>
        </div>
      </form>
    </div>
  );
};

export default AddModal;