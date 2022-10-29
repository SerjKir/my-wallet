import React, {useContext} from 'react';
import styles from './Cards.module.scss';
import {Button, Checkbox, FormControlLabel} from '@mui/material';
import {EmptyDataText, CardItem} from '../';
import {MainContext} from '../../context/MainContext';
import {useTranslation} from "react-i18next";

const Cards = ({setPage, setIsModal, removeCard, handleSetSkin}) => {
  const {t} = useTranslation();
  const {userData, walletData, setNotification} = useContext(MainContext);
  const isCards = walletData.cards.length !== 0;

  return (
    <>
      <div className={styles.row}>
        <Button variant={'contained'} className={"big-btn"}
                onClick={() => setPage('AddCard')}>{t("addCard")}</Button>
        <Button variant={'contained'} className={"big-btn"} color={'success'}
                onClick={() => setIsModal(true)}>{t("addCash")}</Button>
      </div>
      {isCards
        ? <>
          <FormControlLabel className={styles.checkbox} control={<Checkbox checked={userData.isSkin}/>}
                            label={t("patrioticSkin")}
                            onChange={() => handleSetSkin(!userData.isSkin)}/>
          <div className={styles.column}>
            {walletData.cards.map(card => <CardItem setNotification={setNotification} isSkin={userData.isSkin}
                                                    removeCard={removeCard} key={card._id} card={card}/>)}
          </div>
        </>
        : <EmptyDataText name={'картками'}/>}

    </>
  );
};

export default Cards;