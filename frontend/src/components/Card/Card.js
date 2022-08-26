import React, {useState} from 'react';
import styles from './Card.module.scss';
import {Button} from '@mui/material';
import {baseUrl} from '../../consts';

const Card = ({card, removeCard, isSkin, setNotification}) => {
  const [isNumberHidden, setIsNumberHidden] = useState(true);
  const handleCopy = () => {
    navigator.clipboard.writeText(card.number);
    setNotification({open: true, message: 'Номер картки скопійовано!', style: 'success'});

  };
  const handleRemove = () => {
    if (window.confirm("Ви точно хочете видалити картку?")) {
      removeCard(card._id);
    }
  }
  const numberWithSpaces = card.number.toString().replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
  const numberWithStars = card.number.toString().replace(/^(\d{4})\d+(\d{4})$/, '$1 **** **** $2');
  const system = card.scheme;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isSkin ? styles.skin : ''}`} style={{background: isSkin && `url(${baseUrl}/uploads/patriot.jpg) no-repeat center center`}}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.name}>{card.name}</span>
            <span className={styles.amount}>{card.amount.toLocaleString()} {card.currency}</span>
          </div>
          <div className={styles.column}>
            <span className={styles.logo}>
              {system === 'visa' || system === 'mastercard'
                ?
                <img alt={system} className={system === 'visa' ? styles.visa : ''} src={`${baseUrl}/uploads/${system}.svg`}/>
                :
                system}
            </span>
            <span className={styles.type}>{card.type}</span>
          </div>
        </div>
        <div className={`${styles.row} ${styles.center}`}>
          <span className={styles.number}
                onClick={() => setIsNumberHidden(!isNumberHidden)}>{isNumberHidden ? numberWithStars : numberWithSpaces}</span>
          <span className={styles.copy} onClick={handleCopy}>copy</span>
        </div>
        <div className={styles.row}>
          <span className={styles.exp}>{card.expDate}</span>
        </div>
      </div>
      <Button variant={'contained'} color={'error'} className={'small-btn'}
              onClick={handleRemove}>Видалити</Button>
    </div>
  );
};

export default Card;