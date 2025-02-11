import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AudioLines } from 'lucide-react';
import { BottomSheet } from '../BottomSheet';
import { Button } from '../ui/button';
import { closeBottomSheet, setAudio } from '@/store/features/editor/editorSlice';
import { AudioPlayer } from './AudioPlayer';

export const Audio = ({ id }) => {
  const dispatch = useAppDispatch();
  const isBottomSheetOpen = useAppSelector((state) => state.editor.bottomSheet?.[id] || false);
  const audioBg = useAppSelector((state) => state.editor.slidesById[id]?.audio);
  const [isUploading, setIsUploading] = useState<boolean>(false);


  const handleAudioUpload = async (e) => {
    setIsUploading(true);

    const file = e.target.files?.[0];

    if (file && file.type === "audio/mpeg") {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      dispatch(setAudio({ id, audio: data }));
      dispatch(closeBottomSheet(id));
      setIsUploading(false);
    }
    setIsUploading(false);
  };

  return (
    <div>
      <AudioPlayer id={id} url={audioBg?.url} />

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => dispatch(closeBottomSheet(id))}>
        <p className='flex justify-center items-center font-sans text-sm'>
          <AudioLines className="h-5 w-5 pr-1" size={14} /> Audio
        </p>
        <div className="flex flex-col justify-center align-center h-[65px]">
          {isUploading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!isUploading && (
            <Button name="single" variant="secondary" size="sm">Upload from device
              <input
                type='file'
                accept="audio/mpeg"
                onClick={e => e.stopPropagation()}
                onChange={handleAudioUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </Button>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
