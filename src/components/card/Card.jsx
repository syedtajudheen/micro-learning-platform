import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { Image, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

export default function Card({ children, isFocused, onDelete }) {
  const [backgroundImage, setBackgroundImage] = React.useState(null);
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of slide is visible
  });


  return (
    <>
      <Wrapper ref={ref} backgroundImage={backgroundImage} className="shadow-sm bg-green-300" isFocused={isFocused}
        style={{
          opacity: inView ? 1 : 0.5 // Visual feedback for visible slides
        }}
      >
        {inView && children}
      </Wrapper>
      <div className='w-full px-6'>
        <Button
          size="icon"
          className="h-6 w-6 relative left-0"
          variant={'ghost'}
        >
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                setBackgroundImage(url)
                // editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Image className="h-3 w-3" alt="background image" />
        </Button>
        <Button className="h-6 w-6 relative float-right" variant={"ghost"} onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
      </div>
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
  ${props => props.backgroundImage && `
    background-image: url(${props.backgroundImage});
    background-size: cover;
  `}
`;
