"use client"
import React, { RefAttributes, SyntheticEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Editor } from '@tiptap/react';
import Tiptap from "@/components/Editor/TipTap";
import ToolBar from "@/components/widgets/ToolBar/ToolBar";
import Slide from "@/components/card/Card";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrevNext } from "@/hooks/usePrevNext";
import { useIsOverflow } from "@/hooks/useIsOverflow";

const defaultSlide = {
  id: 1,
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

export default function EditorPage() {
  const [containerRef, setEditorInstance] = useState({});
  const [slides, setSlides] = useState([defaultSlide]);
  const slidesRef = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(slidesRef);
  const { prev, next, currentSlide, setCurrentSlide } = usePrevNext(slides);

  const handleWidgetClick = (widget: string) => {
    switch (widget) {
      case 'card':
        setSlides((prevSlides) => [...prevSlides, {
          ...defaultSlide,
          id: defaultSlide.id + 1
        }
        ]);
        break;

      default:
        break;
    }
  };

  const handleEditorReady = (editor: Editor, id: number) => {
    setEditorInstance((prevEditors) => ({
      ...prevEditors,
      [id]: editor,
    }));
  };

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
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
          <SlideWrapper ref={slidesRef} isOverflow={isOverflow}>
            {slides.map((slide, index) => (

              <div data-slide-focus={index === currentSlide} onClick={() => handleSlideClick(index)} key={index} className=" md:basis-1/2 lg:basis-1/3">

                <Slide isFocused={index === currentSlide} >
                  <Tiptap onEditorReady={(e: Editor) => handleEditorReady(e, slide.id)} content={slide.content} />
                </Slide>
              </div>
            ))
            }

          </SlideWrapper>
          <Button variant="outline" size="icon" onClick={next} disabled={currentSlide === slides.length - 1}>
            <ChevronRight />
          </Button>
        </CarouselWrappper>

        <ToolBar onClick={handleWidgetClick} />
      </Container>
    </>
  );
};
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

const SlideWrapper = styled.div`
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

// <Card>
// <CardContent className="flex aspect-square items-center justify-center p-6">
//   <span className="text-2xl font-semibold">{index + 1}</span>
// </CardContent>
// </Card>