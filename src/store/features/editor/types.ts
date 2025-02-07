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

export type CardSlide = {
  id: string;
  type: string;
  title: string;
  content: unknown;
  background: Background;
  // bottomSheetType: 'quiz' | 'text' | 'image' | 'layout';
};

export type SingleQuizSlide = {
  id: string;
  type: string;
  quizType: string;
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
  quizType: string;
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  answer: string[];
  comment: string;
  background: Background
};

export type QuizSlide = SingleQuizSlide | MultipleQuizSlide;

export type Slide = CardSlide | QuizSlide;

export enum OverlayTypes {
  GIPHY = 'GIPHY',
  UNSPLASH = 'UNSPLASH'
};

export type OverlayType = OverlayTypes.GIPHY | OverlayTypes.UNSPLASH;
