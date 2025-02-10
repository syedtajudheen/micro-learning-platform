import { Node } from '@tiptap/react';

export interface EditorState {
  slidesById: {
    [key: string]: Slide | null;
  },
  slides: string[];
  currentSlide: number;
  bottomSheet: {
    [key: string]: boolean
  };
  overlay: {
    isOpen: boolean;
    type: OverlayType | null;
    id: string | null;
  }
  // other editor state
}

export type Background = {
  color: string;
  image: string;
  video: string;
};

export type MediaFile = {
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  message: string | null;
  url: string | null;
};

export type CardSlide = {
  id: string;
  type: string;
  title: string;
  content: Node;
  background: Background;
  // bottomSheetType: 'quiz' | 'text' | 'image' | 'layout';
};

export type SingleQuizSlide = {
  id: string;
  type: string;
  quizType: QuizType;
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  answer: string;
  comment: string;
  background: Background
}

export type MultipleQuizSlide = {
  id: string;
  type: string;
  quizType: QuizType;
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  answer: string[];
  comment: string;
  background: Background
};

export type VideoSlide = {
  id: string;
  type: string;
  title: string;
  video: MediaFile;
  background: Background;
};

export type AudioSlide = {
  id: string;
  type: string;
  title: string;
  audio: MediaFile;
  background: Background;
};

export type QuizSlide = SingleQuizSlide | MultipleQuizSlide;
export type QuizType = 'single' | 'multiple';

export type Slide = CardSlide | QuizSlide | VideoSlide | AudioSlide;

export enum OverlayTypes {
  GIPHY = 'GIPHY',
  UNSPLASH = 'UNSPLASH'
};

export type OverlayType = OverlayTypes.GIPHY | OverlayTypes.UNSPLASH;
