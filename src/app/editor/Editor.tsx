"use client"
import React, { useEffect, useRef, useState } from "react";
import { Editor } from '@tiptap/react';
import Tiptap from "@/components/Editor/TipTap";
import ToolBar from "@/components/widgets/ToolBar/ToolBar";
import Slide from "@/components/card/Card";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrevNext } from "@/hooks/usePrevNext";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { v4 as uuidv4 } from 'uuid';
import { Quiz } from "@/components/Quiz/Quiz";
import { addSlide, closeOverlay, openBottomSheet, removeSlide, setSlideBackgroundImage, updateEditorContent } from "@/store/features/editor/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { defaultAudioSlide, defaultSingleQuizSlide, defaultSlide, defaultVideoSlide } from "./constants";
import { Form } from "@/components/Form/Form";
import { Sheet } from "@/components/ui/sheet";
import { Drawer } from "@/components/Drawer/Drawer";
import { VideoSlide } from "@/components/Video/VideoSlide";
import { Audio } from "@/components/Audio/Audio";
import { useRouter } from "next/navigation";


export default function Editor() {
  const [editorInstances, setEditorInstance] = useState({});
  const slidesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isOverflow = useIsOverflow(slidesRef);
  const dispatch = useAppDispatch();
  const { slides, slidesById, overlay } = useAppSelector((state) => ({
    slides: state.editor.slides,
    slidesById: state.editor.slidesById,
    overlay: state.editor.overlay,
  }));

  const { prev, next, currentSlide, setCurrentSlide } = usePrevNext(slides);

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
    dispatch(removeSlide(id));

    const deletedIndex = slides.findIndex(slideId => slideId === id);

    // Adjust current slide position if needed
    if (currentSlide >= deletedIndex && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGiphyClick = (item: any) => {
    dispatch(setSlideBackgroundImage({ id: overlay.id, image: item.images.original.url }));
    handleSheetClose();
  };

  const handleUnsplashImgClick = (item: any) => {
    dispatch(setSlideBackgroundImage({ id: overlay.id, image: item.urls.regular }));
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
                  onUpdate={(content: string) => dispatch(updateEditorContent({ content, id }))}
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

  return (
    <>
      <div className="flex justify-between items-center w-[calc(100%-90px)] pr-8">
        <h1 className="basis-3xl self-center font-semibold p-8">Micro-Learning Platform</h1>
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
