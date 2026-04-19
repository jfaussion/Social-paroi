import { useState } from 'react';
import { callDeleteContest } from '../actions/deleteContest';
import { Contest } from '@/domain/Contest.schema';

type DeleteContestResponse = {
  success: boolean;
  error?: string;
};

export const useDeleteContest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setError(null);
  }

  const deleteContest = async (contest: Contest, locationId: number): Promise<DeleteContestResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      await callDeleteContest(contest, locationId);
      return { success: true };
    } catch (error) {
      // Handle the error
      setError('Failed to delete contest');
      return { success: false, error: 'Failed to delete contest' };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteContest, isLoading, error, reset };
};