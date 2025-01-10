"use client";
import { Track } from "@/domain/Track.schema";
import { TrackStatus } from "@/domain/TrackStatus.enum";
import TrackCard from "../tracks/TrackCard";
import { useUpdateContestTrackStatus } from "@/lib/contests/hooks/useUpdateContestTrackStatus";
import { ContestUser } from "@/domain/ContestUser.schema";
import { useSession } from "next-auth/react";
import { isOpener } from "@/utils/session.utils";

interface ContestTrackCardProps extends Track {
  contestId: number;
  contestUser: ContestUser | undefined;
}

const ContestTrackCard: React.FC<ContestTrackCardProps> = ({ contestId, contestUser, ...track }) => {
  const { updateStatus, isLoading } = useUpdateContestTrackStatus();
  const { data: session } = useSession();

  const isSelfContester = contestUser && session?.user?.id === contestUser.user?.id;
  const isActiveStatusChange = isSelfContester || isOpener(session);

  const handleStatusChange = async () => {
    const newStatus = track.contestProgress?.status === TrackStatus.DONE 
      ? TrackStatus.TO_DO 
      : TrackStatus.DONE;

    await updateStatus(contestId, contestUser?.id ?? 0, track.id, newStatus);
  };

  const statusHandler = {
    isCompleted: track.contestProgress?.status === TrackStatus.DONE,
    isDisabled: isLoading || !contestUser,
    onStatusChange: handleStatusChange
  };

  return <TrackCard {...track} statusHandler={statusHandler} disableNavigation hideToggleButton={!contestUser}/>;
};

export default ContestTrackCard; 