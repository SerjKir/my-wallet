import React from 'react';
import {Grid} from '@mui/material';
import {MainInfo, CardsInfo, ProgressMain} from '../../components';
import styles from './HomePage.module.scss';

const HomePage = ({userData}) => {
  if (!userData) return <ProgressMain/>;
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={6} className={styles.item}>
        <MainInfo/>
      </Grid>
      <Grid item xs={12} md={6} className={`${styles.item} `}>
        <CardsInfo/>
      </Grid>
    </Grid>
  );
};

export default HomePage;