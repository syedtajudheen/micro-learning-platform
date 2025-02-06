import { useState } from "react";

export const usePrevNext = (slides: unknown[]) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    setCurrentSlide((prev) =>  slides.length - 1 === prev ? 0 : prev + 1);
  };
  const prev = () => {
    setCurrentSlide((prev) => prev === 0 ? slides.length - 1 : prev - 1);
  };
  return {
    setCurrentSlide,
    currentSlide,
    prev,
    next
  };
};
