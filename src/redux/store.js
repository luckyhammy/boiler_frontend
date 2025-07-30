import { configureStore } from '@reduxjs/toolkit';
import sheetReducer from './sheet'; // Import the search reducer
import sheet1Reducer from './sheet1'; // Import the search reducer
import regionsReducer from './regions'; // Import the regions reducer

export const store = configureStore({
  reducer: {
    sheet: sheetReducer,
    sheet1: sheet1Reducer, // Include the search slice
    regions: regionsReducer, // Include the regions slice
  },
});

export default store;
