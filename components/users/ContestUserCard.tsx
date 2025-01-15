import React from 'react';
import UserCard from './UserCard';
import { ContestUser } from '@/domain/ContestUser.schema';
import { FaTrash, FaPen, FaEye } from 'react-icons/fa';

interface ContestUserCardProps {
  contestUser: ContestUser;
  onRemove: (contestUser: ContestUser) => void;
  onViewScoreAction: (contestUser: ContestUser) => void;
  isRemovable: boolean;
  isOpener: boolean;
}

const ContestUserCard: React.FC<ContestUserCardProps> = ({ 
  contestUser, 
  onRemove,
  onViewScoreAction,
  isRemovable = false,
  isOpener = false
}) => {
  const baseActions = isRemovable ? [
    {
      label: 'Remove User',
      icon: <FaTrash className="w-4 h-4" />,
      onClick: () => onRemove(contestUser),
      className: 'text-red-600 dark:text-red-400'
    }
  ] : [];

  const scoreAction = {
    label: isOpener ? 'Edit Score' : 'View Score',
    icon: isOpener ? <FaPen className="w-4 h-4" /> : <FaEye className="w-4 h-4" />,
    onClick: () => onViewScoreAction(contestUser)
  };

  const actions = [scoreAction, ...baseActions];

  return (
    <UserCard
      name={contestUser.isTemp ? contestUser.name || '' : contestUser.user?.name || ''}
      profilePicture={contestUser.isTemp ? undefined : contestUser.user?.image || ''}
      isCurrentUser={false}
      gender={contestUser.gender}
      actions={actions}
    >
    </UserCard>
  );
};

export default ContestUserCard; 