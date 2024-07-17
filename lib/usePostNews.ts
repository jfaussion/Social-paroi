import { useState } from 'react';
import { postNews } from './actions';
import { News } from '@/domain/News.schema';

export const usePostNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postNewsData = async (news: News) => {
    setIsLoading(true);
    setError(null);

    try {
      await postNews(news);
    } catch (err) {
      console.error(err);
      setError("An error occurred while posting the news");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, postNewsData };
};