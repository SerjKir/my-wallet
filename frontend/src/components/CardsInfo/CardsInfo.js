import React, {useContext, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './CardsInfo.module.scss'
import {AddCard, AddModal, Cards} from '../';
import {removeCard, setSkin} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';

export const CardsInfo = () => {
  const {setWalletData, setUserData, changeItemData, catchHandler} = useContext(MainContext);
  const [page, setPage] = useState('Cards');
  const [isModal, setIsModal] = useState(false);

  const handleRemoveCard = async id => {
    await removeCard(id).then(res => setWalletData(res.data)).catch(error => catchHandler(error));
  };

  const handleSetSkin = async isSkin => {
    await setSkin({isSkin}).then(res => setUserData(res.data)).catch(error => catchHandler(error));
  };

  return (
    <Paper className={styles.container}>
      {page === 'Cards'
        ? <Cards handleSetSkin={handleSetSkin} removeCard={handleRemoveCard}
                 setIsModal={setIsModal} setPage={setPage}/>
        : <AddCard setPage={setPage}/>}
      {isModal && <AddModal isModal={isModal} setIsModal={setIsModal}/>}
      {changeItemData?.isOpen && <AddModal isEdit={true}/>}
    </Paper>
  );
};