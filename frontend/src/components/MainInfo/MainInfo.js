import React, {useContext} from 'react';
import {Avatar, Button, Paper} from '@mui/material';
import styles from './MainInfo.module.scss'
import {MainContext} from '../../context/MainContext';
import {baseUrl} from '../../url';
import {EmptyDataText, List, ListItem} from '../';

export const MainInfo = () => {
  const {logout, walletData, userData} = useContext(MainContext);
  let cashSum = 0;
  for (let i = 0; i < walletData.cash.length; i++) cashSum += +walletData.cash[i].amount;
  const isCash = walletData.cash.length !== 0 && cashSum !== 0;
  const isCards = walletData.cards.length !== 0;
  const isBalance = isCash || isCards;

  return (
    <Paper className={styles.container}>
      <div className={styles.row}>
        <div className={styles.user}>
          <Avatar alt={userData.username} src={baseUrl + userData.avatarUrl}/>
          <span className={styles.username}>{userData.username}</span>
        </div>
        <Button onClick={logout}>Вийти</Button>
      </div>
      {isBalance
        ?
        <>
          <hr style={{marginTop: '10px'}}/>
          <div className={styles.block}>
            <p>Загальний баланс</p>
            <List>{walletData.balance.map((elem, index) => elem.amount > 0 &&
              <ListItem key={index} card={elem}/>)}</List>
          </div>
        </>
        :
        <EmptyDataText name={'рахунками'}/>}
      {isCash &&
        <div className={`${styles.block} ${styles.inner}`}>
          <p>Готівка</p>
          <List>
            {walletData.cash.map((elem, index) => elem.amount > 0 &&
              <ListItem isCash={true} key={index} isButton={true} card={elem}/>)}
          </List>
        </div>}
      {isCards &&
        <div className={`${styles.block} ${styles.inner}`}>
          <p>Мої картки</p>
          <List>
            {walletData.cards.map(elem => <ListItem key={elem._id} isButton={true} card={elem}/>)}
          </List>
        </div>}
    </Paper>
  );
};