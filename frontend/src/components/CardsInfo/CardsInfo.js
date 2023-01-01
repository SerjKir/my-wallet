import React, {useContext, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './CardsInfo.module.scss'
import {AddCard, AddModal, Cards} from '../';
import {removeCard, setSkin} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';
import {UserContext} from "../../context/UserContext";

const CardsInfo = () => {
  const {setWalletData, changeItemData, catchHandler} = useContext(MainContext);
  const {setUserData} = useContext(UserContext);
  const [page, setPage] = useState('Cards');
  const [isModal, setIsModal] = useState(false);
  const handleRemoveCard = async id => {
    const res = await removeCard(id).catch(error => catchHandler(error));
    if (res) setWalletData(res.data);
  };
  const handleSetSkin = async isSkin => {
    const res = await setSkin({isSkin}).catch(error => catchHandler(error));
    if (res) setUserData(prev => ({...prev, isSkin: res.data}));
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

export default CardsInfo;
