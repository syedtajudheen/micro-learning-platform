import React, { useRef } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { Image, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { openOverlay, setSlideBackgroundImage } from '@/store/features/editor/editorSlice';
import { OverlayTypes } from '@/store/features/editor/types';
import { AlertModal } from '../AlertModal';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';

export default function Card({ className, children, isFocused, onDelete, id }) {
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of slide is visible
  });
  const menuRef = useRef(null);
  const isBottomSheetOpen = useAppSelector((state) => state.editor.bottomSheet?.[id] || false);
  const background = useAppSelector((state) => state.editor.slidesById[id]?.background?.image);
  const dispatch = useAppDispatch();

  const handleUpload = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      dispatch(setSlideBackgroundImage({ id, image: url }));

      // Close the menu
      menuRef.current?.click();
    }
  };

  return (
    <>
      <Wrapper
        ref={ref}
        $backgroundImage={background}
        className={`overflow-hidden  shadow-sm bg-green-300 ${className}`}
        $isFocused={isFocused}
        $isOverflowHidden={isBottomSheetOpen}
        opactiy={inView ? 1 : 0.5}
      >
        {inView && children}
      </Wrapper>

      <Menubar className='flex justify-between w-full pl-0 border-none shadow-none'>
        <MenubarMenu>
          <MenubarTrigger>
            <Button
              size="icon"
              className=" h-6 w-6 relative left-0"
              variant={'ghost'}
            >
              <Image className="h-3 w-3" alt="background image" size={14} />
            </Button>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => dispatch(openOverlay({ id, type: OverlayTypes.GIPHY }))}>
              Add Giphy Gif
            </MenubarItem>
            <MenubarItem onClick={() => dispatch(openOverlay({ id, type: OverlayTypes.UNSPLASH }))}>
              Add unsplash img
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem ref={menuRef}>
              <input
                type="file"
                accept="image/*"
                onClick={e => e.stopPropagation()}
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              Import from Device
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="h-6 w-6 relative" variant={"ghost"}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertModal
            variant="delete"
            title="Are you sure you want to delete the slide?"
            description={"This action cannot be undone. This will permanently delete your slide."}
            confirmText={"Delete"}
            onConfirm={onDelete}
          />
        </AlertDialog>
       
      </Menubar>
    </>
  )
};

const Wrapper = styled.div<{ $isOverflowHidden: boolean, $backgroundImage: string }>`
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 240px;
  height: 400px;
  overflow: ${props => props.$isOverflowHidden ? 'hidden' : 'auto'};
  opacity: ${({ opactiy }) => opactiy};
  ${props => props.$isFocused && `
    border: 2px solid #007bff;
  `}
  ${props => props.$backgroundImage && `
    background-image: url(${props.$backgroundImage});
    background-size: cover;
    background-position: center;
  `}
`;
