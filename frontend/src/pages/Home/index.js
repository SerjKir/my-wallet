import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import Main from '../../components/MainInfo';
import Cards from '../../components/Cards';
import {getMe} from '../../api/mainApi';
import {AuthContext} from '../../context/AuthContext';

const Index = () => {
  const {ready, isAuthenticated} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [changeItemData, setChangeItemData] = useState(null);

  const getUserData = useCallback( async () => {
    const user = await getMe();
    setUserData(user);
  }, []);

  useEffect(() => {
    if (ready) {
      if (isAuthenticated && window.localStorage.getItem('token')) {
        getUserData().then();
      }
    }
  }, [ready, isAuthenticated, getUserData])

  return (
    <Grid container spacing={0}>
      <Grid item xs={5} display={'flex'} justifyContent={'center'}>
        <Main itemData={setChangeItemData} getUserData={getUserData} userData={userData}/>
      </Grid>
      <Grid item xs={7} display={'flex'} justifyContent={'center'}>
        <Cards setChangeItemData={setChangeItemData} changeItemData={changeItemData} cards={userData?.cards} getUserData={getUserData}/>
      </Grid>
    </Grid>
  );
};

export default Index;