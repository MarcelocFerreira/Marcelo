import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Court, CourtState } from '../types';
import { localStorageService } from '../services/localStorage.service';

const initialState: CourtState = {
  courts: localStorageService.getCourts(),
  isLoading: false,
  error: null,
};

const courtSlice = createSlice({
  name: 'court',
  initialState,
  reducers: {
    setCourts: (state, action: PayloadAction<Court[]>) => {
      state.courts = action.payload;
    },
    addCourt: (state, action: PayloadAction<Court>) => {
      state.courts.push(action.payload);
      localStorageService.addCourt(action.payload);
    },
    updateCourt: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Court> }>
    ) => {
      const index = state.courts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courts[index] = {
          ...state.courts[index],
          ...action.payload.data,
        };
        localStorageService.updateCourt(action.payload.id, action.payload.data);
      }
    },
    deleteCourt: (state, action: PayloadAction<string>) => {
      state.courts = state.courts.filter((c) => c.id !== action.payload);
      localStorageService.deleteCourt(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCourts,
  addCourt,
  updateCourt,
  deleteCourt,
  setLoading,
  setError,
} = courtSlice.actions;

export default courtSlice.reducer;
