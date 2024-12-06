import { useState } from 'react';
import { Track } from '@/domain/Track.schema';
import { Filters } from '@/domain/Filters';
import { searchTrackForContest } from '../actions/searchContestTrack';

export const useFetchCotnestTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTracks(contestId: number, filters: Filters): Promise<Track[]> {
    setIsLoading(true);
    setError(null);
    try {
      const trackList = await searchTrackForContest(contestId, filters);
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
