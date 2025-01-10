"use client";
import { Track } from "@/domain/Track.schema";
import { TrackStatus } from "@/domain/TrackStatus.enum";
import { useUpdateTrackProgress } from "@/lib/tracks/hooks/useUpdateTrackProgress";
import { useSession } from "next-auth/react";
import TrackCard from "./TrackCard";

const RegularTrackCard: React.FC<Track> = (track) => {
  const { updateTrackStatus, isLoading } = useUpdateTrackProgress();
  const session = useSession();

  const handleStatusChange = async () => {
    if (!session.data?.user?.id) return;
    
    const newStatus = track.trackProgress?.status === TrackStatus.DONE 
      ? TrackStatus.TO_DO 
      : TrackStatus.DONE;

    await updateTrackStatus(track.id, session.data.user.id, newStatus);
  };

  const statusHandler = {
    isCompleted: track.trackProgress?.status === TrackStatus.DONE,
    isDisabled: isLoading,
    onStatusChange: handleStatusChange
  };

  return <TrackCard {...track} statusHandler={statusHandler} />;
};

export default RegularTrackCard; 