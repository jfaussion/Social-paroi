"use client";

import { Contest } from '@/domain/Contest.schema';
import { isOpener } from '@/utils/session.utils';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';

interface ContestCardProps {
  contest: Contest;
  editContest: (contest: Contest) => void;
  deleteContest: (contest: Contest) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, editContest, deleteContest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const session = useSession();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEdit = () => {
    editContest(contest);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    deleteContest(contest);
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div key={contest.id} className="w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg relative">
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
          <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300">
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestCard;