import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  isError: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.message = action.payload.message;
      state.isError = action.payload.isError ?? false;
    },
    hideAlert: (state) => {
      state.message = null;
      state.isError = false;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
