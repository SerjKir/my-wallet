import React from 'react';
import {LinearProgress} from '@mui/material';
import styles from './ProgressMain.module.scss'

const ProgressMain = () => {
  return (
    <LinearProgress className={styles.progress} />
  );
};

export default ProgressMain;