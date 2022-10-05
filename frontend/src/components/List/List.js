import React from 'react';
import {Box} from '@mui/material';

export const List = ({children}) => {
  return (
    <Box>
      {children}
      <hr style={{marginTop: '10px'}}/>
    </Box>
  );
};