'use client'
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
import RegularTrackCard from "./RegularTrackCard";

type TracksProps = {
  userId: string;
  locationId: number;
  zones: Array<{ id: number; name: string }>;
  isMember: boolean;
};

const TrackList: React.FC<TracksProps> = ({ userId, locationId, zones, isMember }) => {
  const session = useSession();
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locationSlug = pathname.split('/')[1] ?? '';
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [selectedDifficultyIds, setSelectedDifficultyIds] = useState<number[]>([]);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [selectedShowRemoved, setSelectedShowRemoved] = useState<string>();
  const [selectedHoldColor, setSelectedHoldColor] = useState<string>();
  const { fetchTracks, isLoading, error } = useFetchTracks();
  const currentUrlParams = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

  useEffect(() => {
    const getTracks = async (filters: Filters) => {
      const tracks = await fetchTracks(userId, filters, locationId);
      setTrackList(tracks);
    };
    // Parse URL query parameters to get filter
    const zones = searchParams.has('zones') ? searchParams.get('zones')?.split(',').map(Number) as number[] : [] as number[];
    const difficultyIds = searchParams.has('difficultyIds') ? searchParams.get('difficultyIds')?.split(',').map(Number) as number[] : [] as number[];
    const showRemoved = searchParams.has('showRemoved') ? searchParams.get('showRemoved') as string : undefined;
    const holdColor = searchParams.has('holdColor') ? searchParams.get('holdColor') as string : undefined;
    const filters = { zones, difficultyIds, showRemoved, holdColor };
    setSelectedZones(zones);
    setSelectedDifficultyIds(difficultyIds);
    setSelectedShowRemoved(showRemoved);
    setSelectedHoldColor(holdColor);
    getTracks(filters);
  }, [userId, locationId, searchParams]);

  const updateFiltersInURL = (zones: any[], difficultyIds: any[], showRemoved: string | undefined, holdColor: string | undefined) => {
    currentUrlParams.delete('zones');
    currentUrlParams.delete('difficultyIds');
    currentUrlParams.delete('showRemoved');
    currentUrlParams.delete('holdColor');
    if (zones.length > 0) {
      currentUrlParams.set('zones', zones.join(','));
    }
    if (difficultyIds.length > 0) {
      currentUrlParams.set('difficultyIds', difficultyIds.join(','));
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
    updateFiltersInURL(zones, selectedDifficultyIds, selectedShowRemoved, selectedHoldColor);
  };

  const handleDifficultyChange = (selectedOptions: { value: any; }[]) => {
    const difficultyIds = selectedOptions.map((option: { value: any; }) => option.value);
    setSelectedDifficultyIds(difficultyIds);
    updateFiltersInURL(selectedZones, difficultyIds, selectedShowRemoved, selectedHoldColor);
  };

  const handleShowRemovedChange = (selectedOptions: any) => {
    const showRemoved = selectedOptions?.value as string | undefined;
    setSelectedShowRemoved(showRemoved);
    updateFiltersInURL(selectedZones, selectedDifficultyIds, showRemoved, selectedHoldColor);
  };

  const handleHoldColorChange = (selectedOptions: any) => {
    const holdColor = selectedOptions?.value as string | undefined;
    setSelectedHoldColor(holdColor);
    updateFiltersInURL(selectedZones, selectedDifficultyIds, selectedShowRemoved, holdColor);
  };

  const handleRemoveAllSuccess = () => {
    const removedTrackList = trackList.map(track => ({ ...track, removed: true }));
    setTrackList(removedTrackList);
  }

  const isRemoveDisabled = () => {
    return trackList.length === 0
      || !!selectedShowRemoved
      || (selectedZones.length === 0 && selectedDifficultyIds.length === 0 && !selectedHoldColor);
  };

  return (
    <div className="space-y-2 w-full max-w-3xl mt-4">
      {
        isOpener(session.data) && (
          <div className="w-full flex justify-between">
            <Button onClick={() => router.push(`/${locationSlug}/opener/create`)}>Create new Block</Button>
            <TrackBulkRemove trackList={trackList} isRemoveDisabled={isRemoveDisabled()} onRemoveAllSuccess={() => handleRemoveAllSuccess()}/>
          </div>
        )
      }
      <TrackFilters
        zones={zones}
        selectedZones={selectedZones}
        selectedDifficulties={selectedDifficultyIds}
        selectedShowRemoved={selectedShowRemoved}
        selectedHoldColor={selectedHoldColor}
        locationId={locationId}
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
          <RegularTrackCard key={track.id} {...track} trackList={trackList} isMember={isMember} />
        ))
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default TrackList;