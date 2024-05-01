'use client'
import TrackCard from "./TrackCard";
import { Track } from "../domain/Track.schema";
import { useEffect, useState } from "react";
import { useFetchTracks } from "@/lib/useFetchTracks";
import { CardPlaceHolder } from "./ui/CardPlacehorlder";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import TrackFilters from "./filters/TrackFilters";

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
  const currentUrlParams = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

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
    currentUrlParams.delete('zones');
    currentUrlParams.delete('difficulties');
    currentUrlParams.delete('showRemoved');
    if (zones.length > 0) {
      currentUrlParams.set('zones', zones.join(','));
    }
    if (difficulties.length > 0) {
      currentUrlParams.set('difficulties', difficulties.join(','));
    }
    if (showRemoved) {
      currentUrlParams.set('showRemoved', showRemoved);
    }

    const search = currentUrlParams.toString();
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
      <TrackFilters
        selectedZones={selectedZones}
        selectedDifficulties={selectedDifficulties}
        selectedShowRemoved={selectedShowRemoved}
        onZoneChange={handleZoneChange}
        onDifficultyChange={handleDifficultyChange}
        onShowRemovedChange={handleShowRemovedChange}
      />
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