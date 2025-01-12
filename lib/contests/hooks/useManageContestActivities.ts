import { useState } from 'react';
import { updateActivityScoreForUser } from '@/lib/contests/actions/updateActivityScoreForUser';
import { addActivityToContest } from '@/lib/contests/actions/addActivityToContest';
import { removeActivity } from '@/lib/contests/actions/removeActivity';
import { ContestActivity } from '@/domain/ContestActivity.schema';
import { postActivityImage } from '../actions/postActivityImage';

/**
 * Custom hook for managing contest activities.
 * @returns An object containing functions to manage activities, along with loading states and errors.
 */
export const useManageContestActivities = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const updateActivityScore = async (
    contestId: number, 
    activityId: number, 
    score: number,
    contestUserId: number
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await updateActivityScoreForUser(contestId, activityId, score, contestUserId);
      setIsLoading(false);
      return success;
    } catch (err) {
      setError('An error occurred while updating the activity score');
      setIsLoading(false);
      return false;
    }
  };

  const addActivity = async (
    contestId: number,
    activity: Omit<ContestActivity, 'contestId'>,
    imageFile: File | null
  ): Promise<ContestActivity | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('id', activity.id.toString());
      formData.append('contestId', contestId.toString());
      formData.append('name', activity.name);
      formData.append('description', activity.description ?? '');
      formData.append('imageFileUrl', activity.image ?? '');

      // handle image upload
      if (imageFile) {
        formData.append('activityPhoto', imageFile);
        setLoadingMessage('Uploading image...');
        const photoUrl = await postActivityImage(formData);
        formData.set('imageFileUrl', photoUrl);
      }

      // Handle post activity
      setLoadingMessage('Posting activity...');
      const newActivity = await addActivityToContest(contestId, formData);

      setIsLoading(false);
      return newActivity;
    } catch (err) {
      setError('An error occurred while adding the activity');
      setIsLoading(false);
      return null;
    } finally {
      setLoadingMessage(null);
    }

  };

  const deleteActivity = async (
    activity: ContestActivity
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await removeActivity({
        ...activity,
        image: activity.image ?? null,
      });
      setIsLoading(false);
      return success;
    } catch (err) {
      setError('An error occurred while removing the activity');
      setIsLoading(false);
      return false;
    }
  };

  return { 
    updateActivityScore,
    addActivity,
    deleteActivity,
    loadingMessage,
    isLoading, 
    error
  };
}; 