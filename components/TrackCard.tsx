"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track, TrackStatus, getColorClassForLevel } from '../domain/TrackSchema';
import { useUpdateTrackStatus } from '../app/lib/updateTrackUserHook';
import { useSession } from 'next-auth/react';
import placeholderImage from '@/public/bouldering-placeholder.jpeg';
import { useRouter } from 'next/navigation';


const TrackCard: React.FC<Track> = ({ ...track }) => { 

  const { updateTrackStatus, isLoading, error } = useUpdateTrackStatus();
  const [status, setStatus] = useState<Track['status']>(track.status);
  const levelBorderColor = getColorClassForLevel('border', track.level);
  const session = useSession();
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Track['status'];
    setStatus(newStatus);

    if (!session.data?.user?.id) return;
    const wasSuccessful = await updateTrackStatus(track.id, parseInt(session.data?.user?.id), newStatus);
  
    if (wasSuccessful) {
      // Handle success (e.g., show a success message)
    } else {
      // Handle failure (e.g., revert the status change in the UI, show an error message)
      console.error(error);
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
              <Image src={placeholderImage} alt="Climbing Track - place holder" fill sizes='(max-width: 200px)'/>}
          </div>
        </div>
        <div className='w-full'>
          <h4 className="text-md font-semibold text-white">{track.name}</h4>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">{track.date ? track.date.toLocaleDateString() : '...'}</span>
            <span className="bg-transparent text-xs font-semibold px-2 py-1 rounded border border-gray-200">Zone {track.zone}</span>
          </div>
        </div>
      </div>
      <div>
        <select
          value={status}
          onChange={handleStatusChange}
          onClick={(e) => e.stopPropagation()}
          disabled={isLoading}
          className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-white bg-gray-800 bg-clip-padding bg-no-repeat border border-gray-600 rounded transition ease-in-out m-0 focus:text-white focus:bg-gray-700 focus:border-blue-500 focus:outline-none"
        >
            <option value={TrackStatus.TO_DO}>To do</option>
            <option value={TrackStatus.IN_PROGRESS}>Working on it</option>
            <option value={TrackStatus.DONE}>Done</option>
        </select>
      </div>
    </div>
  );
};

export default TrackCard;
