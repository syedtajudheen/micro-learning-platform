import { useEffect, useRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  Controls
} from '@vidstack/react';
import { ControlButtons } from './ControlButtons';
import { Gestures } from './Gestures';

export const VideoPlayer = ({ id, isGestureDisabled, url, onEnded }) => {
  const player = useRef<MediaPlayerInstance>(null);
  const progressRef = useRef(null);

  const handleEnded = () => {
    onEnded();
  };

  const handlePlay = (e) => {
    e.stopPropagation();
  };
  
  useEffect(() => {
    // Subscribe for updates without triggering renders.
    return player.current?.subscribe(({ currentTime, duration }) => {
      if (progressRef.current) {
        // Update the progress bar. (currentTime > 0.4s) added to fix second time playing progress sync issue
        progressRef.current.style.transform = currentTime > 0.4 ? `scaleX(${(currentTime / duration)})` : "scaleX(0)";
      }
    });
  }, [url]);

  return (
    <div className="absolute inset-0 h-full w-full">
      {url && (
        <MediaPlayer
          key={id}
          ref={player}
          className="w-full h-full bg-slate-900 text-white font-sans overflow-hidden ring-media-focus data-[focus]:ring-4"
          title="Sprite Fight"
          src={url}
          crossOrigin
          playsInline
          onEnded={handleEnded}
          onPlay={handlePlay}
        >

          <MediaProvider className='w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover'>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
              <div
                ref={progressRef}
                className="h-full bg-white transition-transform duration-200 ease-linear origin-left"
              />
            </div>
          </MediaProvider>

          {/* Disabling the gestures to navigate to next slide on swipe when video completed one time */}
          {!isGestureDisabled && <Gestures />}

          <Controls.Root>
            <Controls.Group className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ControlButtons />
            </Controls.Group>
          </Controls.Root>
        </MediaPlayer>
      )}
    </div>
  );
};
