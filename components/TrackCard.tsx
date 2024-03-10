"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track, TrackStatus, getBorderColorForLevel } from '../domain/TrackSchema';
import { useUpdateTrackStatus } from '../lib/updateTrackUserHook';
import { useSession } from 'next-auth/react';
import placeholderImage from '@/public/bouldering-placeholder.jpeg';
import { useRouter } from 'next/navigation';
import ToggleButton from './ui/ToggleButton';


const TrackCard: React.FC<Track> = ({ ...propTrack }) => {

  const { updateTrackStatus, isLoading, error } = useUpdateTrackStatus();
  const [track, setTrack] = useState<Track>(propTrack);
  const levelBorderColor = getBorderColorForLevel(track.level);
  const session = useSession();
  const router = useRouter();

  const handleStatusChange = async () => {
    const previousStatus = track.trackProgress?.status ?? TrackStatus.TO_DO;
    const newStatus = track.trackProgress?.status === TrackStatus.DONE ? TrackStatus.TO_DO : TrackStatus.DONE;

    setTrack({
      ...track, trackProgress: {
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
        ...track, trackProgress: {
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
    <div onClick={openTrackDetails} className="flex flex-col gap-4 bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 relative rounded-full overflow-hidden border-4 ${levelBorderColor}`}>
            {track.imageUrl ?
              <CldImage
                width="400"
                height="400"
                src={track.imageUrl}
                crop="thumb"
                alt="Climbing Track" />
              :
              <Image src={placeholderImage} alt="Climbing Track - place holder" fill sizes='(max-width: 200px)' />}
          </div>
        </div>
        <div className='w-full'>
          <h4 className="text-md font-semibold text-white">{track.name}</h4>
          <div className="flex justify-between items-center mt-2">
            <span className="bg-transparent text-xs font-semibold px-2 py-1 rounded border border-gray-200">Zone {track.zone}</span>
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
