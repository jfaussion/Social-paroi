"use client";

import { News } from '@/domain/News.schema';
import { isOpener } from '@/utils/session.utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';


interface NewsCardProps {
  news: News;
  editNews: (news: News) => void;
  deleteNews: (news: News) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, editNews, deleteNews }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const session = useSession();


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEdit = () => {
    editNews(news);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    deleteNews(news);
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
    <div key={news.id} className="w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 relative">
      <h2 className="text-xl font-bold">{news.title}</h2>
      <pre className="whitespace-pre-wrap font-normal font-sans">{news.content}</pre>
      <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>

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

export default NewsCard;
