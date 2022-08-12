import React from 'react';
import {Button} from '@mui/material';
import styles from './ListItem.module.scss';

const Index = ({card, isButton, itemData, isCash}) => {
  return (
    <div className={styles.item}>
      <div><span>- {card?.name} </span> <span>{card?.amount}</span> <span>{card?.currency}</span></div>
      {isButton && !isCash && <Button className={'small-btn'} variant={'contained'} onClick={() =>
        itemData({
          id: card?._id,
          amount: card?.amount,
          name: card?.name,
          currency: card?.currency,
          isCash: false
        })}>Редагувати</Button>}
      {isButton && isCash && <Button className={'small-btn'} variant={'contained'} onClick={() => itemData({
        amount: card?.amount,
        currency: card?.currency,
        isCash: true
      })}>Редагувати</Button>}
    </div>
  );
};

export default Index;