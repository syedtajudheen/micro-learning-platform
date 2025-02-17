import { useState, useEffect, useRef } from 'react';

const useDebounce = (callback, delay = 30000) => {
  const timerRef = useRef(null);

  return (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default useDebounce;
