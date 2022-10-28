import React, {useContext} from 'react';
import {Button} from '@mui/material';
import styles from './ListItem.module.scss';
import {MainContext} from '../../context/MainContext';
import {useTranslation} from "react-i18next";

export const ListItem = ({card, isButton, isCash}) => {
  const {t} = useTranslation();
  const {setChangeItemData, changeItemData} = useContext(MainContext);
  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span>- {card.name} </span>
        <span className={styles.amount}>{card.amount.toLocaleString()} {card.currency}</span>
      </div>
      {isButton && <Button className={'small-btn'} variant={'contained'} onClick={() => setChangeItemData({
        id: !isCash && card._id,
        amount: card.amount,
        name: !isCash && card.name,
        currency: card.currency,
        isCash: isCash,
        isOpen: true,
        isButtonsDisabled: true,
      })} disabled={changeItemData?.isButtonsDisabled}>{t("edit")}</Button>}
    </div>
  );
};