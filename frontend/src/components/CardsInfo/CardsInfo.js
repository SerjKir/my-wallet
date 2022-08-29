import React, {useState} from 'react';
import styles from './CardsInfo.module.scss';
import {Button, Checkbox, FormControlLabel} from '@mui/material';
import Card from '../Card/Card';
import EmptyDataText from '../EmptyDataText/EmptyDataText';

const CardsInfo = ({setPage, setIsModal, removeCard, userData, setNotification}) => {
  const [isSkin, setIsSkin] = useState(false);
  const isCards = userData.cards.length !== 0;

  return (
    <>
      <div className={styles.row}>
        <Button variant={'contained'} onClick={() => setPage('AddCard')}>Додати картку</Button>
        <Button variant={'contained'} color={'success'} onClick={() => setIsModal(true)}>Додати готівку</Button>
      </div>
      {isCards
        ? <FormControlLabel className={styles.checkbox} control={<Checkbox checked={isSkin}/>} label="Патріотичний скін"
                            onChange={() => setIsSkin(!isSkin)}/>
        : <EmptyDataText name={'картками'}/>}
      <div className={styles.column}>
        {userData.cards.map(card => <Card setNotification={setNotification} isSkin={isSkin} removeCard={removeCard} key={card._id} card={card}/>)}
      </div>
    </>
  );
};

export default CardsInfo;