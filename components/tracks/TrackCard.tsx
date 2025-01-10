"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track } from '../../domain/Track.schema';
import placeholderImage from '@/public/bouldering-placeholder.jpeg';
import { useRouter } from 'next/navigation';
import ToggleButton from '../ui/ToggleButton';
import RemovedLabel from '../ui/RemovedLabel';
import { getBorderColorForDifficulty } from '@/utils/difficulty.utils';
import { Zone } from '../Zone';
import { TrackStatusHandler } from '@/domain/TrackStatusHandler.type';

interface TrackCardProps extends Track {
  statusHandler?: TrackStatusHandler
  disableNavigation?: boolean
  hideToggleButton?: boolean
}

const TrackCard: React.FC<TrackCardProps> = ({ statusHandler, disableNavigation = false, hideToggleButton = false, ...propTrack }) => {
  const [track, setTrack] = useState<Track>(propTrack);
  const levelBorderColor = getBorderColorForDifficulty(track.level);
  const router = useRouter();
  const prevPropTrackRef = useRef<Track | null>(propTrack);

  useEffect(() => {
    if (hasTrackChanged(propTrack, prevPropTrackRef.current)) {
      setTrack(propTrack);
      prevPropTrackRef.current = propTrack;
    }
  }, [propTrack]);

  const hasTrackChanged = (newTrack: Track, prevTrack: Track | null) => {
    return Object.keys(newTrack).some(key => newTrack[key as keyof Track] !== prevTrack?.[key as keyof Track]);
  };

  const openTrackDetails = () => {
    if (disableNavigation) return;
    router.push(`/dashboard/track/${track.id}`);
  }

  return (
    <div onClick={openTrackDetails} className={`flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 ${!disableNavigation ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 relative rounded-full overflow-hidden border-4 ${levelBorderColor}`}>
            {track.imageUrl?.split(' ')[0] ?
              <CldImage
                width="400"
                height="400"
                src={track.imageUrl?.split(' ')[0]}
                crop="thumb"
                improve="indoor"
                gravity='center'
                alt="Climbing Track" />
              :
              <Image src={placeholderImage} alt="Climbing Track - place holder" width={10} height={5} />}
          </div>
        </div>
        <div className='w-full'>
          <h4 className="text-md font-semibold dark:text-white">{track.name}</h4>
          <div className="flex justify-between items-center mt-2">
            <div className="inline-flex items-center space-x-2">
              <Zone zone={track.zone} width={60} height={50}/>
              {track.removed && (
                <RemovedLabel/>
              )}
            </div>
            {statusHandler && !hideToggleButton && (
              <span onClick={(e) => e.stopPropagation()}>
                <ToggleButton 
                  isActive={statusHandler.isCompleted} 
                  isDisabled={statusHandler.isDisabled ?? false} 
                  onChange={statusHandler.onStatusChange} 
                  style='small' 
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
