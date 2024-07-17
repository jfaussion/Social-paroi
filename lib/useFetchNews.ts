import { useState } from 'react';
import { getAllActiveNews } from './actions';
import { News } from '@/domain/News.schema';

export const useFetchNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchNews(): Promise<News[]> {
    setIsLoading(true);
    setError(null);
    try {
      const newsList = await getAllActiveNews();
      setIsLoading(false);
      return newsList;
    } catch (err) {
      setError('An error occurred while fetching the tracks');
      setIsLoading(false);
      return [];
    }
  };

  return { fetchNews, isLoading, error };
};
