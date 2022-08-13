import React, {useContext, useEffect, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './Cards.module.scss'
import AddCard from '../AddCard';
import CardsInfo from '../CardsInfo';
import ChangeModal from '../AddModal';
import {removeCard} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';

const Index = () => {
  const {getUserData, changeItemData} = useContext(MainContext);
  const [page, setPage] = useState('CardsInfo');
  const [isModal, setIsModal] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [isChangeCashModal, setIsChangeCashModal] = useState(false);

  const handleRemoveCard = async (id) => {
    await removeCard(id).then(res => {
      getUserData();
    }).catch(err => console.log(err));
  }

  useEffect(() => {
    if (changeItemData) {
      if (changeItemData.isCash) {
        setIsModal(false);
        setIsChangeModal(false);
        setIsChangeCashModal(true);
      } else {
        setIsModal(false);
        setIsChangeCashModal(false);
        setIsChangeModal(true);
      }
    }
  }, [changeItemData])

  return (
    <Paper className={styles.container}>
      {page === 'CardsInfo' ? <CardsInfo removeCard={handleRemoveCard} setIsModal={setIsModal} setPage={setPage}/> : <AddCard setPage={setPage}/>}
      <ChangeModal isModal={isModal} setIsModal={setIsModal}/>
      <ChangeModal isEdit={true} isName={true} isModal={isChangeModal} setIsModal={setIsChangeModal}/>
      <ChangeModal isEdit={true} isCash={true} isModal={isChangeCashModal} setIsModal={setIsChangeCashModal}/>
    </Paper>
  );
};

export default Index;