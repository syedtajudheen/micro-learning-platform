"use client"
import React, { useEffect, useRef, useState } from "react";
import { Editor } from '@tiptap/react';
import Tiptap from "@/components/Editor/TipTap";
import ToolBar from "@/components/widgets/ToolBar/ToolBar";
import Slide from "@/components/card/Card";
import styled from "styled-components";
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrevNext } from "@/hooks/usePrevNext";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { v4 as uuidv4 } from 'uuid';
import { Quiz } from "@/components/Quiz/Quiz";
import { closeOverlay, openBottomSheet, setCourseId, setSlideBackgroundImage, updateEditorContent } from "@/store/features/editor/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { defaultAudioSlide, defaultSingleQuizSlide, defaultSlide, defaultVideoSlide } from "../constants";
import { Form } from "@/components/Form/Form";
import { Sheet } from "@/components/ui/sheet";
import { Drawer } from "@/components/Drawer/Drawer";
import { VideoSlide } from "@/components/Video/VideoSlide";
import { Audio } from "@/components/Audio/Audio";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import useDebounce from "@/hooks/useDebounce";
import { addSlide, deleteSlide, fetchSlides, updateSlide } from "@/store/features/editor/editorThunk";
import { formatDistance } from 'date-fns'

export default function Editor(props) {
  const [editorInstances, setEditorInstance] = useState({});
  const slidesRef = useRef<HTMLDivElement>(null);
  const { id: courseId } = useParams<{ id: string }>()
  const router = useRouter();
  const isOverflow = useIsOverflow(slidesRef);
  const dispatch = useAppDispatch();
  const {
    slides,
    slidesById,
    overlay,
    lastUpdatedAt,
    isSlidesLoading,
    isSlidesSaving,
    error
  } = useAppSelector((state) => ({
    slides: state.editor.slides,
    slidesById: state.editor.slidesById,
    overlay: state.editor.overlay,
    userId: state.auth.user?.id,
    lastUpdatedAt: state.editor.lastUpdatedAt,
    isSlidesLoading: state.editor.isSlidesLoading,
    isSlidesSaving: state.editor.isSlidesSaving,
    error: state.editor.error,
  }));
  const [timeAgo, setTimeAgo] = useState("");

  const handleSlideContentChange = async ({ content, id }) => {
    const slidesToSave = slides.map((id) => slidesById[id]);
    if (!slidesToSave.length && !slidesById[id]) {
      return;
    }
    const { type, background } = slidesById[id];
    dispatch(updateSlide({
      id,
      type,
      content,
      background
    }));
  };

  const handleSlideBgChange = ({ id, image }) => {
    const slidesToSave = slides.map((id) => slidesById[id]);
    if (!slidesToSave.length && !slidesById[id]) {
      return;
    }
    const { background } = slidesById[id];
    dispatch(updateSlide({
      id,
      background: {
        ...background,
        image
      }
    }));
    dispatch(setSlideBackgroundImage({ id, image }));
  };

  const debouncedSlideChange = useDebounce(handleSlideContentChange, 5000);
  const debouncedSlideBgChange = useDebounce(handleSlideBgChange, 5000);

  const { prev, next, currentSlide, setCurrentSlide } = usePrevNext(slides);

  const subscribeToSlides = (courseId) => {
    supabaseClient
      .channel(`slides:${courseId}`) // Unique channel per course
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "slides", filter: `course_id=eq.${courseId}` },
        (payload) => {
          console.log("Realtime update:", payload);
          if (payload.eventType === "INSERT") {
            console.log("New slide added:", payload.new);
          } else if (payload.eventType === "UPDATE") {
            console.log("Slide updated:", payload.new);
          } else if (payload.eventType === "DELETE") {
            console.log("Slide deleted:", payload.old);
          }
        }
      )
      .subscribe();
  };

  const handleWidgetClick = (widget: string) => {
    const id = uuidv4();
    let data = null;
    switch (widget) {
      case 'card':
        data = {
          ...defaultSlide,
          id
        };
        break;
      case 'quiz':
        data = {
          ...defaultSingleQuizSlide(id),
          type: 'quiz'
        };
        dispatch(openBottomSheet(id));
        break;
      case 'form':
        data = {
          ...defaultSlide,
          id,
          type: 'form'
        };
        dispatch(openBottomSheet(id));
        break;
      case 'video':
        data = {
          ...defaultVideoSlide(id),
          id,
          type: 'video'
        };
        break;
      case 'audio':
        data = {
          ...defaultAudioSlide(id),
          id,
          type: 'audio'
        };
        break;
      default:
        break;
    }
    if (data) {
      dispatch(addSlide(data));
      dispatch(openBottomSheet(id));
    }
  };

  const handleEditorReady = (editor: Editor, id: string) => {
    setEditorInstance((prevEditors) => ({
      ...prevEditors,
      [id]: editor,
    }));
  };

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
  };

  const handleSlideDelete = (id: string) => {
    dispatch(deleteSlide(id));

    const deletedIndex = slides.findIndex(slideId => slideId === id);

    // Adjust current slide position if needed
    if (currentSlide >= deletedIndex && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGiphyClick = (item: any) => {
    dispatch(setSlideBackgroundImage({ id: overlay.id, image: item.images.original.url }));
    debouncedSlideBgChange({ id: overlay.id, image: item.images.original.url });
    handleSheetClose();
  };

  const handleUnsplashImgClick = (item: any) => {
    dispatch(setSlideBackgroundImage({ id: overlay.id, image: item.urls.regular }));
    debouncedSlideBgChange({ id: overlay.id, image: item.urls.regular });
    handleSheetClose();
  };

  const handleSheetClose = () => {
    dispatch(closeOverlay());
  };

  const handleSave = () => {
    const slidesToSave = slides.map((id) => slidesById[id]);
    localStorage.setItem('slides', JSON.stringify(slidesToSave));
    router.push('/content-player');
  };

  const renderSlides = () => {
    return slides.map((id, index) => {
      const { content, type } = slidesById[id];
      switch (type) {
        case 'card':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id}>
              <Slide id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <Tiptap
                  onEditorReady={(e: Editor) => handleEditorReady(e, id)}
                  onUpdate={(content: string) => {
                    debouncedSlideChange({ content, id });
                    dispatch(updateEditorContent({ content, id }))
                  }}
                  content={content}
                />
              </Slide>
            </SlideWrapper>
          )
        case 'quiz':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id}>
              <Slide className="relative" id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <Quiz {...slidesById[id]} />
              </Slide>
            </SlideWrapper>
          )
        case 'form':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id}>
              <Slide id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <Form {...slidesById[id]} />
              </Slide>
            </SlideWrapper>
          )
        case 'video':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id}>
              <Slide className="relative" id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <VideoSlide {...slidesById[id]} />
              </Slide>
            </SlideWrapper>
          )
        case 'audio':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id}>
              <Slide className="relative" id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <Audio {...slidesById[id]} />
              </Slide>
            </SlideWrapper>
          )
        default:
          break;
      }
    })
  };

  useEffect(() => {
    if (document) {
      document.querySelector('div[data-slide-focus="true"]')?.scrollIntoView({
        behavior: "smooth"
      });
    }

  }, [currentSlide]);

  const fetchCourses = async () => {
    dispatch(fetchSlides(courseId));
    // subscribeToSlides(courseId);
  }

  useEffect(() => {
    if (!lastUpdatedAt) return;
    const updateTime = () => {
      setTimeAgo(formatDistance(lastUpdatedAt, new Date(), { addSuffix: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lastUpdatedAt]);

  useEffect(() => {
    fetchCourses();
    dispatch(setCourseId(courseId));
  }, []);

  if (isSlidesLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center w-[calc(100%-90px)] pr-8">
        <h1 className="basis-3xl self-center font-semibold p-8">Micro-Learning Platform</h1>
        {isSlidesSaving && (
          <span className="flex items-center gap-1 text-blue-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </span>
        )}
        {(timeAgo && !isSlidesSaving) && (
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle className="w-4 h-4" />
            Saved {timeAgo}
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1 text-red-500">
            <XCircle className="w-4 h-4" />
            Failed to save!
          </span>
        )}
        <Button onClick={handleSave}>Preview</Button>
      </div>

      <Container>
        <Sheet
          open={overlay.isOpen}
          onOpenChange={handleSheetClose}
        >
          <CarouselWrappper>
            <Button variant="outline" size="icon" onClick={prev} disabled={currentSlide === 0}>
              <ChevronLeft />
            </Button>
            <SlidesWrapper ref={slidesRef} $isOverflow={isOverflow}>
              {renderSlides()}
            </SlidesWrapper>
            <Button variant="outline" size="icon" onClick={next} disabled={currentSlide === slides.length - 1}>
              <ChevronRight />
            </Button>
          </CarouselWrappper>
          <ToolBar onClick={handleWidgetClick} />
          <Drawer type={overlay.type} onGifClick={handleGiphyClick} onUnsplashImageClick={handleUnsplashImgClick} />
        </Sheet>
      </Container>
    </>
  );
};

const SlideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  display: flex;
  height: calc(100% - 88px);
`;
const CarouselWrappper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  width: calc(100% - 80px);
`;
const SlidesWrapper = styled.div<{ $isOverflow: boolean }>`
  position: relative;
  display: flex;
  justify-content: ${({ $isOverflow }) => $isOverflow ? 'flex-start' : 'center'};
  align-items: center;
  height: max-content;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  gap: 16px;
  padding: 20px;
`;
