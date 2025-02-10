import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuizSlide, QuizType, Slide } from "../editor/types";

export type SlideEngagement = {
  isCompleted: boolean;   // True if watched 90%+ (for LMS tracking)
  viewCount: number;      // Number of times the slide has been viewed
  totalWatchTime: number; // Total time spent on this slide (in seconds)
  lastWatchedAt: string | null; // ISO timestamp of last interaction
  progress: number;       // % watched (0 to 100)
  engagementScore: number; // Custom metric (e.g., time + interactions)

  // Playback-related tracking
  watchSections: number[][]; // Array of watched time segments [[start, end], ...]
  captionsEnabled: boolean;  // Whether captions were enabled
  lastKnownPosition: number; // Last watched timestamp in the media
};

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
  slideEngagement: {
    [slideId: string]: SlideEngagement
  }
};

const initialState: ContentPlayerState = {
  currentSlide: null,
  slides: [],
  slidesById: {},
  quizResults: {},
  slideEngagement: {}
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
      },

      setSlideEngagement: (state, action: PayloadAction<{
        slideId: string,
        isCompleted: boolean,
        viewCount?: number,
        totalWatchTime?: number,
        lastWatchedAt?: string | null,
        progress?: number,
        engagementScore?: number,
        watchSections?: number[][],
        captionsEnabled?: boolean,
        lastKnownPosition?: number
      }>) => {
        const { slideId, ...restProps } = action.payload;
        state.slideEngagement[slideId] = {
          ...(state.slideEngagement?.[slideId] || {}),
          ...(restProps as SlideEngagement)
        }
      }
    }
  });

export const {
  setCurrentSlide,
  setSlides,
  setSlideEngagement,
  submitQuiz
} = contentPlayerSlice.actions;
export default contentPlayerSlice.reducer;
