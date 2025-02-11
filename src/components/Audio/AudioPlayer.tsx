import { useEffect, useRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance
} from '@vidstack/react';
import { AudioControlButton } from './AudioControlButton';

export const AudioPlayer = ({ id, url }) => {
  const progressId = `audio-progress-${id}`;
  const player = useRef<MediaPlayerInstance>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    // Subscribe for updates without triggering renders.
    return player.current?.subscribe(({ currentTime, duration }) => {
        // Update the progress bar. (currentTime > 0.4s) added to fix second time playing progress sync issue
        progressRef.current.style.transform = currentTime > 0.4 ? `scaleX(${(currentTime / duration)})` : "scaleX(0)";
    });
  }, [url, progressId]);

  return (
    <div className="absolute bottom-4 left-4 right-4 isolate">
      {url && (
        <MediaPlayer
          key={`player-${id}`}
          ref={player}
          className="bg-black/20 backdrop-blur-sm text-white rounded-full shadow-lg"
          title="Audio Track"
          src={url}
          crossOrigin
        >
          <MediaProvider>
            <audio />
          </MediaProvider>

          <AudioControlButton progressRef={progressRef}/>

        </MediaPlayer>
      )}
    </div>
  );
};
