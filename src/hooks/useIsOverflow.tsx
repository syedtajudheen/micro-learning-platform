// import { RefObject, useLayoutEffect, useState } from "react";

// export const useIsOverflow = (
//   ref,
//   callback?: (hasOverflow: boolean) => void
// ): boolean => {
//   const [isOverflow, setIsOverflow] = useState(false);

//   useLayoutEffect(() => {
//     const { current } = ref;

//     const trigger = () => {
//       if (!current) return;

//       const hasOverflow = current.scrollWidth > current.clientWidth;
//       setIsOverflow(hasOverflow);

//       if (callback) callback(hasOverflow);
//     };

//     trigger();

//     // Optional: Listen for window resize to recheck overflow
//     window.addEventListener("resize", trigger);
//     return () => window.removeEventListener("resize", trigger);
//   }, [callback, ref]);

//   return isOverflow;
// };

import { RefObject, useLayoutEffect, useState } from "react";

export const useIsOverflow = (
  ref: RefObject<HTMLElement>,
  callback?: (hasOverflow: boolean) => void
): boolean => {
  const [isOverflow, setIsOverflow] = useState(false);

  useLayoutEffect(() => {
    const trigger = () => {
      const element = ref.current;
      if (!element) return;

      const hasOverflow = element.scrollWidth > element.offsetWidth;
      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    // Create observers for both size and content changes
    const resizeObserver = new ResizeObserver(trigger);
    const mutationObserver = new MutationObserver(trigger);

    if (ref.current) {
      resizeObserver.observe(ref.current);
      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Initial check
    trigger();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref, callback]);

  return isOverflow;
};
