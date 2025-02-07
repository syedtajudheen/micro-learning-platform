import { useAppSelector } from '@/store/hooks';
import { useEffect, useRef, useState } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  Controls,
} from '@vidstack/react';
import { ControlButtons } from './ControlButtons';
import { Gestures } from './Gestures';

export const VideoSlide = ({ id }) => {
  const player = useRef<MediaPlayerInstance>(null);
  const videoBg = useAppSelector((state) => state.editor.slidesById[id]?.video);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);


  const handleEnded = () => {
    setIsVideoCompleted(true);
  };

  useEffect(() => {
    const element = document.getElementById('video-progress');

    // Subscribe for updates without triggering renders.
    return player.current!.subscribe(({ currentTime, duration }) => {
      if (element) {
        // Update the progress bar. (currentTime > 0.4s) added to fix second time playing progress sync issue
        element.style.width = currentTime > 0.4 ? `${(currentTime / duration) * 100}%` : '0%';
      }
    });
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full">
      {videoBg && (
        <MediaPlayer
          ref={player}
          className="w-full h-full bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
          title="Sprite Fight"
          src="https://videos.pexels.com/video-files/27788440/12225044_1440_2560_30fps.mp4"
          crossOrigin
          playsInline
          style={{ aspectRatio: '9/16' }}
          onEnded={handleEnded}
        >
          <MediaProvider>
            <video className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
              <div
                id="video-progress"
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
  );
};
