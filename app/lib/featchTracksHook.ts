import { useState } from 'react';
import { getAllTracksForUser } from './actions';

export const useFetchTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const trackList = await getAllTracksForUser(userId);
      setIsLoading(false);
      return trackList;
    } catch (err) {
      setError('An error occurred while fetching the tracks');
      setIsLoading(false);
      return [];
    }
  };

  return { fetchTracks, isLoading, error };
};
