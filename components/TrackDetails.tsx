
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track, TrackStatus, getBgColorForHold, getBgColorForLevel } from '../domain/TrackSchema';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import { useSession } from 'next-auth/react';
import { useUpdateTrackProgress } from '@/lib/useUpdateTrackProgress';
import ToggleButton from './ui/ToggleButton';

const TrackDetails: React.FC<Track> = ({ ...propTrack }) => {
  const [track, setTrack] = useState<Track>(propTrack);
  const { updateTrackStatus, isLoading, error } = useUpdateTrackProgress();
  const session = useSession();
  const levelClass = getBgColorForLevel(track.level);
  const holdClass = getBgColorForHold(track.holdColor);

  const handleStatusChange = async () => {
    const previousStatus = track.trackProgress?.status ?? TrackStatus.TO_DO;
    const newStatus = track.trackProgress?.status === TrackStatus.TO_DO ? TrackStatus.DONE : TrackStatus.TO_DO;
    setTrack({
      ...track, trackProgress: {
        ...track.trackProgress,
        status: newStatus,
        dateCompleted: new Date(),
        liked: track.trackProgress?.liked ?? false
      }
    });

    if (!session.data?.user?.id) return;
    const wasSuccessful = await updateTrackStatus(track.id, session.data?.user?.id, newStatus);

    if (wasSuccessful) {
      // Handle success (e.g., show a success message)
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

  return (
    <main className="flex flex-col items-center justify-between sm:pr-24 sm:pl-24 sm:pt-0">
      <div className="flex flex-col items-center text-white w-full max-w-3xl">
        <div className="flex w-full bg-black snap-x snap-mandatory overflow-x-auto scrollbar-custom">
          {track?.imageUrl ? (
            track.imageUrl.split(' ').map((url, index) => (
              <div key={index} className="snap-center w-full shrink-0">
                <CldImage
                  width={800}
                  height={800}
                  crop="fill"
                  gravity="center"
                  improve="indoor"
                  src={url}
                  alt="Climbing Track"
                  className="mx-auto sm:rounded" />
              </div>
            ))
          ) : (
            <Image
              src={placeholderImage}
              alt="Climbing Track - place holder"
              sizes="(max-width: 200px)"
              className="mx-auto" />
          )}
        </div>


        {/* Track details container */}
        <div className="p-4 w-full sm:border sm:border-gray-600 sm:rounded-lg bg-gray-900 sm:m-4">
          {/* Name and Done button row */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">{track.name}</h1>
            <ToggleButton isActive={track.trackProgress?.status === TrackStatus.DONE} isLoading={false} onChange={handleStatusChange} />
          </div>

          {/* Zone and Date row */}
          <div className="flex justify-between items-center mb-3">
            <span className="bg-transparent text-xs font-semibold px-2 py-1 rounded border border-gray-200">Zone {track.zone}</span>
            <span className="text-sm text-gray-400">{track.date ? track.date.toLocaleDateString() : '...'}</span>
          </div>

          {/* Difficulty and Points row */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-sm font-medium mr-2">Difficulty</span>
              <span className={`inline-block w-14 h-3 rounded ${levelClass}`}></span>
            </div>
            <span className="text-sm font-semibold">{track.points}pts</span>
          </div>

          {/* Hold color row */}
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium mr-2">Hold color</span>
            <span className={`inline-block w-14 h-3 ${holdClass} rounded`}></span>
          </div>
        </div>
      </div>
    </main>
  )


}

export default TrackDetails;
