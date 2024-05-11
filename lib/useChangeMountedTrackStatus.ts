import { useState } from "react";
import { MountOrUnmountTrack } from "./actions";

export const useChangeMountedTrackStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeMountedTrackStatus = async (trackId: number, removeTrack: boolean) => {
    setIsLoading(true);
    try {
      await MountOrUnmountTrack(trackId, removeTrack);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred while updating the mounted track status');
      setIsLoading(false);
      return false;
    }
  };

  return { changeMountedTrackStatus, isLoading, error };
}