"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

interface MenuAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface ToggleMenuProps {
  actions: MenuAction[];
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  buttonClassName?: string;
  menuClassName?: string;
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({ 
  actions,
  position = 'top-right',
  buttonClassName = "text-gray-600 dark:text-gray-300",
  menuClassName = "",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-0 right-0 mb-8';
      case 'top-left':
        return 'top-0 left-0 mt-8';
      case 'bottom-left':
        return 'bottom-0 left-0 mb-8';
      default:
        return 'top-0 right-0 mt-8';
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className={buttonClassName}>
        <FaEllipsisV />
      </button>
      {menuOpen && (
        <div 
          ref={menuRef} 
          className={`absolute ${getPositionClasses()} w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 ${menuClassName}`}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${action.className || ''}`}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToggleMenu; 