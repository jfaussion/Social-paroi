import { useState } from 'react';
import { News } from '@/domain/News.schema';
import { postNews } from '../actions/postNews';

/**
 * Custom hook for posting news.
 * @returns An object containing the function to post the news (postNewsDate), the loading state (isLoading), the error message (error).
 */
export const usePostNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Posts news data.
   * @param news - The news object to be posted.
   * @returns A promise that resolves to the posted news object, or null if an error occurred.
   */
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