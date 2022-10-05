import React from 'react';
import styles from './EmptyDataText.module.scss';

export const EmptyDataText = ({name}) => {
  return (
    <h3 className={styles.info}>
      Тут буде информація за Вашими {name}
    </h3>
  );
};