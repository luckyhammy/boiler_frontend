import { createSlice } from '@reduxjs/toolkit';

const sheetSlice = createSlice({
  name: 'sheet',
  initialState: {
    data: [],
  },
  reducers: {
    setSheet: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSheet } = sheetSlice.actions;
export default sheetSlice.reducer; 