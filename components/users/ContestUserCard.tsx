import React from 'react';
import UserCard from './UserCard';
import { ContestUser } from '@/domain/ContestUser.schema';

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
  return (
    <UserCard
      name={contestUser.isTemp ? contestUser.name || '' : contestUser.user?.name || ''}
      profilePicture={contestUser.isTemp ? undefined : contestUser.user?.image || ''}
      isCurrentUser={false} // Adjust as needed
      gender={contestUser.gender}
      isRemovable={isRemovable}
      onClickRemove={() => onRemove(contestUser)}
    />
  );
};

export default ContestUserCard; 