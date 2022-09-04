import React, {useContext, useEffect} from 'react';
import styles from './AddModal.module.scss'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {addCash, updateCard, updateCash} from '../../api/mainApi';
import {useForm} from 'react-hook-form';
import {MainContext} from '../../context/MainContext';

const AddModal = ({isModal, setIsModal, isEdit, formRef}) => {
  const {
    getUserData,
    currency,
    handleSelectChange,
    catchHandler,
    changeItemData
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
      if (changeItemData.isCash) {
        await updateCash(values.amount, changeItemData.currency).then(() => {
          getUserData();
          setIsModal(false);
        }).catch(error => {
          catchHandler(error);
        });
      } else {
        await updateCard(changeItemData.id, values.amount, values.name).then(() => {
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
  }, [isModal, changeItemData?.isOpen, formRef]);

  return (
    <div style={{display: isModal || changeItemData.isOpen ? 'flex' : 'none'}} className={styles.background}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className={styles.inner}>
        <div className={`${styles.row} ${styles.inputs}`}>
          <TextField required={true} type={'number'} fullWidth label="Сума" variant="outlined"
                     error={!!errors.amount}
                     helperText={errors.amount?.message}
                     {...register('amount', {
                       required: 'Вкажіть суму',
                       value: changeItemData?.amount,
                       min: {value: isEdit ? 0 : 1, message: `Мінімум ${isEdit ? 0 : 1}`}
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
          {isEdit && !changeItemData.isCash &&
            <TextField required={true} type={'text'} fullWidth label="Назва" variant="outlined"
                       error={!!errors.name}
                       helperText={errors.name?.message}
                       {...register('name', {
                         required: 'Вкажіть назву',
                         value: changeItemData?.name
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