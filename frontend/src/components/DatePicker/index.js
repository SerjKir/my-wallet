import React from 'react';
import {TextField} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import styles from './DatePicker.module.scss';

const Index = ({selectedDate, setSelectedDate}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} >
      <DatePicker
        inputFormat="MM/yy"
        views={['year', 'month']}
        label="exp date"
        minDate={new Date()}
        value={selectedDate}
        onChange={newValue => setSelectedDate(newValue)}
        renderInput={(params) => <TextField onKeyDown={(event) => event.preventDefault()} className={styles.input} {...params} helperText={null} />}
      />
    </LocalizationProvider>
  );
};

export default Index;