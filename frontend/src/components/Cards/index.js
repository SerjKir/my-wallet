import React, {useEffect, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './Cards.module.scss'
import AddCard from '../AddCard';
import CardsInfo from '../CardsInfo';
import ChangeModal from '../AddModal';
import {removeCard} from '../../api/mainApi';

const Index = ({getUserData, cards, changeItemData, setChangeItemData}) => {
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
        setIsChangeCashModal(true);
      } else {
        setIsChangeModal(true);
      }
      console.log(changeItemData)
    }
  }, [changeItemData])

  return (
    <Paper className={styles.container}>
      {page === 'CardsInfo' ? <CardsInfo removeCard={handleRemoveCard} cards={cards} setIsModal={setIsModal} setPage={setPage}/> : <AddCard setPage={setPage} getUserData={getUserData}/>}
      <ChangeModal getUserData={getUserData} isModal={isModal} setIsModal={setIsModal}/>
      <ChangeModal setChangeItemData={setChangeItemData} isEdit={true} isName={true} changeItemData={changeItemData} getUserData={getUserData} isModal={isChangeModal} setIsModal={setIsChangeModal}/>
      <ChangeModal setChangeItemData={setChangeItemData} isEdit={true} isCash={true} changeItemData={changeItemData} getUserData={getUserData} isModal={isChangeCashModal} setIsModal={setIsChangeCashModal}/>
    </Paper>
  );
};

export default Index;