import React, {useContext} from 'react';
import {Avatar, Button, Paper} from '@mui/material';
import styles from './MainInfo.module.scss'
import List from '../List';
import {AuthContext} from '../../context/AuthContext';
import ListItem from '../ListItem';
import {baseEnvUrl} from '../../consts';

const Index = ({userData, itemData}) => {
  const {isAuthenticated, logout} = useContext(AuthContext);

  return (
    <Paper className={styles.container}>
      <div className={styles.row}>
        <div className={styles.user}><Avatar alt={userData?.name} src={baseEnvUrl + userData?.avatarUrl} /><span className={styles.userName}>{userData?.name}</span></div>
        {isAuthenticated && <Button onClick={logout} >Вийти</Button>}
      </div>
      <hr style={{marginTop: '10px'}}/>
      <div className={styles.block}>
        <p>Загальний баланс</p>
        <List>
          {userData?.balance?.map((elem, index) => elem?.amount > 0 && <ListItem key={index} isButton={false} card={elem}/>)}
        </List>
      </div>
      <div className={`${styles.block} ${styles.inner}`}>
        <p>Готівка</p>
        <List>
          {userData?.cash.map((elem, index) => elem?.amount > 0 && <ListItem isCash={true} itemData={itemData} key={index} isButton={true} card={elem}/>)}
        </List>
      </div>
      <div className={`${styles.block} ${styles.inner}`}>
        <p>Мої картки</p>
        <List>
          {userData?.cards?.map(elem => <ListItem itemData={itemData} key={elem._id} isButton={true} card={elem} />)}
        </List>
      </div>
    </Paper>
  );
};

export default Index;