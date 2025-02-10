import { PlayButton, useMediaState } from "@vidstack/react";
import { Pause, Play } from "lucide-react";

export const AudioControlButton = ({ progressRef }) => {
  const isPaused = useMediaState('paused');

  return (
    <div className="flex items-center p-2 gap-3">
      <PlayButton className="hover:bg-white/10 rounded-full p-2 transition-colors">
        {isPaused ?
          <Play className="w-5 h-5 text-white" /> :
          <Pause className="w-5 h-5 text-white" />
        }
      </PlayButton>

      <div className="flex-1 h-1 mr-5 bg-white/20 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-white/80 transition-transform duration-200 ease-linear origin-left"
        />
      </div>
    </div>
  )
};
