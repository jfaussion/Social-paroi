import { useState } from 'react';
import { News } from '@/domain/News.schema';
import { postNews } from '../actions/postNews';

export const usePostNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postNewsData = async (news: News): Promise<News | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await postNews(news);
    } catch (err) {
      console.error(err);
      setError("An error occurred while posting the news");
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return { isLoading, error, postNewsData };
};