import React, {useContext, useEffect, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './Cards.module.scss'
import AddCard from '../AddCard/AddCard';
import CardsInfo from '../CardsInfo/CardsInfo';
import AddModal from '../AddModal/AddModal';
import {removeCard, setIsSkin} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';

const Cards = ({setNotification, catchHandler}) => {
  const {getUserData, changeItemData, userData} = useContext(MainContext);
  const [page, setPage] = useState('CardsInfo');
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState(null);

  const handleRemoveCard = async (id) => {
    await removeCard(id).then(() => {
      getUserData();
    }).catch(error => {
      catchHandler(error);
    });
  }

  const handleSetIsSkin = async (isSkin) => {
    await setIsSkin({isSkin}).then(() => getUserData()).catch(error => {
      catchHandler(error);
    });
  };

  useEffect(() => {
    changeItemData && setData(changeItemData);
  }, [changeItemData]);


  return (
    <Paper className={styles.container}>
      {page === 'CardsInfo'
        ? <CardsInfo handleSetIsSkin={handleSetIsSkin} setNotification={setNotification} userData={userData} removeCard={handleRemoveCard}
                     setIsModal={setIsModal} setPage={setPage}/>
        : <AddCard catchHandler={catchHandler} setPage={setPage}/>}
      {isModal && <AddModal catchHandler={catchHandler} isModal={isModal} setIsModal={setIsModal}/>}
      {data?.isOpen && <AddModal catchHandler={catchHandler} data={data} setData={setData} isEdit={true} />}
    </Paper>
  );
};

export default Cards;