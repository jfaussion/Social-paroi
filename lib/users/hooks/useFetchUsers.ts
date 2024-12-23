import { useState } from 'react';
import { User } from '@/domain/User.schema'; // Adjust the import based on your User schema
import { getAllUsersWithContests } from '../actions/getAllUsersWithContests'; // Import the new function

export const useFetchUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() : Promise<User[]> {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsersWithContests();
      setIsLoading(false);
      return data as User[];
    } catch (err) {
      setError('Failed to fetch users');
      setIsLoading(false);
      return [];
    }
  };

  return { fetchUsers, isLoading, error };
}; 