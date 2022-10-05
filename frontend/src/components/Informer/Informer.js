import React from 'react';
import {Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export const Informer = ({snack, setNotification}) => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setNotification({open: false})}
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
      <Alert onClose={setNotification} severity={snack.style} xs={{width: '100%'}}>
        {snack.message}
      </Alert>
    </Snackbar>
  );
};