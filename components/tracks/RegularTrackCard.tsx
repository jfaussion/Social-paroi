"use client";
import { Track } from "@/domain/Track.schema";
import { TrackStatus } from "@/domain/TrackStatus.enum";
import { useUpdateTrackProgress } from "@/lib/tracks/hooks/useUpdateTrackProgress";
import { useSession } from "next-auth/react";
import TrackCard from "./TrackCard";
import { useState } from "react";

const RegularTrackCard: React.FC<Track> = (track) => {
  const { updateTrackStatus, isLoading } = useUpdateTrackProgress();
  const { data: session } = useSession();
  const [localStatus, setLocalStatus] = useState<TrackStatus | undefined>(
    track.trackProgress?.status
  );

  const handleStatusChange = async () => {
    if (!session?.user?.id) return;
    
    const newStatus = localStatus === TrackStatus.DONE 
      ? TrackStatus.TO_DO 
      : TrackStatus.DONE;

    const success = await updateTrackStatus(track.id, session?.user?.id ?? '', newStatus);
    
    if (success) {
      setLocalStatus(newStatus);
    }
  };

  const statusHandler = {
    isCompleted: localStatus === TrackStatus.DONE,
    isDisabled: isLoading,
    onStatusChange: handleStatusChange
  };

  return <TrackCard {...track} statusHandler={statusHandler} hideToggleButton={!session?.user?.id}/>;
};

export default RegularTrackCard; 