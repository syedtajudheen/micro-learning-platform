import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AudioSlide, CardSlide, EditorState, MediaFile, OverlayType, Slide, VideoSlide } from "./types";
import { defaultSingleQuizSlide, defaultSlide, defaultMultipleQuizSlide } from "@/app/editor/constants";
import { addSlide, deleteSlide, fetchSlides, updateSlide } from "./editorThunk";

const defaultOverlay = {
  isOpen: false,
  type: null,
  id: null
};

const initialState: EditorState = {
  courseId: null,
  slidesById: {},
  slides: [],
  currentSlide: 0,
  bottomSheet: {},
  overlay: defaultOverlay,
  isSlidesLoading: false,
  isSlidesSaving: false,
  lastUpdatedAt: null,
  error: null
};

const editorSlice = createSlice
  ({
    name: 'editor',
    initialState,
    reducers: {
      // ******* GENERIC SLIDE ACTIONS *******
      // addSlide: (state, action: PayloadAction<Slide>) => {
      //   state.slidesById[action.payload.id] = action.payload;
      //   state.slides.push(action.payload.id);
      // },
      setCourseId: (state, action: PayloadAction<string>) => {
        state.courseId = action.payload;
      },
      setSlideBackgroundImage: (state, action: PayloadAction<{ id: string, image: string }>) => {
        const { id, image } = action.payload;
        (state.slidesById[id] as Slide).background.image = image;
      },
      setAudio: (state, action: PayloadAction<{ id: string, audio: MediaFile }>) => {
        const { id, audio } = action.payload;
        (state.slidesById[id] as AudioSlide).audio = audio;
      },
      setVideo: (state, action: PayloadAction<{ id: string, video: MediaFile }>) => {
        const { id, video } = action.payload;
        (state.slidesById[id] as VideoSlide).video = video;
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
        (state.slidesById[id] as CardSlide).content = content;
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
      },
      // ******** SYNC SLIDES TO SERVER ********
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchSlides.pending, (state) => {
          state.isSlidesLoading = true;
          state.error = null;
          state.lastUpdatedAt = null;
        })
        .addCase(fetchSlides.fulfilled, (state, action: PayloadAction<any>) => {
          state.isSlidesLoading = false;

          if (action.payload.length === 0) {
            state.slidesById = {
              [defaultSlide.id]: defaultSlide
            };
            state.slides = [defaultSlide.id];
          } else {
            state.slides = action.payload.map((slide) => slide.id);
            state.slidesById = action.payload.reduce((acc, slide) => {
              acc[slide.id] = slide;
              return acc;
            }, {});
            state.lastUpdatedAt = Math.max(state?.lastUpdatedAt || 0, ...action.payload.map((s) => new Date(s.updated_at).getTime()))
          }
        })
        .addCase(fetchSlides.rejected, (state, action) => {
          state.isSlidesLoading = false;
          state.error = action.payload as string;
        });

      // ******** ADD SLIDE ********
      builder
        // 1️⃣ Optimistically add slide
        .addCase(addSlide.pending, (state, action) => {
          const slide = action.meta.arg;
          state.slidesById[slide.id] = slide;
          state.slides.push(slide.id);
          state.isSlidesSaving = true;
          state.lastUpdatedAt = Math.max(...state.slides.map((slideId) => new Date(state.slidesById[slideId].updated_at).getTime()));
          state.error = null;
        })
        .addCase(addSlide.fulfilled, (state, action: PayloadAction<any>) => {
          state.isSlidesSaving = false;

          if (action.payload.length === 0) {
            state.slidesById[action?.payload?.id] = action.payload;
          }
          state.lastUpdatedAt = Math.max(state?.lastUpdatedAt || 0, new Date(action.payload.updated_at).getTime());
          state.error = null;
        })
        .addCase(addSlide.rejected, (state, action) => {
          state.isSlidesSaving = false;
          state.error = action.payload as string;
        });

      // ******** UPDATE SLIDE ********
      builder
        .addCase(updateSlide.pending, (state, action) => {
          state.isSlidesSaving = true;
          state.error = null;
        })
        .addCase(updateSlide.fulfilled, (state, action: PayloadAction<any>) => {
          state.isSlidesSaving = false;
          state.slidesById[action?.payload?.id] = action.payload;
          state.lastUpdatedAt = action.payload.updated_at;
          state.error = null;
        })
        .addCase(updateSlide.rejected, (state, action) => {
          state.isSlidesSaving = false;
          state.error = action.payload as string;
        });


      // ******** DELETE SLIDE ********
      builder
        .addCase(deleteSlide.pending, (state) => {
          state.isSlidesSaving = true;
          state.error = null;
        })
        .addCase(deleteSlide.fulfilled, (state, action: PayloadAction<any>) => {
          const { id } = action.payload;
          state.isSlidesSaving = false;
          state.slides = state.slides.filter((slideId) => slideId !== id);
          delete state.slidesById[id];
          state.lastUpdatedAt = Math.max(...state.slides.map((slideId) => new Date(state.slidesById[slideId].updated_at).getTime()));
          state.error = null;
        })
        .addCase(deleteSlide.rejected, (state, action) => {
          state.isSlidesSaving = false;
          state.error = action.payload as string;
        });
    },
  });

export const {
  setCourseId,
  closeBottomSheet,
  closeOverlay,
  openBottomSheet,
  openOverlay,
  setSlideBackgroundImage,
  setQuizType,
  setAudio,
  setVideo,
  updateEditorContent,
  updateQuizSlide,
  updateFormSlide
} = editorSlice.actions;
export default editorSlice.reducer;