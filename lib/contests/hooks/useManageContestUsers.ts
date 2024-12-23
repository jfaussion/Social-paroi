import { useState } from 'react';
import { addContestUser } from '@/lib/contests/actions/addContestUser';
import { removeContestUser } from '@/lib/contests/actions/removeContestUser';
import { ContestUser, GenderType } from '@/domain/ContestUser.schema';

/**
 * Custom hook for managing contest users.
 * @returns An object containing functions to add and remove users, along with loading states and errors.
 */
export const useManageContestUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (contestId: number, userId: string, gender: GenderType) => {
    setIsLoading(true);
    try {
      const contestUserId = await addContestUser(contestId, gender, userId);
      setIsLoading(false);
      return contestUserId;
    } catch (err) {
      setError('An error occurred while adding the user');
      setIsLoading(false);
      return false;
    }
  };

  const deleteUser = async (contestUser: ContestUser) => {
    setIsLoading(true);
    try {
      const success = await removeContestUser(contestUser.id);
      setIsLoading(false);
      return success;
    } catch (err) {
      setError('An error occurred while removing the user');
      setIsLoading(false);
      return false;
    }
  };

  const addTempUser = async (contestId: number, name: string, gender: GenderType) => {
    setIsLoading(true);
    try {
      const contestUserId = await addContestUser(contestId, gender, undefined, name);
      setIsLoading(false);
      return contestUserId;
    } catch (err) {
      setError('An error occurred while adding the temporary user');
      setIsLoading(false);
      return false;
    }
  };

  return { addUser, deleteUser, addTempUser, isLoading, error };
}; 