import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const savedAuth = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('taskhub-auth')) || null
  : null;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: savedAuth ? { user: savedAuth.user, token: savedAuth.token } : { user: null, token: null },
  },
});

export default store;
