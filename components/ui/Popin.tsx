// components/ui/Popin.tsx
import React, { useRef, useEffect } from 'react';

type PopinProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  bodyClassName?: string;
};

const Popin: React.FC<PopinProps> = ({ isOpen, onClose, title, children, bodyClassName }) => {

  // Close if click outside
  const popinRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popinRef.current && !(popinRef.current as HTMLElement).contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div ref={popinRef} className="relative bg-gray-100 dark:bg-gray-900 w-full max-w-md my-auto mx-4 md:m-auto flex-col flex rounded-lg shadow-lg border border-black dark:border-white">
        <div className='flex justify-end mt-2 mr-4'>
          <button onClick={onClose} className="text-xl font-bold text-gray-600 hover:text-gray-800">
            <span aria-hidden>×</span>
          </button>
        </div>
        <div>
          <div className="flex justify-between items-center px-6 sm:px-8">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className={`${bodyClassName ?? 'mt-4 pb-6 sm:pb-8 px-6 sm:px-8'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popin;
