import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

export default function ViewCard({ background, className, children, id }) {
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of slide is visible
  });

  return (
    <Wrapper
      ref={ref}
      $backgroundImage={background?.image}
      bgColor={background?.color}
      className={`overflow-hidden  shadow-sm ${className}`}
      opactiy={inView ? 1 : 0.5}
    >
      {inView && children}
    </Wrapper>
  )
};

const Wrapper = styled.div<{ $isOverflowHidden: boolean; $backgroundImage: string; bgColor: string }>`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: ${({ opactiy }) => opactiy};
  ${props => props.$backgroundImage && `
    background-image: url(${props.$backgroundImage});
    background-size: cover;
    background-position: center;
  `}
  ${({ bgColor }) => bgColor && `
    background-color: ${bgColor};
  `}
`;
