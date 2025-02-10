import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useState } from 'react';
import { BottomSheet } from '../BottomSheet';
import { Video } from 'lucide-react';
import { closeBottomSheet, setVideo } from '@/store/features/editor/editorSlice';
import { Button } from '../ui/button';
import { VideoPlayer } from './VideoPlayer';

export const VideoSlide = ({ id }) => {
  const dispatch = useAppDispatch();
  const video = useAppSelector((state) => state.editor.slidesById[id]?.video);
  const isBottomSheetOpen = useAppSelector((state) => state.editor.bottomSheet?.[id] || false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);


  const handleEnded = () => {
    setIsVideoCompleted(true);
  };

  const handleVideoUpload = async (e) => {
    setIsUploading(true);
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      dispatch(setVideo({ id, video: data }));
      dispatch(closeBottomSheet(id));
      setIsUploading(false);
    }
    setIsUploading(false);
  };

  return (
    <>
      <VideoPlayer 
      id={id} 
      url={video.url} 
      onEnded={handleEnded} 
      isGestureDisabled={isVideoCompleted}
      />
      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => dispatch(closeBottomSheet(id))}>
        <p className='flex justify-center items-center font-sans text-sm'>
          <Video className="h-5 w-5 pr-1" size={14} /> Video
        </p>
        <div className="flex flex-col justify-center align-center h-[65px]">
          {isUploading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!isUploading && (
            <Button variant="secondary" size="sm">Upload from device
              <input
                type='file'
                accept='video/*'
                onClick={e => e.stopPropagation()}
                onChange={handleVideoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </Button>
          )}
        </div>
      </BottomSheet>
    </>
  );
};
