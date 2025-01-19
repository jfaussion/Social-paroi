import { useState } from 'react';
import { Contest } from '@/domain/Contest.schema'; // Adjust the import based on your schema
import { getAllContests } from '../actions/getAllContests'; // Adjust the import based on your actions

export const useFetchContests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContests(): Promise<Contest[]> {
    setIsLoading(true);
    setError(null);
    try {
      const contestsList = await getAllContests(); // Fetch all active contests
      setIsLoading(false);
      return contestsList;
    } catch (err) {
      setError('An error occurred while fetching the contests');
      setIsLoading(false);
      return [];
    }
  };

  return { fetchContests, isLoading, error };
};