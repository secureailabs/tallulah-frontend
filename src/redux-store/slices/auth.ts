import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: '',
    refreshToken: '',
    tokenType: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.tokenType = action.payload.token_type;
    },
    clearToken: (state) => {
        state.accessToken = '';
        state.refreshToken = '';
        state.tokenType = '';
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
