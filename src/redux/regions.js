import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null
};

const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    setRegions: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRegionsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRegionsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearRegions: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const { setRegions, setRegionsLoading, setRegionsError, clearRegions } = regionsSlice.actions;
export default regionsSlice.reducer; 