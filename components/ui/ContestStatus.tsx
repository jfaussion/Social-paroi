import React from 'react';
import { ContestStatusEnum, ContestStatusType } from '@/domain/ContestStatus.enum';

interface ContestStatusProps {
  status: ContestStatusType;
  className?: string;
}

const ContestStatus: React.FC<ContestStatusProps> = ({ status, className = '' }) => {
  const getStatusColor = (status: ContestStatusType) => {
    switch (status) {
      case ContestStatusEnum.enum.Created:
        return 'bg-yellow-500/20 text-yellow-500';
      case ContestStatusEnum.enum.Upcoming:
        return 'bg-blue-500/20 text-blue-500';
      case ContestStatusEnum.enum.InProgress:
        return 'bg-green-500/20 text-green-500';
      case ContestStatusEnum.enum.Over:
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default ContestStatus; 