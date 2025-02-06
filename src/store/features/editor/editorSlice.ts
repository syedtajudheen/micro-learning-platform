import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  slides: [],
  currentSlide: null,
  bottomSheet: {}
};

const editorSlice = createSlice
  ({
    name: 'editor',
    initialState,
    reducers: {
      openBottomSheet: (state, action: PayloadAction<string>) => {
        state.bottomSheet = {
          ...state.bottomSheet,
          [action.payload]: true
        };
      },
      closeBottomSheet: (state, action: PayloadAction<string>) => {
        state.bottomSheet = {
          ...state.bottomSheet,
          [action.payload]: false
        };
      }
    }
  });

export const { openBottomSheet, closeBottomSheet } = editorSlice.actions;
export default editorSlice.reducer;