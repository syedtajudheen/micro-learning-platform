import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  container?: HTMLElement; // Optional container for portal
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, container, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  // Causing some issue when aadding quiz(closes the other sheets in the other slides)
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

  const sheetContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <motion.div
           ref={sheetRef}
           initial={{ y: "100%" }}
           animate={{ y: 0 }}
           exit={{ y: "100%" }}
           transition={{ type: "spring", stiffness: 300, damping: 30 }}
           drag="y"
           dragConstraints={{ top: 0, bottom: 100 }}
           onDragEnd={(_, info) => {
             if (info.offset.y > 50) onClose(); // Close if dragged down enough
           }}
           className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 shadow-lg"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return container ? ReactDOM.createPortal(sheetContent, container) : sheetContent;
}