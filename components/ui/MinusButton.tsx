import React from 'react';

interface MinusButtonProps {
  isActive: boolean;
  isLoading: boolean;
  onChange?: () => void;
  style?: 'small';
}

const MinusButton = ({ isActive, isLoading, onChange, style }: MinusButtonProps) => {

  // Tailwind classes for button base styling
  const baseClasses = "rounded-full p-2 cursor-pointer border border-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out";
  const activeClasses = isActive ? 'bg-red-500 border-red-600' : 'bg-transparent border-gray-500';
  const animationClass = isActive ? 'animate-[buttonBounce_0.5s_ease-in-out]' : '';
  const textClass = isActive ? 'text-white' : 'text-gray-500';
  const { sizeClass, strokeWidth } = style === 'small' ? { sizeClass: 'w-4 h-4', strokeWidth: '3' } : { sizeClass: 'w-6 h-6', strokeWidth: '2' };

  return (
    <button
      onClick={onChange}
      disabled={isLoading}
      className={`${baseClasses} ${activeClasses} ${animationClass}`}
    >
      <svg className={`${sizeClass} ${textClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M4 12h16" />
      </svg>
    </button>
  );
};

export default MinusButton; 