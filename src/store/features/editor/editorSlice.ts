import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, OverlayType, Slide } from "./types";
import { defaultSingleQuizSlide, defaultSlide, defaultMultipleQuizSlide } from "@/app/editor/constants";

const defaultOverlay = {
  isOpen: false,
  type: null,
  id: null
};

const initialState: EditorState = {
  slidesById: {
    [defaultSlide.id]: defaultSlide
  },
  slides: [defaultSlide.id],
  currentSlide: 0,
  bottomSheet: {},
  overlay: defaultOverlay
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
      setSlideBackgroundImage: (state, action: PayloadAction<{ id: string, image: string }>) => {
        const { id, image } = action.payload;
        state.slidesById[id].background.image = image;
      },
      setVideo: (state, action: PayloadAction<{ id: string, video: unknown }>) => {
        const { id, video } = action.payload;
        state.slidesById[id].video = video;
      },
      // ******* OVERLAY ACTIONS *******
      openOverlay: (state, action: PayloadAction<{ type: OverlayType, id: string; }>) => {
        state.overlay = {
          isOpen: true,
          type: action.payload.type,
          id: action.payload.id
        };
      },
      closeOverlay: (state) => {
        state.overlay = defaultOverlay;
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
  closeOverlay,
  openBottomSheet,
  removeSlide,
  openOverlay,
  setSlideBackgroundImage,
  setQuizType,
  setVideo,
  updateEditorContent,
  updateQuizSlide,
  updateFormSlide
} = editorSlice.actions;
export default editorSlice.reducer;