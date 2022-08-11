import React, {useState} from 'react';
import styles from './Card.module.scss';
import {Button} from '@mui/material';
import {baseEnvUrl} from '../../consts';

const Index = ({card, removeCard}) => {
  const [isHidden, setIsHidden] = useState(true);
  const numberWithSpaces = card?.number.toString().replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
  const numberWithStars = card?.number.toString().replace(/^(\d{4})\d+(\d{4})$/, "$1 **** **** $2");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.name}>{card.name}</span>
            <span className={styles.amount}>{card.amount} {card.currency}</span>
          </div>
          <div className={styles.column}>
            <span className={styles.logo} >
              {card.scheme === 'visa' || card.scheme === 'mastercard'
              ?
              <img alt={card.scheme} src={`${baseEnvUrl}/uploads/${card.scheme}.svg`}/>
              :
              card.scheme}
            </span>
            <span>{card.type}</span>
          </div>
        </div>
        <div className={`${styles.row} ${styles.center}`}>
          <span className={styles.number} onClick={() => setIsHidden(!isHidden)}>{isHidden ? numberWithStars : numberWithSpaces}</span>
          <span className={styles.copy} onClick={() => navigator.clipboard.writeText(card.number)}>Copy</span>
        </div>
        <div className={styles.row}>
          <span className={styles.exp}>{card.expDate}</span>
        </div>
      </div>
      <Button variant={'contained'} color={'error'} onClick={() => removeCard(card._id)}>Видалити</Button>
    </div>
  );
};

export default Index;