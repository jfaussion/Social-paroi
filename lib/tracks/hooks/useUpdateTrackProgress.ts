import { useState } from 'react';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { updateTrackStatusForUser } from '../actions/updateTrackStatusForUser';

export const useUpdateTrackProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTrackStatus = async (trackId: number, userId: string, newStatus: TrackStatus) => {
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
