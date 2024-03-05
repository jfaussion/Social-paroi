
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track, TrackStatus } from '../domain/TrackSchema';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import { useSession } from 'next-auth/react';
import { useUpdateTrackStatus } from '@/app/lib/updateTrackUserHook';
import ToggleButton from './ui/ToggleButton';

const TrackDetails: React.FC<Track> = ({ ...track}) => {
  const [status, setStatus] = useState<TrackStatus>(track.status);
  const { updateTrackStatus, isLoading, error } = useUpdateTrackStatus();
  const session = useSession();


  const handleStatusChange = async () => {
    const newStatus = status === TrackStatus.TO_DO ? TrackStatus.DONE : TrackStatus.TO_DO;

    if (!session.data?.user?.id) return;
    const wasSuccessful = await updateTrackStatus(track.id, parseInt(session.data?.user?.id), newStatus);
  
    if (wasSuccessful) {
      // Handle success (e.g., show a success message)
      setStatus(newStatus);
      console.log('status updated: ', newStatus);
    } else {
      // Handle failure (e.g., revert the status change in the UI, show an error message)
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 sm:pt-8">
      <div className="flex flex-col items-center bg-gray-900 text-white w-full">
        {/* Image container */}
        <div className="w-full bg-black">
          {/* Replace with an img tag or background-image style as needed */}
          {track?.imageUrl ?
            <CldImage
              width="400"
              height="400"
              src={track.imageUrl}
              crop="thumb"
              alt="Climbing Track"
              className="mx-auto" />
            :
            <Image src={placeholderImage} alt="Climbing Track - place holder" sizes='(max-width: 200px)' className="mx-auto" />}
        </div>

        {/* Track details container */}
        <div className="p-4 w-full max-w-md">
          {/* Name and Done button row */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">{track.name}...{track?.id} </h1>
              <ToggleButton isActive={status === TrackStatus.DONE} isLoading={isLoading} onChange={handleStatusChange}/>
          </div>

          {/* Zone and Date row */}
          <div className="flex justify-between items-center mb-3">
            <span className="bg-green-600 text-xs font-semibold px-2 py-1 rounded">Zone {track.id}</span>
            <span className="text-sm text-gray-400">{track.date ? track.date.toLocaleDateString() : '...'}</span>
          </div>

          {/* Difficulty and Points row */}
          <div className="flex justify-between items-center mb-3">
            <span className="inline-block w-14 h-3 bg-red-600 rounded-full"></span>
            <span className="text-sm font-semibold">200pts</span>
          </div>

          {/* Hold color row */}
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium mr-2">Hold color</span>
            <span className="inline-block w-14 h-3 bg-pink-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </main>
  )


}

export default TrackDetails;
