import React, {useContext, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './CardsInfo.module.scss'
import {AddCard, AddModal, Cards} from '../';
import {removeCard, setIsSkin} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';

export const CardsInfo = () => {
  const {getUserData, changeItemData, catchHandler} = useContext(MainContext);
  const [page, setPage] = useState('Cards');
  const [isModal, setIsModal] = useState(false);

  const handleRemoveCard = async id => {
    await removeCard(id).then(() => {
      getUserData();
    }).catch(error => {
      catchHandler(error);
    });
  }

  const handleSetIsSkin = async isSkin => {
    await setIsSkin({isSkin}).then(() => getUserData()).catch(error => {
      catchHandler(error);
    });
  };

  return (
    <Paper className={styles.container}>
      {page === 'Cards'
        ? <Cards handleSetIsSkin={handleSetIsSkin} removeCard={handleRemoveCard}
                 setIsModal={setIsModal} setPage={setPage}/>
        : <AddCard setPage={setPage}/>}
      {isModal && <AddModal isModal={isModal} setIsModal={setIsModal}/>}
      {changeItemData?.isOpen && <AddModal isEdit={true} />}
    </Paper>
  );
};