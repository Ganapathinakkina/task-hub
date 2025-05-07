import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import alertReducer from './slices/alertSlice';

const savedAuth = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('taskhub-auth')) || null
  : null;

const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
  },
  preloadedState: {
    auth: savedAuth ? { user: savedAuth.user, token: savedAuth.token } : { user: null, token: null },
  },
});

export default store;
