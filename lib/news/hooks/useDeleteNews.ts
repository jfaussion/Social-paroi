import { useState } from 'react';
import { deleteNewsAction } from '../actions/deleteNewsAction';

type DeleteNewsResponse = {
  success: boolean;
  error?: string;
};

export const useDeleteNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setError(null);
  }

  const deleteNews = async (id: number): Promise<DeleteNewsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteNewsAction(id);
      return { success: true };
    } catch (error) {
      // Handle the error
      setError('Failed to delete news');
      return { success: false, error: 'Failed to delete news' };
    } finally {
      setIsLoading(false);
    }
  };

  return {deleteNews, isLoading, error, reset};
};
