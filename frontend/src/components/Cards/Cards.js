import React, {useContext, useEffect, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './Cards.module.scss'
import AddCard from '../AddCard/AddCard';
import CardsInfo from '../CardsInfo/CardsInfo';
import ChangeModal from '../AddModal/AddModal';
import {removeCard} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';

const Cards = () => {
  const {getUserData, changeItemData, logout, setNotification, userData} = useContext(MainContext);
  const [page, setPage] = useState('CardsInfo');
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState(null);
  const handleRemoveCard = async (id) => {
    await removeCard(id).then(() => {
      getUserData();
    }).catch(error => {
      error.response.status === 401 && logout();
      setNotification({open: true, message: error.response.data.message, style: 'error'});
    });
  }

  useEffect(() => {
    changeItemData && setData(changeItemData);
  }, [changeItemData]);


  return (
    <Paper className={styles.container}>
      {page === 'CardsInfo'
        ? <CardsInfo setNotification={setNotification} userData={userData} removeCard={handleRemoveCard}
                     setIsModal={setIsModal} setPage={setPage}/>
        : <AddCard setPage={setPage}/>}
      {isModal && <ChangeModal isModal={isModal} setIsModal={setIsModal}/>}
      {data?.isOpen && <ChangeModal data={data} setData={setData} isEdit={true} />}
    </Paper>
  );
};

export default Cards;