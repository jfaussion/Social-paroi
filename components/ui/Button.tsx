import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  btnStyle?: 'primary' | 'secondary';
}

export function Button({ children, className, ...rest }: ButtonProps) {
  const baseClasses =
    'flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';


  const primaryClasses = 'text-black dark:text-white bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-zinc-300 dark:active:bg-zinc-700 border-black dark:border-white';
  const secondaryClasses = 'text-white dark:text-black bg-gray-800 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-300 active:bg-zinc-700 dark:active:bg-zinc-300 border-white dark:border-black';

  const btnTypeClasses = rest.btnStyle === 'secondary' ? secondaryClasses: primaryClasses;

  return (
    <button
      {...rest}
      className={`${baseClasses} ${btnTypeClasses} ${className}`}
    >
      {children}
    </button>
  );
}