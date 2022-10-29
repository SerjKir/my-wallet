import React, {useState} from 'react';
import styles from './CardItem.module.scss';
import {Button} from '@mui/material';
import {baseUrl} from '../../url';
import {toCardWithSpaces, toCardWithStars} from '../../helpers';
import {useTranslation} from "react-i18next";

const CardItem = ({card, removeCard, isSkin, setNotification}) => {
  const {t} = useTranslation();
  const [isNumberHidden, setIsNumberHidden] = useState(true);
  const handleCopy = () => {
    navigator.clipboard.writeText(card.number);
    setNotification({open: true, message: t("copiedCard"), style: 'success'});
  };
  const handleRemove = () => {
    if (window.confirm(t("confirmDeleteCard"))) removeCard(card._id);
  }
  const system = card.scheme;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isSkin ? styles.skin : ''}`}
           style={{background: isSkin && `url(${baseUrl}/uploads/patriot.jpg) no-repeat center center`}}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.clip}>{card.name}</span>
            <span className={styles.amount}>{card.amount.toLocaleString()} {card.currency}</span>
          </div>
          <div className={styles.column}>
            <span className={styles.logo}>
              {system === 'visa' || system === 'mastercard'
                ?
                <img alt={system} className={system === 'visa' ? styles.visa : ''}
                     src={`${baseUrl}/uploads/${system}.svg`}/>
                :
                system}
            </span>
            <span className={styles.type}>{card.type}</span>
          </div>
        </div>
        <div className={`${styles.row} ${styles.center}`}>
          <span className={styles.number}
                onClick={() => setIsNumberHidden(!isNumberHidden)}>{isNumberHidden ? toCardWithStars(card.number) : toCardWithSpaces(card.number)}</span>
          <span className={styles.copy} onClick={handleCopy}>copy</span>
        </div>
        <div className={styles.row}>
          <span className={styles.clip}>{card.holder}</span>
          <span>{card.expDate}</span>
        </div>
      </div>
      <Button variant={'contained'} color={'error'} className={'small-btn'}
              onClick={handleRemove}>{t("delete")}</Button>
    </div>
  );
};

export default CardItem;