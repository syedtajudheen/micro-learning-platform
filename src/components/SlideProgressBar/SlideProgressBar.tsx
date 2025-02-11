import React from 'react';

const modeColors = {

  light: {
    background: "bg-gray-700",
    progress: "bg-gray-300",
  },
  dark: {
    background: "bg-gray-400",
    progress: "bg-gray-700",
  },
};

export const SlideProgressBar = ({ ref, mode = 'light' }: { ref: React.RefObject<HTMLDivElement>, mode?: 'light' | 'dark' }) => {
  const modeColor = modeColors[mode];
  
  return (
    <>
      {/* Background track */}
      <div className={`absolute left-2 right-2 top-2 h-1 rounded-lg ${modeColor?.background} z-50`}></div>

      {/* Expanding progress bar */}
      <div
        ref={ref}
        className={`absolute z-50 top-2 left-2 right-2 h-1 rounded-lg ${modeColor?.progress} transition-transform duration-200 ease-linear origin-left scale-x-[0]`}
      ></div>
    </>
  )
};
