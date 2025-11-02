import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, PlayerState } from '../types';
import { localStorageService } from '../services/localStorage.service';

const initialState: PlayerState = {
  players: localStorageService.getPlayers(),
  isLoading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
      localStorageService.addPlayer(action.payload);
    },
    updatePlayer: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Player> }>
    ) => {
      const index = state.players.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.players[index] = {
          ...state.players[index],
          ...action.payload.data,
        };
        localStorageService.updatePlayer(action.payload.id, action.payload.data);
      }
    },
    deletePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter((p) => p.id !== action.payload);
      localStorageService.deletePlayer(action.payload);
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
  setPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
  setLoading,
  setError,
} = playerSlice.actions;

export default playerSlice.reducer;
