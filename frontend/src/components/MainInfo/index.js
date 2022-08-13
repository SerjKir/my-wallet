import React, {useContext} from 'react';
import {Avatar, Button, Paper} from '@mui/material';
import styles from './MainInfo.module.scss'
import List from '../List';
import {MainContext} from '../../context/MainContext';
import ListItem from '../ListItem';
import {baseUrl} from '../../consts';

const Index = () => {
  const {isAuthenticated, logout, userData, setChangeItemData} = useContext(MainContext);

  return (
    <Paper className={styles.container}>
      <div className={styles.row}>
        <div className={styles.user}><Avatar alt={userData?.name} src={baseUrl + userData?.avatarUrl} /><span className={styles.userName}>{userData?.name}</span></div>
        {isAuthenticated && <Button onClick={logout} >Вийти</Button>}
      </div>
      <hr style={{marginTop: '8px'}}/>
      <div className={styles.block}>
        <p>Загальний баланс</p>
        <List>
          {userData?.balance?.map((elem, index) => elem?.amount > 0 && <ListItem key={index} isButton={false} card={elem}/>)}
        </List>
      </div>
      <div className={`${styles.block} ${styles.inner}`}>
        <p>Готівка</p>
        <List>
          {userData?.cash.map((elem, index) => elem?.amount > 0 && <ListItem isCash={true} itemData={setChangeItemData} key={index} isButton={true} card={elem}/>)}
        </List>
      </div>
      <div className={`${styles.block} ${styles.inner}`}>
        <p>Мої картки</p>
        <List>
          {userData?.cards?.map(elem => <ListItem itemData={setChangeItemData} key={elem._id} isButton={true} card={elem} />)}
        </List>
      </div>
    </Paper>
  );
};

export default Index;