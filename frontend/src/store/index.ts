import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tournamentReducer from './tournamentSlice';
import playerReducer from './playerSlice';
import courtReducer from './courtSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tournament: tournamentReducer,
    player: playerReducer,
    court: courtReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths for serialization checks (for Date objects)
        ignoredActions: ['tournament/addTournament', 'tournament/updateTournament'],
        ignoredPaths: ['tournament.tournaments', 'tournament.selectedTournament'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
