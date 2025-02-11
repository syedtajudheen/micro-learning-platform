"use client"
import { useEffect, useRef, useState } from "react";
import ViewCard from "@/components/card/ViewCard";
import { useEditor, EditorContent, EditorEvents } from '@tiptap/react';
import { defaultExtensions } from "@/components/Editor/extensions/extensions";
import { QuizPlayer } from "@/components/Quiz/QuizPlayer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentSlide, setSlideEngagement, setSlides } from "@/store/features/contentPlayer/contentPlayerSlice";
import { CardSlide } from "@/store/features/editor/types";
import { AudioPlayer } from "@/components/Audio/AudioPlayer";
import { VideoPlayer } from "@/components/Video/VideoPlayer";
import { SlideProgressBar } from "@/components/SlideProgressBar/SlideProgressBar";
import { useIsDarkColor } from "@/hooks/useIsDark";

export const ContentPlayer = () => {
  const [isForwardTapEnabled, setIsForwardTapEnabled] = useState(true);
  const { engagement, isQuizCompleted, slide, slides, currentSlide } = useAppSelector((state) => ({
    slides: state.contentPlayer.slides,
    currentSlide: state.contentPlayer.currentSlide,
    slide: state.contentPlayer.slidesById[state.contentPlayer.currentSlide as string] || null,
    isQuizCompleted: !!state.contentPlayer.quizResults?.[state.contentPlayer.currentSlide as string],
    engagement: state.contentPlayer.slideEngagement?.[state.contentPlayer.currentSlide as string],
  }));
  const dispatch = useAppDispatch();
  const { id, background, content } = slide || {};
  const slideRef = useRef(null);
  const slideProgressRef = useRef(null);
  const isDarkImage = useIsDarkColor({ color: slide?.background?.color, image: slide?.background?.image });
  const editor = useEditor({
    editable: false,
    extensions: [...defaultExtensions],
    content,
    onBeforeCreate: ({ editor }: EditorEvents["beforeCreate"]) => {
    }
  }, [slides]);

  const handleTap = (e) => {

    const currentSlideIndex = slides.indexOf(slide?.id);
    let slideToBeNavigated = currentSlideIndex;


    const slideElement = e.currentTarget as HTMLElement;
    const { left, width } = slideElement.getBoundingClientRect(); // Get slide position & width

    let clientX = e.clientX;
    // On mobile/tablets, taps trigger a TouchEvent, where clientX is inside e.touches[0]
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    }

    const relativeX = clientX - left; // Normalize X coordinate to slide area
    if (relativeX > width * 0.3) {
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
    if (slide?.type === 'quiz' || (slide?.type === 'video' && !engagement?.isCompleted)) {
      setIsForwardTapEnabled(false);
    } else {
      setIsForwardTapEnabled(true);
    }

    /** Handling slide progress */
    const currentSlideIndex = slides.indexOf(slide?.id);
    if (slideProgressRef?.current?.style && currentSlideIndex > -1) {
      slideProgressRef.current.style.transform = `scaleX(${(currentSlideIndex + 1) / slides.length})`;
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
      <EditorContent className="tiptap-editor" editor={editor} style={{ width: '100%', height: '100%' }} />
    )
  }

  const renderQuiz = () => {
    return (
      <QuizPlayer slide={slide} onSubmit={handleQuizSubmit} />
    )
  }

  const renderAudio = () => {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <AudioPlayer id={slide?.id} url={slide?.audio?.url} />
      </div>
    )
  };

  const renderVideo = () => {
    return (
      <div>
        <VideoPlayer id={slide?.id} url={slide?.video?.url} onEnded={() => {
          setIsForwardTapEnabled(true);
          dispatch(setSlideEngagement({
            slideId: slide?.id,
            isCompleted: true,
            viewCount: 1,
            totalWatchTime: 0
          }))
        }}
          isGestureDisabled={engagement?.isCompleted}
        />
      </div>
    )
  };

  return (
    <div className="h-full relative" ref={slideRef}>
      <div
        className="w-full h-full relative max-w-[432px] md:max-w-[820px] lg:max-w-[432px] mx-auto"
        onClick={handleTap}
      >
        <SlideProgressBar ref={slideProgressRef} mode={isDarkImage ? "light" : "dark"} />
        <ViewCard
          id={id}
          background={background}
          className="relative flex justify-center items-center w-full"
        >
          {slide && slide?.type === "card" && renderCard()}
          {slide && slide?.type === "quiz" && renderQuiz()}
          {slide && slide?.type === "audio" && renderAudio()}
          {slide && slide?.type === "video" && renderVideo()}
        </ViewCard>
      </div>
    </div>
  )
};
