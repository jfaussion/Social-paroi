import { useState } from 'react';
import { getAllTracksForUser } from './actions';
import { Track } from '@/domain/Track.schema';
import { Filters } from '@/domain/Filters';

export const useFetchTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTracks(userId: string, filters: Filters): Promise<Track[]> {
    setIsLoading(true);
    setError(null);
    try {
      const trackList = await getAllTracksForUser(userId, filters);
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
