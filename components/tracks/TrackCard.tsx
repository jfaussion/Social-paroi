"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track } from '../../domain/Track.schema';
import { useUpdateTrackProgress } from '../../lib/tracks/hooks/useUpdateTrackProgress';
import { useSession } from 'next-auth/react';
import placeholderImage from '@/public/bouldering-placeholder.jpeg';
import { useRouter } from 'next/navigation';
import ToggleButton from '../ui/ToggleButton';
import RemovedLabel from '../ui/RemovedLabel';
import { getBorderColorForDifficulty } from '@/utils/difficulty.utils';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { Zone } from '../Zone';


const TrackCard: React.FC<Track> = ({ ...propTrack }) => {

  const { updateTrackStatus, isLoading, error } = useUpdateTrackProgress();
  const [track, setTrack] = useState<Track>(propTrack);
  const levelBorderColor = getBorderColorForDifficulty(track.level);
  const session = useSession();
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
  
  const handleStatusChange = async () => {
    const previousStatus = track.trackProgress?.status ?? TrackStatus.TO_DO;
    const newStatus = track.trackProgress?.status === TrackStatus.DONE ? TrackStatus.TO_DO : TrackStatus.DONE;

    setTrack({
      ...track, 
      trackProgress: {
        ...track.trackProgress,
        status: newStatus,
        liked: track.trackProgress?.liked ?? false,
        dateCompleted: new Date()
      }
    })

    if (!session.data?.user?.id) return;
    const wasSuccessful = await updateTrackStatus(track.id, session.data.user.id, newStatus);

    if (wasSuccessful) {
      // Handle success (e.g., show a success message)
      console.log('Track status updated successfully', newStatus);
    } else {
      // Handle failure (e.g., revert the status change in the UI, show an error message)
      console.error(error);
      setTrack({
        ...track, 
        trackProgress: {
          ...track.trackProgress,
          status: previousStatus,
          liked: track.trackProgress?.liked ?? false
        }
      });
    }
  };

  const openTrackDetails = () => {
    router.push(`dashboard/track/${track.id}`)
  }

  return (
    <div onClick={openTrackDetails} className="flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 cursor-pointer">
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
            <span onClick={(e) => e.stopPropagation()}>
              <ToggleButton isActive={track.trackProgress?.status === TrackStatus.DONE} isLoading={isLoading} onChange={handleStatusChange} style='small' />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
