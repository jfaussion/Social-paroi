import React from 'react';
import Image from 'next/image';
import DefaultAvatar from "@/public/default-avatar.svg";
import AddButton from '../ui/AddButton';
import MinusButton from '../ui/MinusButton';

interface UserCardProps {
  rank?: number;
  profilePicture?: string;
  name: string;
  score?: number;
  isCurrentUser?: boolean;
  gender?: string;
  isAddable?: boolean;
  isAdded?: boolean;
  isRemovable?: boolean;
  onClickAdd?: () => void;
  onClickRemove?: () => void;
  containerClass?: string;
}

const UserCard: React.FC<UserCardProps> = ({ rank, profilePicture, name, score, isCurrentUser, gender, isAddable, isAdded, isRemovable, onClickAdd, onClickRemove, containerClass }) => {
  return (
    <div className={`relative flex items-center justify-between py-4 w-full ${isCurrentUser ? 'bg-slate-300 dark:bg-gray-700' : ''} ${containerClass}`}>
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
      <div className="flex items-center justify-self-end">
        {gender && <span className="text-md mr-2">{gender}</span>}
        {score && <span className="text-md font-bold">{score}</span>}
        {isAddable && <AddButton isActive={!!isAdded} isLoading={false} onChange={onClickAdd} style='small' />}
        {isRemovable && <MinusButton isActive={false} isLoading={false} onChange={onClickRemove} style='small' />}
      </div>
      <div className="absolute bottom-0 h-px bg-gray-300 dark:bg-gray-700 left-[10%] right-[10%]"></div>
    </div>
  );
};

export default UserCard;