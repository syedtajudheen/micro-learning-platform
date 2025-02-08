import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance
} from '@vidstack/react';
import { AudioLines } from 'lucide-react';
import { BottomSheet } from '../BottomSheet';
import { Button } from '../ui/button';
import { closeBottomSheet, setAudio } from '@/store/features/editor/editorSlice';
import { AudioControlButton } from './AudioControlButton';

export const Audio = ({ id }) => {
  const dispatch = useAppDispatch();
  const isBottomSheetOpen = useAppSelector((state) => state.editor.bottomSheet?.[id] || false);
  const audioBg = useAppSelector((state) => state.editor.slidesById[id]?.audio);
  const player = useRef<MediaPlayerInstance>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);


  const handleAudioUpload = async (e) => {
    setIsUploading(true);

    const file = e.target.files?.[0];

    if (file && file.type === "audio/mpeg") {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      dispatch(setAudio({ id, audio: data }));
      dispatch(closeBottomSheet(id));
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const element = document.getElementById('audio-progress');
    if (!element) return;

    // Subscribe for updates without triggering renders.
    return player.current?.subscribe(({ currentTime, duration }) => {
      if (element) {
        // Update the progress bar. (currentTime > 0.4s) added to fix second time playing progress sync issue
        element.style.width = currentTime > 0.4 ? `${(currentTime / duration) * 100}%` : '0%';
      }
    });
  }, [audioBg?.url]);

  return (
    <div>
      <div className="absolute bottom-4 left-4 right-4">
        {audioBg?.url && (
          <MediaPlayer
            ref={player}
            className="bg-black/20 backdrop-blur-sm text-white rounded-full shadow-lg"
            title="Audio Track"
            src={audioBg.url}
            crossOrigin
          >
            <MediaProvider>
              <audio />
            </MediaProvider>

            <AudioControlButton />

          </MediaPlayer>
        )}
      </div>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => dispatch(closeBottomSheet(id))}>
        <p className='flex justify-center items-center font-sans text-sm'>
          <AudioLines className="h-4 w-4 pr-1" size={14} /> Audio
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
