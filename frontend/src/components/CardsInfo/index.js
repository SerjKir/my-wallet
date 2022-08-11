import React from 'react';
import styles from './CardsInfo.module.scss';
import {Button} from '@mui/material';
import Card from '../Card';

const Index = ({setPage, setIsModal, cards, removeCard}) => {
  return (
    <div>
      <div className={styles.row}>
        <Button variant={'contained'} onClick={() => setPage('AddCard')}>Додати картку</Button>
        <Button variant={'contained'} color={'success'} onClick={() => setIsModal(true)}>Додати готівку</Button>
      </div>
      {cards?.map(card => <Card removeCard={removeCard} key={card._id} card={card}/>)}
    </div>
  );
};

export default Index;