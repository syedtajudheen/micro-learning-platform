import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useRef, useState } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  Controls,
} from '@vidstack/react';
import { ControlButtons } from './ControlButtons';
import { Gestures } from './Gestures';
import { BottomSheet } from '../BottomSheet';
import { Video } from 'lucide-react';
import { closeBottomSheet, setVideo } from '@/store/features/editor/editorSlice';
import { Button } from '../ui/button';

export const VideoSlide = ({ id }) => {
  const player = useRef<MediaPlayerInstance>(null);
  const dispatch = useAppDispatch();
  const video = useAppSelector((state) => state.editor.slidesById[id]?.video);
  const isBottomSheetOpen = useAppSelector((state) => state.editor.bottomSheet?.[id] || false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const progressId = `video-progress-${id}`;

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

  useEffect(() => {
    const element = document.getElementById(progressId);

    // Subscribe for updates without triggering renders.
    return player.current?.subscribe(({ currentTime, duration }) => {
      if (element) {
        // Update the progress bar. (currentTime > 0.4s) added to fix second time playing progress sync issue
        element.style.width = currentTime > 0.4 ? `${(currentTime / duration) * 100}%` : '0%';
      }
    });
  }, [video.url, progressId]);

  return (
    <>
      <div className="absolute inset-0 h-full w-full">
        {video?.url && (
          <MediaPlayer
            key={id}
            ref={player}
            className="w-full h-full bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
            title="Sprite Fight"
            src={video.url}
            crossOrigin
            playsInline
            style={{ aspectRatio: '9/16' }}
            onEnded={handleEnded}
          >
            <MediaProvider>
              <video className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                <div
                  id={progressId}
                  className="h-full bg-white transition-all duration-200"
                />
              </div>
            </MediaProvider>

            {/* Disabling the gestures to navigate to next slide on swipe when video completed one time */}
            {!isVideoCompleted && <Gestures />}

            <Controls.Root className="opacity-0 transition-opacity duration-1000 hover:opacity-100" hideDelay={2000}>
              <Controls.Group className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <ControlButtons />
              </Controls.Group>
            </Controls.Root>
          </MediaPlayer>
        )}
      </div>

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
