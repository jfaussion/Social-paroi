'use client'
import TrackCard from "./TrackCard";
import { Track } from "../domain/TrackSchema";
import { useEffect, useState } from "react";
import { useFetchTracks } from "@/lib/featchTracksHook";
import { CardPlaceHolder } from "./ui/CardPlacehorlder";
import DifficultyFilter from "./DifficultyFilter";
import ZoneFilter from "./ZoneFilter";

type TracksProps = {
  userId: string;
};

const TrackList: React.FC<TracksProps> = ({ userId }) => {
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const { fetchTracks, isLoading, error } = useFetchTracks();

  useEffect(() => {
    const getTracks = async () => {
      const tracks = await fetchTracks(userId, selectedZones, selectedDifficulties);
      setTrackList(tracks);
    };

    getTracks();
  }, [userId, selectedZones, selectedDifficulties]);

  return (
    <div className="space-y-4 w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <ZoneFilter selectedFilters={selectedZones}
          onChange={(selectedOptions: any[]) => setSelectedZones(selectedOptions.map((option: { value: any; }) => option.value))} />
        <DifficultyFilter selectedFilters={selectedDifficulties}
          onChange={(selectedOptions: any[]) => setSelectedDifficulties(selectedOptions.map((option: { value: any; }) => option.value))} />
      </div>
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
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default TrackList;