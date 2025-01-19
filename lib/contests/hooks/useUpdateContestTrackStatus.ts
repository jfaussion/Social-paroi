'use client';

import { useState } from 'react';
import { updateContestTrackStatus } from '../actions/updateContestTrackStatus';
import { TrackStatus } from '@/domain/TrackStatus.enum';

export function useUpdateContestTrackStatus() {
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (
    contestId: number,
    contestUserId: number,
    trackId: number,
    status: TrackStatus
  ) => {
    try {
      setIsLoading(true);
      const result = await updateContestTrackStatus(
        contestId,
        contestUserId,
        trackId,
        status
      );

      if (!result) {
        throw new Error('Failed to update track status');
      }

      return true;
    } catch (error) {
      console.error('Error updating track status:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStatus,
    isLoading,
  };
} 