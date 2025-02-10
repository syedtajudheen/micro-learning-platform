import { PlayButton, Tooltip, useMediaState } from "@vidstack/react";
import { Pause, Play } from "lucide-react";

export const ControlButtons = () => {
  const isPaused = useMediaState('paused');

  const buttonClass =
    'group ring-media-focus relative inline-flex h-10 w-10 rounded-3xl p-2 cursor-pointer items-center justify-center rounded-md outline-none ring-inset bg-white/5 data-[focus]:ring-4';

  const tooltipClass =
    'animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden';

  return (
    <Tooltip.Root className="media-controls:opacity-100 absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/10 to-transparent opacity-100 transition-opacity">
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement="bottom center">
        {isPaused ? 'Play' : 'Pause'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
