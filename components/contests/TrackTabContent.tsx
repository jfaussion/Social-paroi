import React, { useState } from 'react';
import { Track } from '@/domain/Track.schema';
import TrackCard from '../tracks/TrackCard';
import { Button } from '../ui/Button';
import { FaPlus } from 'react-icons/fa';
import Popin from '../ui/Popin';
import AddTrackCard from '../tracks/AddTrackCard';
import { useFetchCotnestTracks as useFetchContestTracks } from '@/lib/tracks/hooks/useFetchContestTracks';
import { CardPlaceHolder } from '../ui/CardPlacehorlder';
import { useManageContestTracks } from '@/lib/contests/hooks/useManageContestTracks';
import ContestTrackCard from './ContestTrackCard';
import { ContestUser } from '@/domain/ContestUser.schema';

interface TrackTabContentProps {
  contestTracks: Track[];
  isOpener: boolean;
  contestId: number;
  contestUser: ContestUser | undefined;
  onAddTrack: (trackToAdd: Track) => void; // Callback to handle adding a track
  onRemoveTrack: (trackToRemove: Track) => void; // Callback to handle removing a track
}

const TrackTabContent: React.FC<TrackTabContentProps> = ({ contestTracks, isOpener, contestId, contestUser, onAddTrack, onRemoveTrack }) => {
  const [isPopinOpen, setPopinOpen] = useState<boolean>(false);
  const { fetchTracks, isLoading: isLoadingTracks, error: fetchError } = useFetchContestTracks();
  const [tracks, setTracks] = useState<Track[]>([]);
  const { addTrack, removeTrack, isLoading: isLoadingAddOrRemove, error: manageError } = useManageContestTracks();

  const handleAddTrack = async (trackToAdd: Track) => {
    const success = await addTrack(contestId, trackToAdd.id);
    if (success) {
      onAddTrack(trackToAdd);
    }
  };

  const handleRemoveTrack = async (trackToRemove: Track) => {
    const success = await removeTrack(contestId, trackToRemove.id);
    if (success) {
      onRemoveTrack(trackToRemove);
    }
  };

  const loadTracks = async () => {
    const fetchedTracks = await fetchTracks(contestId, {}); // Assuming filters are not needed for now
    setTracks(fetchedTracks);
  };

  return (
    <div className="space-y-2">
      {contestTracks.length === 0 ? (
        <p>No blocks yet</p>
      ) : (
        contestTracks.map(track => (
          <div key={track.id}>
            <ContestTrackCard {...track} contestId={contestId} contestUser={contestUser} />
          </div>
        ))
      )}
      {isOpener && (
        <Button onClick={() => { setPopinOpen(true); loadTracks(); }} className="mt-4 w-full flex items-center">
          <span className="flex items-center justify-center mr-2">
            <FaPlus className="text-gray-600 dark:text-gray-300" />
          </span>
          Add More Blocks
        </Button>
      )}

      {/* Popin for adding tracks */}
      <Popin isOpen={isPopinOpen} onClose={() => setPopinOpen(false)} title="Add More Blocks">
        <div className="p-4">
          {isLoadingTracks ? (
            <div className="space-y-2">
              <CardPlaceHolder />
              <CardPlaceHolder />
              <CardPlaceHolder />
            </div>
          ) : tracks.length === 0 ? (
            <p>No tracks available.</p>
          ) : (
            <div className="space-y-2">
              {tracks.map(track => (
                <AddTrackCard key={track.id} track={track} trackList={contestTracks}
                  addTrack={handleAddTrack} removeTrack={handleRemoveTrack} />
              ))}
            </div>
          )}
        </div>
      </Popin>
    </div>
  );
};

export default TrackTabContent; 