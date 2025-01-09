import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isLogged: false,
  userType: 1,
};
export const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    handleLogin: (state, action) => {
      state.isLogged = action.payload.isLogged;
    },
    setUserType: (state, action) => {
      state.userType = action.payload.userType;
    },
  },
});
export const { handleLogin, setUserType } = LoginSlice.actions;

export default LoginSlice.reducer;
