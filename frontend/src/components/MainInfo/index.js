import React, {useContext} from 'react';
import {Avatar, Button, Paper} from '@mui/material';
import styles from './MainInfo.module.scss'
import List from '../List';
import {AuthContext} from '../../context/AuthContext';
import ListItem from '../ListItem';
import {baseEnvUrl} from '../../consts';

const Index = ({userData, getUserData, itemData}) => {
  const {isAuthenticated, logout} = useContext(AuthContext);

  return (
    <Paper className={styles.container}>
      <div className={styles.row}>
        <div className={styles.user}><Avatar alt={userData?.name} src={baseEnvUrl + userData?.avatarUrl} /><span className={styles.userName}>{userData?.name}</span></div>
        {isAuthenticated && <Button onClick={logout} >Выйти</Button>}
      </div>
      <div className={styles.block}>
        <p>Баланс</p>
        <List>
          {userData?.balance?.map((elem, index) => <ListItem key={index} isButton={false} card={elem}/>)}
        </List>
      </div>
      <div className={styles.block}>
        <p>Готівка</p>
        <List>
          {userData?.cash.map((elem, index) => <ListItem isCash={true} itemData={itemData} key={index} isButton={true} card={elem}/>)}
        </List>
      </div>
      <div className={styles.block}>
        <p>Мої картки</p>
        {userData?.cards && <List>{userData?.cards?.map(elem => <ListItem itemData={itemData} key={elem._id} isButton={true} card={elem} />)}</List>}
      </div>
    </Paper>
  );
};

export default Index;