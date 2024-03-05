import React from 'react';

interface ToggleProps {
  isActive: boolean;
  isLoading: boolean;
  onChange: () => void;
}

const ToggleButton = ({isActive, isLoading, onChange}: ToggleProps) => {

 // Tailwind classes for button base styling
 const baseClasses = "rounded-full p-2 cursor-pointer border border-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out";
 const activeClasses = isActive ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-500';
 const animationClass = isActive ? 'animate-[buttonBounce_0.5s_ease-in-out]' : '';
 const textClass = isActive ? 'text-white' : 'text-gray-500';


 return (
   <button 
     onClick={onChange} 
     disabled={isLoading} 
     className={`${baseClasses} ${activeClasses} ${animationClass}`}
   >
     <svg className={`w-6 h-6 ${textClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
     </svg>
   </button>
 );
};

export default ToggleButton;
