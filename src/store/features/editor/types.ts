export interface EditorState {
  slidesById: {
    [key: string]: Slide | null;
  },
  slides: string[];
  currentSlide: number;
  bottomSheet: {
    [key: string]: boolean
  };
  bottomSheetType: 'quiz' | 'text' | 'image' | 'layout';
  // other editor state
}

export type CardSlide = {
  id: string;
  type: string;
  title: string;
  content: unknown;
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
};

export type QuizSlide = SingleQuizSlide | MultipleQuizSlide;

export type Slide = CardSlide | QuizSlide;
