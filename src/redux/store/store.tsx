import { configureStore } from '@reduxjs/toolkit';
import LoginSlice from '../Slices/LoginSlice';

const store = configureStore({
  reducer: {
    login: LoginSlice,
  },
});
export default store;
