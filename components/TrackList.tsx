'use client'
import TrackCard from "./TrackCard";
import { Track } from "../domain/TrackSchema";
import { useEffect, useState } from "react";
import { usefetchTracks } from "@/app/lib/featchTracksHook";
import { CardPlaceHolder } from "./ui/CardPlacehorlder";

type TracksProps = {
  userId: string;
};

const TrackList: React.FC<TracksProps> = ({ userId }) => {
  const [trackList, setTrackList] = useState<Track[]>([]);
  const { fetchTracks, isLoading, error } = usefetchTracks();

  useEffect(() => {
    const getTracks = async () => {
      const tracks = await fetchTracks(parseInt(userId));
      setTrackList(tracks);
    };

    getTracks();
  }, [userId]);

  return (
    <div className="space-y-4 w-full max-w-3xl">
      {isLoading ? (
        <>
          <CardPlaceHolder />
          <CardPlaceHolder />
          <CardPlaceHolder />
        </>
      ) : (
        trackList.map((track: Track) => (
          <TrackCard key={track.id} {...track} />
        ))
      )}
    </div>
  );
};

export default TrackList;