import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

export default function FlipCard({ background, front, back, flipped }) {
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of slide is visible
  });

  return (
    <div className={` w-full h-full perspective cursor-pointer`}>
      <Wrapper
        ref={ref}
        $backgroundImage={background?.image}
        bgColor={background?.color}
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? "rotate-y-180" : ""
          }`}
      >
        <div className="p-8 absolute inset-0 w-full h-full flex items-center justify-center bg-blue-500 text-white text-lg font-bold rounded-xl backface-hidden">
          {front}
        </div>

        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-green-500 text-white text-lg font-bold rounded-xl rotate-y-180 backface-hidden">
          {back}
        </div>
      </Wrapper>
    </div>

  )
};

const Wrapper = styled.div<{ $isOverflowHidden: boolean; $backgroundImage: string; bgColor: string }>`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  ${props => props.$backgroundImage && `
    background-image: url(${props.$backgroundImage});
    background-size: cover;
    background-position: center;
  `}
  ${({ bgColor }) => bgColor && `
    background-color: ${bgColor};
  `}
`;

  // <FlipCard
  //     front={<QuizPlayer slide={slide} onSubmit={handleQuizSubmit} />}
  //     back={<div>Hello</div>}
  //     flipped={flipped}
  //     background={background}
  //     />