import {useCallback, useState} from 'react';
import {getCurrency} from '../api/mainApi';


export const useCurrency = () => {
  const [currency, setCurrency] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const getAvailableCurrency = useCallback(async () => {
    await getCurrency().then(res => {
      setCurrency(res);
      setSelectedCurrency(res[0]);
    });
  }, [setCurrency]);

  const handleSelectChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  return {currency, setCurrency, selectedCurrency, setSelectedCurrency, getAvailableCurrency, handleSelectChange}
}