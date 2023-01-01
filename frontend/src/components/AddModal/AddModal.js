import React, {useContext, useEffect} from 'react';
import styles from './AddModal.module.scss'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {addCash, updateCard, updateCash} from '../../api/mainApi';
import {useForm} from 'react-hook-form';
import {MainContext} from '../../context/MainContext';
import {toNumber, noScrollToggle} from '../../helpers';
import {useTranslation} from "react-i18next";

const AddModal = ({isModal, setIsModal, isEdit}) => {
  const {t} = useTranslation();
  const {
    setWalletData,
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
        const res = await updateCash(values.amount, changeItemData.currency).catch(error => catchHandler(error));
        if (res) {
          setWalletData(res.data);
          handleClose();
        }
      } else {
        const res = await updateCard(changeItemData.id, values.amount, values.name)
          .catch(error => catchHandler(error));
        if (res) {
          setWalletData(res.data);
          handleClose();
        }
      }
    } else {
      const res = await addCash({currency: currency.selectedCurrency, amount: values.amount})
        .catch(error => catchHandler(error));
      if (res) {
        setWalletData(res.data);
        reset();
        handleClose();
      }
    }
  };

  useEffect(() => {
    noScrollToggle();
    return () => {
      noScrollToggle();
    }
  }, []);

  return (
    <div onClick={handleClose} style={{display: isModal || changeItemData.isOpen ? 'flex' : 'none'}}
         className={styles.main}>
      <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)} className={styles.inner}>
        <h5 className={styles.title}>{
          isEdit
            ? `${t("edit")} ${t(changeItemData.isCash ? "toCash" : "toCard")}`
            : t("addCash")}
        </h5>
        <div className={`${styles.row} ${styles.inputs}`}>
          <TextField required={true} type={'number'} fullWidth label={t("sum")} variant="outlined"
                     error={!!errors.amount}
                     helperText={errors.amount?.message}
                     onInput={event => toNumber(event)}
                     {...register('amount', {
                       required: 'Вкажіть суму',
                       value: changeItemData?.amount,
                       min: {value: isEdit ? 0 : 1, message: `Мінімум ${isEdit ? 0 : 1}`},
                       max: {value: 1000000, message: 'Максимальна сума 1 000 000'}
                     })}
          />
          <FormControl fullWidth>
            <InputLabel>{t("currency")}</InputLabel>
            <Select
              disabled={isEdit}
              label={t("currency")}
              value={isEdit ? changeItemData.currency : currency.selectedCurrency}
              onChange={handleSelectChange}
            >
              {currency.availableCurrency.map((elem, index) => <MenuItem key={index} value={elem}>{elem}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        {isEdit && !changeItemData.isCash &&
          <div className={styles.row}>
            <TextField required={true} type={'text'} fullWidth label={t("cardTitle")} variant="outlined"
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
          <Button className={"medium-btn"} type={'submit'} variant={'contained'} color={'primary'}
                  disabled={!isValid}>{t(isEdit ? "save" : "add")}</Button>
          <Button className={"medium-btn"} variant={'contained'} color={'error'}
                  onClick={handleClose}>{t("cancel")}</Button>
        </div>
      </form>
    </div>
  );
};

export default AddModal;
