'use client'
import TrackCard from "./TrackCard";
import { Track } from "../../domain/Track.schema";
import { useEffect, useState } from "react";
import { useFetchTracks } from "@/lib/tracks/hooks/useFetchTracks";
import { CardPlaceHolder } from "../ui/CardPlacehorlder";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import TrackFilters from "../filters/TrackFilters";
import { Filters } from "@/domain/Filters";
import { isOpener } from "@/utils/session.utils";
import { Button } from "../ui/Button";
import { useSession } from "next-auth/react";
import TrackBulkRemove from "./TrackBulkRemove";

type TracksProps = {
  userId: string;
};

const TrackList: React.FC<TracksProps> = ({ userId }) => {
  const session = useSession();
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [selectedShowRemoved, setSelectedShowRemoved] = useState<string>();
  const [selectedHoldColor, setSelectedHoldColor] = useState<string>();
  const { fetchTracks, isLoading, error } = useFetchTracks();
  const currentUrlParams = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

  useEffect(() => {
    const getTracks = async (filters: Filters) => {
      const tracks = await fetchTracks(userId, filters);
      setTrackList(tracks);
    };
    // Parse URL query parameters to get filter
    const zones = searchParams.has('zones') ? searchParams.get('zones')?.split(',').map(Number) as number[] : [] as number[];
    const difficulties = searchParams.has('difficulties') ? searchParams.get('difficulties')?.split(',') as string[] : [] as string[];
    const showRemoved = searchParams.has('showRemoved') ? searchParams.get('showRemoved') as string : undefined;
    const holdColor = searchParams.has('holdColor') ? searchParams.get('holdColor') as string : undefined;
    const filters = { zones, difficulties, showRemoved, holdColor };
    setSelectedZones(zones);
    setSelectedDifficulties(difficulties);
    setSelectedShowRemoved(showRemoved);
    setSelectedHoldColor(holdColor);
    getTracks(filters);
  }, [userId, searchParams]);

  const updateFiltersInURL = (zones: any[], difficulties: any[], showRemoved: string | undefined, holdColor: string | undefined) => {
    currentUrlParams.delete('zones');
    currentUrlParams.delete('difficulties');
    currentUrlParams.delete('showRemoved');
    currentUrlParams.delete('holdColor');
    if (zones.length > 0) {
      currentUrlParams.set('zones', zones.join(','));
    }
    if (difficulties.length > 0) {
      currentUrlParams.set('difficulties', difficulties.join(','));
    }
    if (showRemoved) {
      currentUrlParams.set('showRemoved', showRemoved);
    }
    if (holdColor) {
      currentUrlParams.set('holdColor', holdColor);
    }

    const search = currentUrlParams.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handleZoneChange = (selectedOptions: { value: any; }[]) => {
    const zones = selectedOptions.map((option: { value: any; }) => option.value);
    setSelectedZones(zones);
    updateFiltersInURL(zones, selectedDifficulties, selectedShowRemoved, selectedHoldColor);
  };

  const handleDifficultyChange = (selectedOptions: { value: any; }[]) => {
    const difficulties = selectedOptions.map((option: { value: any; }) => option.value);
    setSelectedDifficulties(difficulties);
    updateFiltersInURL(selectedZones, difficulties, selectedShowRemoved, selectedHoldColor);
  };

  const handleShowRemovedChange = (selectedOptions: any) => {
    const showRemoved = selectedOptions?.value as string | undefined;
    setSelectedShowRemoved(showRemoved);
    updateFiltersInURL(selectedZones, selectedDifficulties, showRemoved, selectedHoldColor);
  };

  const handleHoldColorChange = (selectedOptions: any) => {
    const holdColor = selectedOptions?.value as string | undefined;
    setSelectedHoldColor(holdColor);
    updateFiltersInURL(selectedZones, selectedDifficulties, selectedShowRemoved, holdColor);
  };

  const handleRemoveAllSuccess = () => {
    const removedTrackList = trackList.map(track => ({ ...track, removed: true }));
    setTrackList(removedTrackList);
  }

  return (
    <div className="space-y-2 w-full max-w-3xl mt-4">
      {
        isOpener(session.data) && (
          <div className="w-full flex justify-between">
            <Button onClick={() => router.push('/opener/create')}>Create new Block</Button>
            <TrackBulkRemove trackList={trackList} onRemoveAllSuccess={() => handleRemoveAllSuccess()}/>
          </div>
        )
      }
      <TrackFilters
        selectedZones={selectedZones}
        selectedDifficulties={selectedDifficulties}
        selectedShowRemoved={selectedShowRemoved}
        selectedHoldColor={selectedHoldColor}
        onZoneChange={handleZoneChange}
        onDifficultyChange={handleDifficultyChange}
        onShowRemovedChange={handleShowRemovedChange}
        onHoldColorChange={handleHoldColorChange}
      />
      <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
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