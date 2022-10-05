import React from 'react';
import {TextField} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import styles from './ExpireDatePicker.module.scss';

export const ExpireDatePicker = ({selectedDate, setSelectedDate}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat="MM/yy"
        views={['year', 'month']}
        label="Термін дії"
        minDate={new Date()}
        value={selectedDate}
        onChange={newValue => setSelectedDate(newValue)}
        renderInput={(params) => <TextField onKeyDown={(event) => event.preventDefault()}
                                            className={styles.input} {...params} helperText={null}/>}
      />
    </LocalizationProvider>
  );
};