import { createSlice } from '@reduxjs/toolkit';

const sheet1Slice = createSlice({
  name: 'sheet1',
  initialState: {
    data: [],
  },
  reducers: {
    setSheet1: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSheet1 } = sheet1Slice.actions;
export default sheet1Slice.reducer; 