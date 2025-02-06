import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Slide } from "./types";
import { defaultSingleQuizSlide, defaultSlide, defaultMultipleQuizSlide } from "@/app/editor/constants";

const initialState = {
  slidesById: {
    [defaultSlide.id]: defaultSlide
  },
  slides: [defaultSlide.id],
  currentSlide: null,
  bottomSheet: {}
};

const editorSlice = createSlice
  ({
    name: 'editor',
    initialState,
    reducers: {
      // ******* GENERIC SLIDE ACTIONS *******
      addSlide: (state, action: PayloadAction<Slide>) => {
        state.slidesById[action.payload.id] = action.payload;
        state.slides.push(action.payload.id);
      },
      removeSlide: (state, action: PayloadAction<string>) => {
        state.slides = state.slides.filter((slideId) => slideId !== action.payload);
        state.slidesById[action.payload] = null;
      },
      // ******* TIPTAP EDITOR *******
      updateEditorContent: (state, action: PayloadAction<{ id: string, content: string }>) => {
        const { id, content } = action.payload;
        state.slidesById[id].content = content;
      },
      // ******* QUIZ SLIDE *******
      setQuizType: (state, action: PayloadAction<{ id: string, type: string }>) => {
        const { id, type } = action.payload;
        state.slidesById[id] = (type === 'multiple') ? defaultMultipleQuizSlide(id) : defaultSingleQuizSlide(id);
      },
      updateQuizSlide: (state, action: PayloadAction<{ id: string, data: any }>) => {
        const { id, data } = action.payload;
        state.slidesById[id] = {
          ...state.slidesById[id],
          ...data
        };
      },
      // ******* FORM SLIDE *******
      updateFormSlide: (state, action: PayloadAction<{ id: string, data: any }>) => {
        const { id, data } = action.payload;
        state.slidesById[id] = {
          ...state.slidesById[id],
          ...data
        };
      },
      // ******* BOTTOM SHEET *******
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

export const {
  addSlide,
  closeBottomSheet,
  openBottomSheet,
  removeSlide,
  setQuizType,
  updateEditorContent,
  updateQuizSlide,
  updateFormSlide
} = editorSlice.actions;
export default editorSlice.reducer;