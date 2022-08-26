import React from 'react';
import {Button} from '@mui/material';
import styles from './ListItem.module.scss';

const ListItem = ({card, isButton, setItemData, isCash}) => {
  return (
    <div className={styles.item}>
      <div><span>- {card.name} </span> <span
        className={styles.amount}>{card.amount.toLocaleString()} {card.currency}</span></div>
      {isButton && !isCash && <Button className={'small-btn'} variant={'contained'} onClick={() => setItemData({
        id: card._id, amount: card.amount, name: card.name, currency: card.currency, isCash: false, isOpen: true
      })}>Редагувати</Button>}
      {isButton && isCash && <Button className={'small-btn'} variant={'contained'} onClick={() => setItemData({
        amount: card.amount, currency: card.currency, isCash: true, isOpen: true
      })}>Редагувати</Button>}
    </div>
  );
};

export default ListItem;