"use client"
import { useEffect, useState } from "react";
import ViewCard from "@/components/card/ViewCard";
import { useEditor, EditorContent, EditorEvents } from '@tiptap/react';
import { defaultExtensions } from "@/components/Editor/extensions/extensions";
import { QuizPlayer } from "@/components/Quiz/QuizPlayer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentSlide, setSlides } from "@/store/features/contentPlayer/contentPlayerSlice";
import { CardSlide } from "@/store/features/editor/types";

export const ContentPlayer = () => {
  const [isForwardTapEnabled, setIsForwardTapEnabled] = useState(true);
  const { isQuizCompleted, slide, slides, currentSlide } = useAppSelector((state) => ({
    slides: state.contentPlayer.slides,
    currentSlide: state.contentPlayer.currentSlide,
    slide: state.contentPlayer.slidesById[state.contentPlayer.currentSlide] || null,
    isQuizCompleted: !!state.contentPlayer.quiz?.[state.contentPlayer.currentSlide]
  }));
  const dispatch = useAppDispatch();
  const { id, background, content } = slide || {};

  const editor = useEditor({
    editable: false,
    extensions: [...defaultExtensions],
    content,
    onBeforeCreate: ({ editor }: EditorEvents["beforeCreate"]) => {
    }
  }, [slides]);

  const handleTap = (e) => {
    const { clientX } = e;
    const screenWidth = window.innerWidth;
    const currentSlideIndex = slides.indexOf(slide?.id);
    let slideToBeNavigated = currentSlideIndex;

    if (clientX > screenWidth * 0.3) {
      if (isForwardTapEnabled || isQuizCompleted) {
        slideToBeNavigated = (Math.min(currentSlideIndex + 1, slides.length - 1));
      }
    } else {
      slideToBeNavigated = (Math.max(currentSlideIndex - 1, 0));
    }
    const slideId = slides[slideToBeNavigated];
    dispatch(setCurrentSlide(slideId));
  };

  const handleQuizSubmit = () => {
    setIsForwardTapEnabled(true);
  }

  useEffect(() => {
    editor?.commands?.setContent((slide as CardSlide)?.content);
    if (slide?.type === 'quiz') {
      setIsForwardTapEnabled(false);
    } else {
      setIsForwardTapEnabled(true);
    }
  }, [editor, slides, currentSlide]);

  useEffect(() => {
    const data = localStorage.getItem('slides');
    if (data) {
      const parsedData = JSON.parse(data);
      // editor?.commands?.setContent(slide?.content);
      dispatch(setSlides(parsedData));
    }
  }, []);

  const renderCard = () => {
    return (
      <EditorContent editor={editor} style={{ width: '100%', height: '100%' }} />
    )
  }

  const renderQuiz = () => {
    return (
      <QuizPlayer slide={slide} onSubmit={handleQuizSubmit} />
    )
  }
  return (
    <div className="h-full relative" onClick={handleTap}>
      <div className="w-full h-full">
        <ViewCard
          id={id}
          background={background}
          className="relative flex justify-center items-center w-full"
        >
          {slide && slide?.type === "card" && renderCard()}
          {slide && slide?.type === "quiz" && renderQuiz()}
        </ViewCard>
      </div>
    </div>
  )
};
