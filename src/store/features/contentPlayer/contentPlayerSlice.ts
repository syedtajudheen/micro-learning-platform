import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuizSlide, QuizType, Slide } from "../editor/types";

type ContentPlayerState = {
  currentSlide: string | null;
  slides: string[];
  slidesById: {
    [id: string]: Slide;
  };
  quizResults: {
    [id: string]: {
      type: QuizType;
      isCorrect: boolean;
      isPartiallyCorrect: boolean;
      selectedOptions: string[] | string | null;
    };
  };
};

const initialState: ContentPlayerState = {
  currentSlide: null,
  slides: [],
  slidesById: {},
  quizResults: {},

};

const contentPlayerSlice = createSlice
  ({
    name: 'contentPlayer',
    initialState,
    reducers: {

      setSlides: (state, action: PayloadAction<Slide[]>) => {
        state.currentSlide = action.payload.length > 0 ? action.payload[0].id : null;
        state.slides = action.payload.map((slide) => slide.id);
        state.slidesById = action.payload.reduce((acc: { [id: string]: Slide }, slide) => {
          acc[slide.id] = slide;
          return acc;
        }, {});
      },

      setCurrentSlide: (state, action: PayloadAction<string | null>) => {
        state.currentSlide = action.payload;
      },

      submitQuiz: (state, action: PayloadAction<{
        id: string,
        isCorrect: boolean,
        isPartiallyCorrect: boolean,
        selectedOptions: string[]
      }>) => {
        const { id, isCorrect, isPartiallyCorrect, selectedOptions } = action.payload;
        state.quizResults[id] = {
          type: (state.slidesById[id] as QuizSlide)?.quizType,
          isCorrect,
          isPartiallyCorrect,
          selectedOptions
        }
      }
    }
  });

export const {
  setCurrentSlide,
  setSlides,
  submitQuiz
} = contentPlayerSlice.actions;
export default contentPlayerSlice.reducer;
