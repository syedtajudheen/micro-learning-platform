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
import { openBottomSheet } from "@/store/features/editor/editorSlice";
import { useAppDispatch } from "@/store/hooks";

const defaultSlide = {
  id: uuidv4(),
  type: "card",
  title: "Slide 1",
  content: `
  <br/>
  <br/>
  <br/>
  <h1>Title</h1>
   <p>This is a Description.</p>
  `,
};

export default function Editor() {
  const [containerRef, setEditorInstance] = useState({});
  const [slides, setSlides] = useState([defaultSlide]);
  const slidesRef = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(slidesRef);
  const { prev, next, currentSlide, setCurrentSlide } = usePrevNext(slides);
  const [editorValues, setEditorValues] = useState({});
  const dispatch = useAppDispatch();

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
          ...defaultSlide,
          id,
          type: 'quiz'
        };
        dispatch(openBottomSheet(id));
        break;
      default:
        break;
    }
    if (data) {
      setSlides((prevSlides) => [...prevSlides, data]);
    }
  };

  const handleEditorReady = (editor: Editor, id: string) => {
    setEditorInstance((prevEditors) => ({
      ...prevEditors,
      [id]: editor,
    }));
  };

  const handleEditorUpdate = (content: string, id: string) => {
    setEditorValues((prevValues) => ({
      ...prevValues,
      [id]: content,
    }));
  };

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
  };

  const handleSlideDelete = (id: string) => {
    setSlides((prevSlides) => [...prevSlides.filter((s) => s.id !== id)]);

    const deletedIndex = slides.findIndex(slide => slide.id === id);

    // Adjust current slide position if needed
    if (currentSlide >= deletedIndex && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const renderSlides = () => {
    return slides.map((slideData, index) => {
      const { id, content, type } = slideData;
      switch (type) {
        case 'card':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id} className=" md:basis-1/2 lg:basis-1/3">
              <Slide id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <Tiptap onEditorReady={(e: Editor) => handleEditorReady(e, id)} onUpdate={(c) => handleEditorUpdate(c, id)} content={editorValues?.[id] || content} />
              </Slide>
            </SlideWrapper>
          )
        case 'quiz':
          return (
            <SlideWrapper data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={id} className=" md:basis-1/2 lg:basis-1/3">
              <Slide id={id} isFocused={index === currentSlide} onDelete={() => handleSlideDelete(id)}>
                <Quiz {...slideData} />
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
      <h1 className="text-center font-semibold p-8">Micro-Learning Platform</h1>
      <Container>
        <CarouselWrappper>
          <Button variant="outline" size="icon" onClick={prev} disabled={currentSlide === 0}>
            <ChevronLeft />
          </Button>
          <SlidesWrapper ref={slidesRef} isOverflow={isOverflow}>
            {renderSlides()}
          </SlidesWrapper>
          <Button variant="outline" size="icon" onClick={next} disabled={currentSlide === slides.length - 1}>
            <ChevronRight />
          </Button>
        </CarouselWrappper>

        <ToolBar onClick={handleWidgetClick} />
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
const SlidesWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: ${({ isOverflow }) => isOverflow ? 'flex-start' : 'center'};
  /* justify-content: flex-start; */
  align-items: center;
  height: max-content;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  gap: 16px;
  padding: 20px;
`;
