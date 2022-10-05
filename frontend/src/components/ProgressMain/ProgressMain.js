import React from 'react';
import {LinearProgress} from '@mui/material';
import styles from './ProgressMain.module.scss'

export const ProgressMain = () => {
  return (
    <LinearProgress className={styles.progress} />
  );
};