import { useState } from "react";

export const usePrevNext = (slides) => {

  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    setCurrentSlide((prev) =>  slides.count - 1 === prev ? 0 : prev + 1);
  };
  const prev = () => {
    setCurrentSlide((prev) => prev === 0 ? slides.count - 1 : prev - 1);
  };
  return {
    setCurrentSlide,
    currentSlide,
    prev,
    next
  };
};
