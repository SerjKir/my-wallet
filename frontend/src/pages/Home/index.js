import React from 'react';
import {Grid} from '@mui/material';
import MainInfo from '../../components/MainInfo';
import Cards from '../../components/Cards';
import styles from './Home.module.scss';

const Index = () => {

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={5} className={styles.item}>
        <MainInfo />
      </Grid>
      <Grid item xs={12} md={7} className={`${styles.item} `}>
        <Cards/>
      </Grid>
    </Grid>
  );
};

export default Index;