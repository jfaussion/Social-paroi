import React from 'react';
import Popin from '../ui/Popin';
import UserCard from '../users/UserCard';
import { User } from '@/domain/User.schema';

type TrackCompletionListProps = {
  isOpen: boolean;
  userRanking: User[];
  onClose: () => void;
  currentUserId?: string;
};

export const TrackCompletionList: React.FC<TrackCompletionListProps> = ({ isOpen, userRanking, onClose, currentUserId }) => {
  return (
    <Popin isOpen={isOpen} onClose={onClose} title="They did it !" bodyClassName="px-2 mt-4 pb-6 sm:pb-8">
      <div className="overflow-auto max-h-96 scrollbar-custom">
        {userRanking.length > 0 ? (
          userRanking.map((user, index) => (
            <UserCard
              key={user.id}
              rank={index + 1}
              profilePicture={user.image ?? ''}
              name={user.name ?? ''}
              isCurrentUser={user.id === currentUserId}
            />
          ))
        ) : (
          <p>No users have completed this track yet.</p>
        )}
      </div>
    </Popin>
  );
};

export default TrackCompletionList;