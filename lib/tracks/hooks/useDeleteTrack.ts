import { Track } from "@/domain/Track.schema";
import { useState } from "react";
import { deleteTrackAndImage } from "../actions/deleteTrack";

export const useDeleteTrack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setError(null);
  }

  async function deleteTrack(track: Track): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTrackAndImage(track);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred while deleting the block');
      setIsLoading(false);
      return false;
    }
  };

  return { deleteTrack, isLoading, error, reset };
};