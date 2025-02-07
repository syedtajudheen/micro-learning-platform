import { MultipleQuizSlide, SingleQuizSlide, Slide } from '@/store/features/editor/types';
import { v4 as uuidv4 } from 'uuid';

export const defaultSlide: Slide = {
  id: uuidv4(),
  type: "card",
  title: "Slide 1",
  content: `
    <p/>
    <p/>
    <p/>
    <h1>Title</h1>
    <p>This is a Description.</p>
    `,
  background: {
    color: "#ffffff",
    image: "",
    video: ""
  }
};

export const defaultSingleQuizSlide = (id: string): SingleQuizSlide => ({
  id,
  type: "quiz",
  quizType: "single",
  question: "What is the capital of France?",
  options: [
    {
      id: "option-one",
      label: "Option 1",
    },
    {
      id: "option-two",
      label: "Option 2",
    }
  ],
  answer: "option-one",
  comment: "",
  background: {
    color: "rgba(134 239 172, 1)",
    image: "",
    video: ""
  }
});


export const defaultMultipleQuizSlide = (id: string): MultipleQuizSlide => ({
  id,
  type: "quiz",
  quizType: "multiple",
  question: "What is the capital of France?",
  options: [
    {
      id: "option-one",
      label: "Option 1",
    },
    {
      id: "option-two",
      label: "Option 2",
    }
  ],
  answer: ["option-one", "option-two"],
  comment: "",
  background: {
    color: "#ffffff",
    image: "",
    video: ""
  }
});

export const defaultVideoSlide = (id: string) => ({
  id,
  type: "video",
  title: "Slide 1",
  video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  background: {
    color: "#ffffff",
    image: "",
    video: ""
  }
});
