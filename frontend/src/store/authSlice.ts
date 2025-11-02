import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';
import { localStorageService } from '../services/localStorage.service';

const initialState: AuthState = {
  user: localStorageService.getCurrentUser(),
  isAuthenticated: !!localStorageService.getCurrentUser(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorageService.setCurrentUser(action.payload);
    },
    loginFailure: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorageService.setCurrentUser(null);
    },
    registerStart: (state) => {
      state.isLoading = true;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorageService.addUser(action.payload);
      localStorageService.setCurrentUser(action.payload);
    },
    registerFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export default authSlice.reducer;
