import React, {useContext, useEffect, useRef} from 'react';
import styles from './AddModal.module.scss'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {addCash, updateCard, updateCash} from '../../api/mainApi';
import {useForm} from 'react-hook-form';
import {MainContext} from '../../context/MainContext';

const AddModal = ({isModal, setIsModal, isEdit, data, setData, catchHandler}) => {
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

  const onClose = () => {
    isEdit ? setData(null) : setIsModal(false);
  };

  const onSubmit = async (values) => {
    if (isEdit) {
      if (data.isCash) {
        await updateCash(data.amount, data.currency).then(() => {
          getUserData();
          onClose();
        }).catch(error => {
          catchHandler(error);
        });
      } else {
        await updateCard(data.id, data.amount, data.name).then(() => {
          getUserData();
          onClose();
        }).catch(error => {
          catchHandler(error);
        });
      }
    } else {
      await addCash({currency: currency.selectedCurrency, ...values})
        .then(() => {
          getUserData();
          reset();
          onClose();
        }).catch(error => {
          catchHandler(error);
        });
    }
  };

  const ref = useRef(null);
  useEffect(() => {
    ref.current.scrollIntoView({block: "center", behavior: "smooth"});
  }, [isModal, data?.isOpen])

  return (
    <div style={{display: isModal || data.isOpen ? 'flex' : 'none'}} className={styles.background}>
      <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={styles.inner}>
        <div className={`${styles.row} ${styles.inputs}`}>
          {isEdit
            ? <TextField value={data.amount}
                         onChange={(e) => setData({
                           ...data,
                           amount: e.target.value
                         })}
                         required={true} type={'number'} fullWidth label="Сума"
                         variant="outlined"/>
            : <TextField required={true} type={'number'} fullWidth label="Сума" variant="outlined"
                         error={!!errors.amount?.message}
                         helperText={errors.amount?.message}
                         {...register('amount', {required: 'Вкажіть суму'})}
            />}
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
          {isEdit && !data.isCash && <TextField value={data.name}
                                                onChange={(e) =>
                                                  setData({...data, name: e.target.value})} fullWidth
                                                label="Назва"
                                                required={true}
                                                variant="outlined"/>}
        </div>
        <div className={styles.row}>
          <Button type={'submit'} variant={'contained'} color={'primary'} disabled={!isValid}>Зберегти</Button>
          <Button variant={'contained'} color={'error'} onClick={onClose}>Скасувати</Button>
        </div>
      </form>
    </div>
  );
};

export default AddModal;