import React from 'react';
import Image from 'next/image';
import DefaultAvatar from "@/public/default-avatar.svg";

interface UserRankingProps {
  rank?: number;
  profilePicture?: string;
  name: string;
  score?: number;
  isCurrentUser?: boolean;
}

const UserRanking: React.FC<UserRankingProps> = ({ rank, profilePicture, name, score, isCurrentUser }) => {
  return (
    <div className={`relative flex items-center justify-between p-4 ${isCurrentUser ? 'bg-slate-300 dark:bg-gray-700' : ''}`}>
      <div className="flex items-center">
        {rank && <span className="text-lg font-bold w-5 sm:w-8 flex-shrink-0">{rank}</span>}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-500 mx-4 flex-shrink-0">
          <Image
            src={profilePicture ?? DefaultAvatar}
            alt="Your avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <span className="text-md">{name}</span>
      </div>
      {score && <span className="text-md font-bold">{score}</span>}
      <div
        className="absolute bottom-0 h-px bg-gray-300 dark:bg-gray-700"
        style={{ left: '10%', right: '10%' }}
      ></div>
    </div>
  );
};

export default UserRanking;