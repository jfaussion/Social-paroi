"use client";
import React, { use, useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import * as z from 'zod';
import { Track, TrackSchema, getBorderColorForLevel } from '../domain/TrackSchema';
import { useUpdateTrackStatus } from '../app/lib/updateTrackUserHook';
import { useSession } from 'next-auth/react';

type ClimbingTrackCardProps = z.infer<typeof TrackSchema>;

const ClimbingTrackCard: React.FC<ClimbingTrackCardProps> = ({ ...track }) => { 

  const { updateTrackStatus, isLoading, error } = useUpdateTrackStatus();
  const [status, setStatus] = useState<Track['status']>(track.status);
  const placeholderImage = '/bouldering-placeholder.jpeg';
  const borderColor = getBorderColorForLevel(track.level);
  const session = useSession();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('handleStatusChange', e.target.value);
    const newStatus = e.target.value as Track['status'];
    setStatus(newStatus);
    console.log('session', session);

    if (!session.data?.user?.id) return;
    const wasSuccessful = await updateTrackStatus(track.id, parseInt(session.data?.user?.id), newStatus);
  
    if (wasSuccessful) {
      // Handle success (e.g., show a success message)
    } else {
      // Handle failure (e.g., revert the status change in the UI, show an error message)
      console.error(error);
    }
  };
  
  return (
    <div className="flex flex-col gap-4 bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 relative rounded-full overflow-hidden border-4 ${borderColor}`}>
            {track.imageUrl ?
              <CldImage
                width="400"
                height="400"
                src={track.imageUrl}
                crop="thumb"
                alt="Climbing Track" />
              :
              <Image src={placeholderImage} alt="Climbing Track - place holder" layout="fill" objectFit="cover" />}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white">{track.name}</h4>
          <p className="text-sm text-gray-300">{track.date ? track.date.toLocaleDateString() : '...'}</p>
        </div>
      </div>
      <div>
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isLoading}
          className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-white bg-gray-800 bg-clip-padding bg-no-repeat border border-gray-600 rounded transition ease-in-out m-0 focus:text-white focus:bg-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="TO_DO">To do</option>
          <option value="IN_PROGRESS">Working on it</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
};

export default ClimbingTrackCard;
