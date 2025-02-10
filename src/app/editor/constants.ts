import { MultipleQuizSlide, SingleQuizSlide, Slide } from '@/store/features/editor/types';
import { v4 as uuidv4 } from 'uuid';

export const defaultSlide: Slide = {
  id: uuidv4(),
  type: "card",
  title: "Slide 1",
  content: {
    "type": "doc",
    "content": [
      {
        "type": "paragraph"
      },
      {
        "type": "paragraph"
      },
      {
        "type": "paragraph"
      },
      {
        "type": "heading",
        "attrs": {
          "level": 1
        },
        "content": [
          {
            "type": "text",
            "text": "One Piece of Content"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "This is a Description."
          }
        ]
      }
    ]
  },
  background: {
    color: "#86efac",
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
    color: "#86efac",
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
    color: "#86efac",
    image: "",
    video: ""
  }
});

export const defaultVideoSlide = (id: string) => ({
  id,
  type: "video",
  title: "Slide 1",
  video: {
    fileName: null,
    fileSize: null,
    fileType: null,
    message: null,
    url: null
  },
  background: {
    color: "#86efac",
    image: "",
    video: ""
  }
});
// "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export const defaultAudioSlide = (id: string) => ({
  id,
  type: "audio",
  title: "Slide 1",
  audio: {
    fileName: null,
    fileSize: null,
    fileType: null,
    message: null,
    url: null
  },
  background: {
    color: "#86efac",
    image: "",
    video: ""
  }
});
