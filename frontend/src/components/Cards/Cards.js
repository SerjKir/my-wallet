import React, {useContext} from 'react';
import styles from './Cards.module.scss';
import {Button, Checkbox, FormControlLabel} from '@mui/material';
import {EmptyDataText, CardItem} from '../';
import {MainContext} from '../../context/MainContext';

export const Cards = ({setPage, setIsModal, removeCard, handleSetSkin}) => {
  const {userData, walletData, setNotification} = useContext(MainContext);
  const isCards = walletData.cards.length !== 0;

  return (
    <>
      <div className={styles.row}>
        <Button variant={'contained'} onClick={() => setPage('AddCard')}>Додати картку</Button>
        <Button variant={'contained'} color={'success'} onClick={() => setIsModal(true)}>Додати готівку</Button>
      </div>
      {isCards
        ? <>
          <FormControlLabel className={styles.checkbox} control={<Checkbox checked={userData.isSkin}/>}
                            label="Патріотичний скін"
                            onChange={() => handleSetSkin(!userData.isSkin)}/>
          <div className={styles.column}>
            {walletData.cards.map(card => <CardItem setNotification={setNotification} isSkin={userData.isSkin}
                                                    removeCard={removeCard} key={card._id} card={card}/>)}
          </div>
        </>
        : <EmptyDataText name={'картками'}/>}

    </>
  );
};