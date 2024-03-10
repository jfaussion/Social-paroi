import { useState } from 'react';
import { getAllTracksForUser } from './actions';
import { Track } from '@/domain/TrackSchema';

export const useFetchTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTracks(userId: string, zones?: number[], levels?: string[]): Promise<Track[]> {
    setIsLoading(true);
    setError(null);
    try {
      const trackList = await getAllTracksForUser(userId, zones, levels);
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
