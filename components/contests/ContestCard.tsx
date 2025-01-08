"use client";

import { Contest } from '@/domain/Contest.schema';
import { isOpener } from '@/utils/session.utils';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ToggleMenu from '../ui/ToggleMenu';

interface ContestCardProps {
  contest: Contest;
  editContest: (contest: Contest) => void;
  deleteContest: (contest: Contest) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, editContest, deleteContest }) => {
  const session = useSession();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/contests/${contest.id}`);
  };

  return (
    <button key={contest.id} onClick={handleClick}
      className="w-full cursor-pointer bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg relative">
      {contest.coverImage && (
        <CldImage
          width="400"
          height="200"
          src={contest.coverImage}
          crop="thumb"
          gravity="center"
          alt={contest.name}
          className="w-full h-48 object-cover rounded-md"
        />
      )}
      <div className='p-4'>
        <h2 className="text-xl font-bold">{contest.name}</h2>
        <p className="text-sm text-gray-500">{new Date(contest.date).toLocaleDateString()}</p>
      </div>

      {isOpener(session.data) && (
        <div className="absolute top-4 right-4">
          <ToggleMenu
            actions={[
              {
                label: 'Edit info',
                icon: <FaEdit />,
                onClick: () => editContest(contest),
              },
              {
                label: 'Delete',
                icon: <FaTrash />,
                onClick: () => deleteContest(contest),
                className: 'text-red-600 dark:text-red-400'
              }
            ]}
          />
        </div>
      )}
    </button>
  );
};

export default ContestCard;