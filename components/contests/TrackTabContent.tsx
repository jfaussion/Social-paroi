import React, { useState } from 'react';
import { Track } from '@/domain/Track.schema';
import TrackCard from '../tracks/TrackCard';
import { Button } from '../ui/Button';
import { FaPlus } from 'react-icons/fa';
import Popin from '../ui/Popin';
import AddTrackCard from '../tracks/AddTrackCard';
import { useFetchCotnestTracks } from '@/lib/tracks/hooks/useFetchContestTracks';
import Loader from '../ui/Loader';
import { CardPlaceHolder } from '../ui/CardPlacehorlder';

interface TrackTabContentProps {
  contestTracks: Track[];
  isOpener: boolean;
  contestId: number;
  onAddTrack: (trackToAdd: Track) => void; // Callback to handle adding a track
  onRemoveTrack: (trackToRemove: Track) => void; // Callback to handle removing a track
}

const TrackTabContent: React.FC<TrackTabContentProps> = ({ contestTracks, isOpener, contestId, onAddTrack, onRemoveTrack }) => {
  const [isPopinOpen, setPopinOpen] = useState<boolean>(false);
  const { fetchTracks, isLoading: isLoadingTracks, error } = useFetchCotnestTracks();
  const [tracks, setTracks] = useState<Track[]>([]);

  const handleAddTrack = (trackToAdd: Track) => {
    onAddTrack(trackToAdd);
  };

  const handleRemoveTrack = (trackToRemove: Track) => {
    onRemoveTrack(trackToRemove);
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
            <TrackCard {...track} />
          </div>
        ))
      )}
      {isOpener && (
        <Button onClick={() => {setPopinOpen(true); loadTracks();}} className="mt-4 w-full flex items-center">
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
                <AddTrackCard key={track.id} track={track} trackList={contestTracks} addTrack={handleAddTrack} removeTrack={handleRemoveTrack} />
              ))}
            </div>
          )}
        </div>
      </Popin>
    </div>
  );
};

export default TrackTabContent; 