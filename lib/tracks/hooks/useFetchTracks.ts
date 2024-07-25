import { useState } from 'react';
import { Track } from '@/domain/Track.schema';
import { Filters } from '@/domain/Filters';
import { searchTrackForUser } from '../actions/searchTrack';

export const useFetchTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTracks(userId: string, filters: Filters): Promise<Track[]> {
    setIsLoading(true);
    setError(null);
    try {
      const trackList = await searchTrackForUser(userId, filters);
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
