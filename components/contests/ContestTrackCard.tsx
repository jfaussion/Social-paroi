"use client";
import { Track } from "@/domain/Track.schema";
import { TrackStatus } from "@/domain/TrackStatus.enum";
import TrackCard from "../tracks/TrackCard";
import { useUpdateContestTrackStatus } from "@/lib/contests/hooks/useUpdateContestTrackStatus";
import { ContestUser } from "@/domain/ContestUser.schema";
import { Contest } from "@/domain/Contest.schema";
import { useState } from "react";

interface ContestTrackCardProps extends Track {
  contest: Contest;
  contestUser: ContestUser | undefined;
  canUpdateTrackStatus: boolean;
  disableNavigation?: boolean;
  onStatusUpdate?: (trackId: number, newStatus: TrackStatus) => void;
}

const ContestTrackCard: React.FC<ContestTrackCardProps> = ({ contest, contestUser, onStatusUpdate, canUpdateTrackStatus, disableNavigation, ...track }) => {
  const { updateStatus, isLoading } = useUpdateContestTrackStatus();
  const [localStatus, setLocalStatus] = useState<TrackStatus | undefined>(
    track.contestProgress?.status
  );

  const handleStatusChange = async () => {
    const newStatus = localStatus === TrackStatus.DONE 
      ? TrackStatus.TO_DO 
      : TrackStatus.DONE;

    const success = await updateStatus(contest.id, contestUser?.id ?? 0, track.id, newStatus);
    
    if (success) {
      setLocalStatus(newStatus);
      onStatusUpdate?.(track.id, newStatus);
    }
  };
  
  const statusHandler = {
    isCompleted: localStatus === TrackStatus.DONE,
    isDisabled: isLoading || !canUpdateTrackStatus,
    onStatusChange: handleStatusChange
  };

  return <TrackCard {...track} statusHandler={statusHandler} hideToggleButton={!contestUser} disableNavigation={disableNavigation} trackList={contest.tracks}/>;
};

export default ContestTrackCard; 