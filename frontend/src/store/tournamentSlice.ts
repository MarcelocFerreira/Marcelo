import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tournament, TournamentState } from '../types';
import { localStorageService } from '../services/localStorage.service';

const initialState: TournamentState = {
  tournaments: localStorageService.getTournaments(),
  selectedTournament: null,
  isLoading: false,
  error: null,
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setTournaments: (state, action: PayloadAction<Tournament[]>) => {
      state.tournaments = action.payload;
    },
    addTournament: (state, action: PayloadAction<Tournament>) => {
      state.tournaments.push(action.payload);
      localStorageService.addTournament(action.payload);
    },
    updateTournament: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Tournament> }>
    ) => {
      const index = state.tournaments.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.tournaments[index] = {
          ...state.tournaments[index],
          ...action.payload.data,
        };
        localStorageService.updateTournament(
          action.payload.id,
          action.payload.data
        );
      }
    },
    deleteTournament: (state, action: PayloadAction<string>) => {
      state.tournaments = state.tournaments.filter(
        (t) => t.id !== action.payload
      );
      localStorageService.deleteTournament(action.payload);
      if (state.selectedTournament?.id === action.payload) {
        state.selectedTournament = null;
      }
    },
    selectTournament: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.selectedTournament =
          state.tournaments.find((t) => t.id === action.payload) || null;
      } else {
        state.selectedTournament = null;
      }
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
  setTournaments,
  addTournament,
  updateTournament,
  deleteTournament,
  selectTournament,
  setLoading,
  setError,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
