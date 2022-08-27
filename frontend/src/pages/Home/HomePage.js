import React from 'react';
import {Grid} from '@mui/material';
import MainInfo from '../../components/MainInfo/MainInfo';
import Cards from '../../components/Cards/Cards';
import styles from './Home.module.scss';
import ProgressMain from '../../components/ProgressMain/ProgressMain';

const HomePage = ({userData, catchHandler, setNotification}) => {

  if (!userData) {
    return <ProgressMain/>
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={5} className={styles.item}>
        <MainInfo/>
      </Grid>
      <Grid item xs={12} md={7} className={`${styles.item} `}>
        <Cards catchHandler={catchHandler} setNotification={setNotification}/>
      </Grid>
    </Grid>
  );
};

export default HomePage;