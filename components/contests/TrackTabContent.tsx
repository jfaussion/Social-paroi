import React, { useState } from 'react';
import { Track } from '@/domain/Track.schema';
import { Button } from '../ui/Button';
import { FaPencilAlt } from 'react-icons/fa';
import Popin from '../ui/Popin';
import AddTrackCard from '../tracks/AddTrackCard';
import { useFetchContestTracks } from '@/lib/tracks/hooks/useFetchContestTracks';
import { CardPlaceHolder } from '../ui/CardPlacehorlder';
import { useManageContestTracks } from '@/lib/contests/hooks/useManageContestTracks';
import ContestTrackCard from './ContestTrackCard';
import { Contest } from '@/domain/Contest.schema';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';

interface TrackTabContentProps {
  contest: Contest;
  isOpener: boolean;
  userId?: string;
  onAddTrack: (trackToAdd: Track) => void;
  onRemoveTrack: (trackToRemove: Track) => void;
  onStatusUpdate: (trackId: number, newStatus: TrackStatus) => void;
}

const TrackTabContent: React.FC<TrackTabContentProps> = ({ contest, isOpener: isOpenerProp, userId, onAddTrack, onRemoveTrack, onStatusUpdate }) => {
  const [isPopinOpen, setPopinOpen] = useState<boolean>(false);
  const { fetchTracks, isLoading: isLoadingTracks, error: fetchError } = useFetchContestTracks();
  const [tracks, setTracks] = useState<Track[]>([]);
  const { addTrack, removeTrack, isLoading: isLoadingAddOrRemove, error: manageError } = useManageContestTracks();

  const contestUser = contest.users.find(contestUser => contestUser.user?.id === userId);
  const isSelfContester = contestUser && userId === contestUser.user?.id;
  const isSelfAndInProgress = isSelfContester && contest.status === ContestStatusEnum.Enum.InProgress;

  const handleAddTrack = async (trackToAdd: Track) => {
    const success = await addTrack(contest.id, trackToAdd.id);
    if (success) {
      onAddTrack(trackToAdd);
    }
  };

  const handleRemoveTrack = async (trackToRemove: Track) => {
    const success = await removeTrack(contest.id, trackToRemove.id);
    if (success) {
      onRemoveTrack(trackToRemove);
    }
  };

  const loadTracks = async () => {
    const fetchedTracks = await fetchTracks(contest.id, {}, contest.locationId ?? 0);
    setTracks(fetchedTracks);
  };

  const renderPopinAddTrackContent = () => {
    if (isLoadingTracks) {
      return (
        <div className="space-y-2">
          <CardPlaceHolder />
          <CardPlaceHolder />
          <CardPlaceHolder />
        </div>
      );
    } else if (tracks.length === 0) {
      return <p>No tracks available.</p>;
    } else {
      return (
        <div className="space-y-2">
          {tracks.map(track => (
            <AddTrackCard key={track.id} track={track} trackList={contest.tracks}
              addTrack={handleAddTrack} removeTrack={handleRemoveTrack} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-2">
      {contest.tracks.length === 0 ? (
        <p>No blocks yet</p>
      ) : (
        contest.tracks.map(track => (
          <div key={track.id}>
            <ContestTrackCard
              {...track}
              contest={contest}
              contestUser={contestUser}
              onStatusUpdate={onStatusUpdate}
              canUpdateTrackStatus={!!isSelfAndInProgress}
            />
          </div>
        ))
      )}
      {isOpenerProp && (
        <Button onClick={() => { setPopinOpen(true); loadTracks(); }} className="mt-4 w-full flex items-center">
          <span className="flex items-center justify-center mr-2">
            <FaPencilAlt className="text-gray-600 dark:text-gray-300" />
          </span>
          {' Manage Blocks'}
        </Button>
      )}

      {/* Popin for adding tracks */}
      <Popin isOpen={isPopinOpen} onClose={() => setPopinOpen(false)} title="Manage Blocks">
        <div className="p-4">
          {renderPopinAddTrackContent()}
        </div>
      </Popin>
    </div>
  );
};

export default TrackTabContent;
