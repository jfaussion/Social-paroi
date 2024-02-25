'useclient'
import TrackCard from "./TrackCard";
import { Track } from "../domain/TrackSchema";
import { useEffect, useState } from "react";
import { getAllTracksForUser } from "../app/lib/actions";

type TracksProps = {
  userId: string;
};

const TrackList: React.FC<TracksProps> = ({ userId }) => {
  const [trackList, setTrackList] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const tracks = await getAllTracksForUser(parseInt(userId));
      setTrackList(tracks);
    };

    fetchTracks();
  }, [userId]); // Re-fetch when userId changes

  return (
    <div className="space-y-4">
      {trackList.map((track) => (
        <TrackCard key={track.id} {...track} />
      ))}
    </div>
  );
};

export default TrackList;