import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  const baseClasses =
    'flex h-10 items-center rounded-lg dark:bg-black px-4 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-gray-200 dark:active:bg-gray-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 border border-black dark:border-white';
  return (
    <button
      {...rest}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}