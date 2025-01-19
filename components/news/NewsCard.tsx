"use client";

import { News } from '@/domain/News.schema';
import { isOpener } from '@/utils/session.utils';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ToggleMenu from '../ui/ToggleMenu';


interface NewsCardProps {
  news: News;
  editNews: (news: News) => void;
  deleteNews: (news: News) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, editNews, deleteNews }) => {
  const session = useSession();

  return (
    <div key={news.id} className="w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 relative">
      <h2 className="text-xl font-bold">{news.title}</h2>
      <pre className="whitespace-pre-wrap font-normal font-sans">{news.content}</pre>
      <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>

      {isOpener(session.data) && (
        <div className="absolute top-4 right-4">
          <ToggleMenu
            actions={[
              {
                label: 'Edit info',
                icon: <FaEdit />,
                onClick: () => editNews(news),
              },
              {
                label: 'Delete',
                icon: <FaTrash />,
                onClick: () => deleteNews(news),
                className: 'text-red-600 dark:text-red-400'
              }
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default NewsCard;
