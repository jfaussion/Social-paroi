import { ReactNode } from 'react';

export interface MenuAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
} 