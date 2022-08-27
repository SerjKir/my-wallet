import React from 'react';
import {Box} from '@mui/material';

const List = ({children}) => {
  return (
    <Box>
      {children}
      <hr style={{marginTop: '10px'}}/>
    </Box>
  );
};

export default List;