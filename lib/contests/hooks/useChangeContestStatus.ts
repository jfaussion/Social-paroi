import { useState } from 'react';
import { Contest } from '@/domain/Contest.schema';
import { ContestStatusType } from '@/domain/ContestStatus.enum';
import { callChangeContestStatus } from '../actions/changeContestStatus';

type ChangeContestStatusResponse = {
  success: boolean;
  error?: string;
};

export const useChangeContestStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setError(null);
  }

  const changeContestStatus = async (contest: Contest, newStatus: ContestStatusType): Promise<ChangeContestStatusResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      await callChangeContestStatus(contest, newStatus);
      return { success: true };
    } catch (error) {
      // Handle the error
      setError('Failed to update contest status');
      return { success: false, error: 'Failed to update contest status' };
    } finally {
      setIsLoading(false);
    }
  };

  return { changeContestStatus, isLoading, error, reset };
};