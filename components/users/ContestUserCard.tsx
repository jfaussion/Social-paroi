import React from 'react';
import UserCard from './UserCard';
import { ContestUser } from '@/domain/ContestUser.schema';
import { FaTrash } from 'react-icons/fa';

interface ContestUserCardProps {
  contestUser: ContestUser;
  onRemove: (contestUser: ContestUser) => void;
  isRemovable: boolean;
}

const ContestUserCard: React.FC<ContestUserCardProps> = ({ 
  contestUser, 
  onRemove,
  isRemovable = false
}) => {
  const actions = isRemovable ? [
    {
      label: 'Remove User',
      icon: <FaTrash className="w-4 h-4" />,
      onClick: () => onRemove(contestUser),
      className: 'text-red-600 dark:text-red-400'
    }
  ] : undefined;

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