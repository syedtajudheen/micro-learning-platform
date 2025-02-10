import React from 'react';

export const SlideProgressBar = ({ ref }) => {
  return (
    <>
      {/* Background track */}
      <div className="absolute left-2 right-2 top-2 h-1 rounded-lg bg-gray-500 z-50"></div>

      {/* Expanding progress bar */}
      <div
        ref={ref}
        className="absolute z-50 top-2 left-2 right-2 h-1 rounded-lg bg-white transition-transform duration-200 ease-linear origin-left scale-x-[0]"
      ></div>
    </>
  )
};
