import React, {useContext} from 'react';
import {Button} from '@mui/material';
import styles from './ListItem.module.scss';
import {MainContext} from '../../context/MainContext';

const ListItem = ({card, isButton, isCash}) => {
  const {setChangeItemData, changeItemData} = useContext(MainContext);
  return (
    <div className={styles.item}>
      <div><span>- {card.name} </span> <span
        className={styles.amount}>{card.amount.toLocaleString()} {card.currency}</span></div>
      {isButton && !isCash && <Button className={'small-btn'} variant={'contained'} onClick={() => setChangeItemData({
        id: card._id, amount: card.amount, name: card.name, currency: card.currency, isCash: false, isOpen: true
      })} disabled={changeItemData?.isOpen}>Редагувати</Button>}
      {isButton && isCash && <Button className={'small-btn'} variant={'contained'} onClick={() => setChangeItemData({
        amount: card.amount, currency: card.currency, isCash: true, isOpen: true
      })} disabled={changeItemData?.isOpen}>Редагувати</Button>}
    </div>
  );
};

export default ListItem;