"use client";
import React from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track } from '../../domain/Track.schema';
import placeholderImage from '@/public/bouldering-placeholder.jpeg';
import { Zone } from '../Zone';
import AddButton from '../ui/AddButton';
import { getBorderColorForDifficulty } from '@/utils/difficulty.utils';

interface AddTrackCardProps {
  track: Track;
  trackList: Track[];
  addTrack: (track: Track) => void;
  removeTrack: (track: Track) => void;
}

const AddTrackCard: React.FC<AddTrackCardProps> = ({ track, trackList, addTrack, removeTrack }) => {
  const levelBorderColor = getBorderColorForDifficulty(track.level);

  const handleAddOrRemoveTrack = () => {
    if (isTrackAlreadyAdded) {
      removeTrack(track);
    } else {
      addTrack(track);
    }
  };

  const isTrackAlreadyAdded = trackList.some(t => t.id === track.id);

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 relative rounded-full overflow-hidden border-4 ${levelBorderColor}`}>
            {track.imageUrl?.split(' ')[0] ? (
              <CldImage
                width="400"
                height="400"
                src={track.imageUrl?.split(' ')[0]}
                crop="thumb"
                improve="indoor"
                gravity='center'
                alt="Climbing Track" />
            ) : (
              <Image src={placeholderImage} alt="Climbing Track - place holder" width={10} height={5} />
            )}
          </div>
        </div>
        <div className='w-full'>
          <h4 className="text-md font-semibold dark:text-white">{track.name}</h4>
          <div className="flex justify-between items-center mt-2">
            <Zone zone={track.zone} width={60} height={50} />
            <AddButton isActive={isTrackAlreadyAdded} isLoading={false} onChange={handleAddOrRemoveTrack} style='small' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTrackCard;
