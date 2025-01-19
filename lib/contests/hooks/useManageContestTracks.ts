import { useState } from 'react';
import { addTrackToContest } from '@/lib/contests/actions/addTrackToContest';
import { removeTrackFromContest } from '@/lib/contests/actions/removeTrackFromContest';

/**
 * Custom hook for managing contest tracks.
 * @returns An object containing functions to add and remove tracks, along with loading states and errors.
 */
export const useManageContestTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTrack = async (contestId: number, trackId: number) => {
    setIsLoading(true);
    try {
      const success = await addTrackToContest(contestId, trackId);
      setIsLoading(false);
      return success;
    } catch (err) {
      setError('An error occurred while adding the track');
      setIsLoading(false);
      return false;
    }
  };

  const removeTrack = async (contestId: number, trackId: number) => {
    setIsLoading(true);
    try {
      const success = await removeTrackFromContest(contestId, trackId);
      setIsLoading(false);
      return success;
    } catch (err) {
      setError('An error occurred while removing the track');
      setIsLoading(false);
      return false;
    }
  };

  return { addTrack, removeTrack, isLoading, error };
}; 