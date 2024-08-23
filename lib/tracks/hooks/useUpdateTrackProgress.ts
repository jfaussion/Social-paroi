import { useState } from 'react';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { updateTrackStatusForUser } from '../actions/updateTrackStatusForUser';

/**
 * Custom hook for updating track progress.
 * @returns An object containing the updateTrackStatus function, isLoading state, and error message.
 */
export const useUpdateTrackProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates the status of a track for a user.
   * @param trackId - The ID of the track.
   * @param userId - The ID of the user.
   * @param newStatus - The new status of the track.
   * @returns A boolean indicating whether the update was successful.
   */
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
