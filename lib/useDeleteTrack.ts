import { Track } from "@/domain/Track.schema";
import { useState } from "react";
import { deleteTrackAndImage } from "./actions";

export const useDeleteTrack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteTrack(track: Track): Promise<Boolean> {
    setIsLoading(true);
    setError(null);
    try {
      // Delete track
      await deleteTrackAndImage(track);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred while deleting the block');
      setIsLoading(false);
      return false;
    }
  };

  return { deleteTrack, isLoading, error };
};