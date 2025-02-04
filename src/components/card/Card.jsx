import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { Image } from 'lucide-react';

export default function Card({ children, isFocused }) {

  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of slide is visible
  });


  return (
    <>
    <Wrapper ref={ref} className="card  shadow-sm bg-green-300" isFocused={isFocused}
      style={{
        opacity: inView ? 1 : 0.5 // Visual feedback for visible slides
      }}
    >
      {inView && children}
    </Wrapper>
    <Image className='w-4 h-4' alt="background image" />
    </>
  )
};

const Wrapper = styled.div`
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 240px;
  height: 400px;
  overflow: scroll;
  ${props => props.isFocused && `
    border: 2px solid #007bff;
  `}
`;
