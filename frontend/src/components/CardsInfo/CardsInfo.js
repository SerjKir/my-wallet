import React, {useContext, useRef, useState} from 'react';
import {Paper} from '@mui/material';
import styles from './CardsInfo.module.scss'
import AddCard from '../AddCard/AddCard';
import Cards from '../Cards/Cards';
import AddModal from '../AddModal/AddModal';
import {removeCard, setIsSkin} from '../../api/mainApi';
import {MainContext} from '../../context/MainContext';

const CardsInfo = () => {
  const {getUserData, changeItemData, setChangeItemData, catchHandler} = useContext(MainContext);
  const [page, setPage] = useState('Cards');
  const [isModal, setIsModal] = useState(false);
  const formRef = useRef(null);

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

  return (
    <Paper className={styles.container}>
      {page === 'Cards'
        ? <Cards handleSetIsSkin={handleSetIsSkin} removeCard={handleRemoveCard}
                 setIsModal={setIsModal} setPage={setPage}/>
        : <AddCard formRef={formRef} setPage={setPage}/>}
      {isModal && <AddModal formRef={formRef} isModal={isModal} setIsModal={setIsModal}/>}
      {changeItemData?.isOpen && <AddModal formRef={formRef} setIsModal={setChangeItemData} isEdit={true} />}
    </Paper>
  );
};

export default CardsInfo;