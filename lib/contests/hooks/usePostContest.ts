import { useState } from 'react';
import { Contest } from '@/domain/Contest.schema';
import { postContest } from '../actions/postContest';
import { postCoverImage } from '../actions/postCoverImage';

/**
 * Custom hook for posting contests.
 * @returns An object containing the function to post the contest (postContestData), the loading state (isLoading), and the error message (error).
 */
export const usePostContest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(''); // Added loading message state

  /**
   * Posts contest data.
   * @param contest - The contest object to be posted.
   * @param coverImage - The cover image file to be uploaded.
   * @returns A promise that resolves to the posted contest object, or null if an error occurred.
   */
  const postContestData = async (contest: Contest, newPhoto: File | null): Promise<Contest | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('id', contest.id.toString());
      formData.append('name', contest.name);
      formData.append('date', contest.date.toString());
      formData.append('coverImageUrl', contest.coverImage?.toString() ?? '');

      // handle image upload
      if (newPhoto) {
        formData.append('coverPhoto', newPhoto);
        setLoadingMessage('Uploading image...');
        const photoUrl = await postCoverImage(formData);
        formData.set('coverImageUrl', photoUrl);
      }

      // Handle post contest
      setLoadingMessage('Posting contest...');
      const newContest = await postContest(contest.id, formData);
      return newContest;
    } catch (err) {
      console.error(err);
      setError("An error occurred while posting the contest");
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return { isLoading, error, postContestData, loadingMessage }; // Return loading message
};