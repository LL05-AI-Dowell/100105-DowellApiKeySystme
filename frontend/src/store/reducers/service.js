import { createSlice } from '@reduxjs/toolkit';

export const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    service_data: null,
    sloading: false,
    serror: null,
  },
  reducers: {
    setService: (state, action) => {
      state.service_data = action.payload;
      state.sloading = false;
      state.serror = null;
    },
    setSLoading: (state) => {
      state.sloading = true;
      state.serror = null;
    },
    setSError: (state, action) => {
      state.sloading = false;
      state.serror = action.payload;
    },
  },
});

export const { setService, setSLoading, setSError } = serviceSlice.actions;

export default serviceSlice.reducer;
