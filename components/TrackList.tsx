'use client'
import TrackCard from "./TrackCard";
import { Track } from "../domain/TrackSchema";
import { useEffect, useState } from "react";
import { useFetchTracks } from "@/lib/useFetchTracks";
import { CardPlaceHolder } from "./ui/CardPlacehorlder";
import DifficultyFilter from "./DifficultyFilter";
import ZoneFilter from "./ZoneFilter";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ShowRemovedFilter from "./ShowRemovedFilter";

type TracksProps = {
  userId: string;
};

const TrackList: React.FC<TracksProps> = ({ userId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [selectedShowRemoved, setSelectedShowRemoved] = useState<string>();
  const { fetchTracks, isLoading, error } = useFetchTracks();
  const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

  useEffect(() => {
    const getTracks = async (zones: number[] | undefined, difficulties: string[] | undefined, showRemoved: string | undefined) => {
      const tracks = await fetchTracks(userId, zones, difficulties, showRemoved);
      setTrackList(tracks);
    };
    // Parse URL query parameters to get filter
    const zones = searchParams.has('zones') ? searchParams.get('zones')?.split(',').map(Number) as number[] : [] as number[];
    const difficulties = searchParams.has('difficulties') ? searchParams.get('difficulties')?.split(',') as string[] : [] as string[];
    const showRemoved = searchParams.has('showRemoved') ? searchParams.get('showRemoved') as string : undefined;
    setSelectedZones(zones);
    setSelectedDifficulties(difficulties);
    setSelectedShowRemoved(showRemoved);
    getTracks(zones, difficulties, showRemoved);
  }, [userId, searchParams]);

  const updateFiltersInURL = (zones: any[], difficulties: any[], showRemoved: string | undefined) => {
    current.delete('zones');
    current.delete('difficulties');
    current.delete('showRemoved');
    if (zones.length > 0) {
      current.set('zones', zones.join(','));
    }
    if (difficulties.length > 0) {
      current.set('difficulties', difficulties.join(','));
    }
    if (showRemoved) {
      current.set('showRemoved', showRemoved);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handleZoneChange = (selectedOptions: { value: any; }[]) => {
    const zones = selectedOptions.map((option: { value: any; }) => option.value);
    setSelectedZones(zones);
    updateFiltersInURL(zones, selectedDifficulties, selectedShowRemoved);
  };

  const handleDifficultyChange = (selectedOptions: { value: any; }[]) => {
    const difficulties = selectedOptions.map((option: { value: any; }) => option.value);
    setSelectedDifficulties(difficulties);
    updateFiltersInURL(selectedZones, difficulties, selectedShowRemoved);
  };

  const handleShowRemovedChange = (selectedOptions: any) => {
    const showRemoved = selectedOptions?.value as string | undefined;
    setSelectedShowRemoved(showRemoved);
    updateFiltersInURL(selectedZones, selectedDifficulties, showRemoved);
  };


  return (
    <div className="space-y-4 w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <ZoneFilter selectedFilters={selectedZones}
          onChange={handleZoneChange} />
        <DifficultyFilter selectedFilters={selectedDifficulties}
          onChange={handleDifficultyChange} />
        <ShowRemovedFilter selectedFilters={selectedShowRemoved}
          onChange={handleShowRemovedChange} />
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