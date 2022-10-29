import React from 'react';
import styles from './EmptyDataText.module.scss';

const EmptyDataText = ({name}) => {
  return (
    <h3 className={styles.info}>
      Тут буде информація за Вашими {name}
    </h3>
  );
};

export default EmptyDataText;