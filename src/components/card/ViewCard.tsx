import React, { useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { LoaderCircle } from 'lucide-react';

export default function ViewCard({ background, className, children, id }) {
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of slide is visible
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isLoaded = background?.image ? isImageLoaded : true;

  return (
    <Wrapper
      ref={ref}
      bgColor={background?.color}
      className={`overflow-hidden  shadow-sm ${className}`}
      opactiy={inView ? 1 : 0.5}
    >
      {background?.image && (
        <Image
          key={background?.image} // Add a unique key to prevent image flickering when loads another image
          src={background?.image}
          alt="Background Image"
          layout="fill"
          priority={true}
          onLoad={() => {
            console.log('Image loaded');
            setIsImageLoaded(true);
          }}
          className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
        />
      )
      }

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <LoaderCircle className="animate-spin w-12 h-12" />
        </div>
      )}
      {(inView && isLoaded) && children}
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
  ${({ bgColor }) => bgColor && `
    background-color: ${bgColor};
  `}
`;
