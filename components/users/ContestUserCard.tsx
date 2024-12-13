import React from 'react';
import UserCard from './UserCard';
import { ContestUser } from '@/domain/ContestUser.schema';

interface ContestUserCardProps {
  contestUser: ContestUser;
  onRemove: (contestUser: ContestUser) => void;
}

const ContestUserCard: React.FC<ContestUserCardProps> = ({ contestUser, onRemove }) => {
  return (
    <UserCard
      name={contestUser.isTemp ? contestUser.name || '' : contestUser.user?.name || ''}
      profilePicture={contestUser.isTemp ? undefined : contestUser.user?.image || ''}
      isCurrentUser={false} // Adjust as needed
      gender={contestUser.gender}
      isRemovable={true}
      onClickRemove={() => onRemove(contestUser)}
    />
  );
};

export default ContestUserCard; 