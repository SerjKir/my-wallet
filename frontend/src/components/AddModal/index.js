import React, {useContext} from 'react';
import styles from './AddModal.module.scss'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {addCash, updateCard, updateCash} from '../../api/mainApi';
import {useForm} from 'react-hook-form';
import {MainContext} from '../../context/MainContext';

const Index = ({isModal, setIsModal, isName, isEdit, isCash}) => {
  const {getUserData, changeItemData, setChangeItemData, availableCurrency, selectedCurrency, handleSelectChange} = useContext(MainContext);

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
      if (isCash) {
        await updateCash(changeItemData.amount, changeItemData.currency).then(res => {
          getUserData();
          setIsModal(false);
        }).catch(err => console.log(err))
      } else {
        await updateCard(changeItemData.id, changeItemData.amount, changeItemData.name).then(res => {
          getUserData();
          setIsModal(false);
        }).catch(err => console.log(err));
      }
    } else {
      await addCash({currency: selectedCurrency, ...values})
        .then(data => {
          getUserData();
          reset();
          setIsModal(false)
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div style={{display: isModal ? 'flex' : 'none'}} className={styles.background}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.inner}>
        <div className={`${styles.row} ${styles.inputs}`}>
          {isEdit ? <TextField value={changeItemData?.amount}
                               onChange={(e) => setChangeItemData({...changeItemData, amount: e.target.value})}
                               required={true} type={'number'} fullWidth label="amount" variant="outlined"
          /> : <TextField required={true} type={'number'} fullWidth label="amount" variant="outlined"
                          error={!!errors.amount?.message}
                          helperText={errors.amount?.message}
                          {...register('amount', {required: 'Вкажіть кілкість', min: 1})}
          />}
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              disabled={isEdit}
              label="currency"
              value={isEdit && changeItemData?.currency ? changeItemData?.currency : selectedCurrency}
              onChange={handleSelectChange}
            >
              {availableCurrency?.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
            </Select>
          </FormControl>
          {isName && <TextField value={changeItemData?.name}
                                onChange={(e) =>
                                  setChangeItemData({...changeItemData, name: e.target.value})} fullWidth label="name"
                                variant="outlined"/>}
        </div>
        <div className={styles.row}>
          <Button type={'submit'} variant={'contained'} color={'primary'} disabled={!isValid}>Зберегти</Button>
          <Button variant={'contained'} color={'error'} onClick={() => setIsModal(false)}>Скасувати</Button>
        </div>
      </form>
    </div>
  );
};

export default Index;