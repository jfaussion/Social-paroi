import React from 'react';
import Popin from '../ui/Popin';
import UserRanking from '../UserRanking';
import { User } from '@/domain/User.schema';

type TrackCompletionListProps = {
  isOpen: boolean;
  userRanking: User[];
  onClose: () => void;
  currentUserId?: string;
};

export const TrackCompletionList: React.FC<TrackCompletionListProps> = ({ isOpen, userRanking, onClose, currentUserId }) => {
  return (
    <Popin isOpen={isOpen} onClose={onClose} title="They did it !">
      <div className="overflow-auto max-h-96 scrollbar-custom">
        {userRanking.length > 0 ? (
          userRanking.map((user, index) => (
            <UserRanking
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