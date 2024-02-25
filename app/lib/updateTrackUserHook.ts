import { TrackStatus } from '@/domain/TrackSchema';
import { useState } from 'react';
import { updateTrackStatusForUser } from './actions';

export const useUpdateTrackStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTrackStatus = async (trackId: number, userId: number, newStatus: TrackStatus) => {
    setIsLoading(true);
    try {
      await updateTrackStatusForUser(trackId, userId, newStatus);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred while updating the track status');
      setIsLoading(false);
      return false;
    }
  };

  return { updateTrackStatus, isLoading, error };
};
