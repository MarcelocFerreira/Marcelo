import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryState } from '../types';
import { localStorageService } from '../services/localStorage.service';

const initialState: CategoryState = {
  categories: localStorageService.getCategories(),
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
      localStorageService.addCategory(action.payload);
    },
    updateCategory: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Category> }>
    ) => {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...action.payload.data,
        };
        localStorageService.updateCategory(
          action.payload.id,
          action.payload.data
        );
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
      );
      localStorageService.deleteCategory(action.payload);
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
