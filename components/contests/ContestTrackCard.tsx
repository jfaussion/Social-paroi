"use client";
import { Track } from "@/domain/Track.schema";
import { TrackStatus } from "@/domain/TrackStatus.enum";
import TrackCard from "../tracks/TrackCard";
import { useUpdateContestTrackStatus } from "@/lib/contests/hooks/useUpdateContestTrackStatus";
import { ContestUser } from "@/domain/ContestUser.schema";
import { useSession } from "next-auth/react";
import { isOpener } from "@/utils/session.utils";
import { Contest } from "@/domain/Contest.schema";
import { ContestStatusEnum } from "@/domain/ContestStatus.enum";
import { useState } from "react";

interface ContestTrackCardProps extends Track {
  contest: Contest;
  contestUser: ContestUser | undefined;
  onStatusUpdate?: (trackId: number, newStatus: TrackStatus) => void;
}

const ContestTrackCard: React.FC<ContestTrackCardProps> = ({ contest, contestUser, onStatusUpdate, ...track }) => {
  const { updateStatus, isLoading } = useUpdateContestTrackStatus();
  const { data: session } = useSession();
  const [localStatus, setLocalStatus] = useState<TrackStatus | undefined>(
    track.contestProgress?.status
  );

  const isSelfContester = contestUser && session?.user?.id === contestUser.user?.id;
  const isActiveStatusChange = isSelfContester || isOpener(session);

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
    isDisabled: isLoading || !contestUser || contest.status === ContestStatusEnum.Enum.Over,
    onStatusChange: handleStatusChange
  };

  return <TrackCard {...track} statusHandler={statusHandler} hideToggleButton={!contestUser}/>;
};

export default ContestTrackCard; 