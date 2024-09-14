'use client'

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import ConfirmationDialog from '../ui/ConfirmDialog';
import { Track } from '@/domain/Track.schema';
import { useChangeMountedTrackStatus } from '@/lib/tracks/hooks/useChangeMountedTrackStatus';

type TrackBulkRemoveProps = {
  trackList: Track[];
  onRemoveAllSuccess: () => void;
};

const TrackBulkRemove: React.FC<TrackBulkRemoveProps> = ({ trackList, onRemoveAllSuccess }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { changeMountedTrackStatus, isLoading, error } = useChangeMountedTrackStatus();

  const handleRemoveAll = async () => {
    const trackIds = trackList.map(track => track.id);
    const success = await changeMountedTrackStatus(trackIds, true);
    if (success) {
      setIsDialogOpen(false);
      onRemoveAllSuccess();
    }
  };

  return (
    <>
      <Button btnStyle="secondary" onClick={() => setIsDialogOpen(true)}>
        Remove All Blocks
      </Button>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Removal"
        text={`Are you sure you want to mark as removed all ${trackList.length} selected blocks?`}
        onConfirm={handleRemoveAll}
        onCancel={() => setIsDialogOpen(false)}
        error={error ?? undefined}
        isLoading={isLoading}
        loadingMessage="Removing all blocks..."
      />
    </>
  );
};

export default TrackBulkRemove;