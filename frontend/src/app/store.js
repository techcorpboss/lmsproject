// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Chúng ta sẽ thêm các reducers khác ở đây sau
  },
  devTools: process.env.NODE_ENV !== 'production', // Bật Redux DevTools khi ở môi trường dev
});