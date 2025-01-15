import { useState } from "react";
import { getContestUserDetails } from "../actions/getContestUserDetails";
import { Track } from "@/domain/Track.schema";
import { ContestActivity } from "@/domain/ContestActivity.schema";

interface UseContestUserDetailsReturn {
  isLoading: boolean;
  error: Error | null;
  tracks: Track[];
  activities: ContestActivity[];
  setActivities: (activities: ContestActivity[]) => void;
  fetchDetails: (contestId: number, contestUserId: number) => Promise<void>;
}

export const useContestUserDetails = (): UseContestUserDetailsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activities, setActivities] = useState<ContestActivity[]>([]);

  const fetchDetails = async (contestId: number, contestUserId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await getContestUserDetails(contestId, contestUserId);
      setTracks(details.tracks);
      setActivities(details.activities);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch contest user details'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    tracks,
    activities,
    setActivities,
    fetchDetails,
  };
}; 