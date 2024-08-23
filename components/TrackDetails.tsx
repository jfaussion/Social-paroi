
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track } from '../domain/Track.schema';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import { useSession } from 'next-auth/react';
import { useUpdateTrackProgress } from '@/lib/tracks/hooks/useUpdateTrackProgress';
import ToggleButton from './ui/ToggleButton';
import RemovedLabel from './ui/RemovedLabel';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { getBgColorForDifficulty } from '@/utils/difficulty.utils';
import { getBgColor } from '@/utils/color.utils';
import { Button } from './ui/Button';
import { isOpener } from '@/utils/session.utils';
import { useChangeMountedTrackStatus } from '@/lib/tracks/hooks/useChangeMountedTrackStatus';
import { useRouter } from "next/navigation";
import ConfirmationDialog from './ui/ConfirmDialog';
import { useDeleteTrack } from '@/lib/tracks/hooks/useDeleteTrack';
import { Zone } from './Zone';
import { FaUserCheck } from 'react-icons/fa6';


const TrackDetails: React.FC<Track> = ({ ...propTrack }) => {
  const [track, setTrack] = useState<Track>(propTrack);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { updateTrackStatus, isLoading: isLoadingTrackStatus, error: errorTrackStatus } = useUpdateTrackProgress();
  const { deleteTrack, isLoading: isLoadingDelete, error: errorDelete, reset: resetDelete } = useDeleteTrack();
  const { changeMountedTrackStatus, isLoading: isLoadingRemove, error: errorRemove } = useChangeMountedTrackStatus();
  const session = useSession();
  const levelClass = getBgColorForDifficulty(track.level);
  const holdClass = getBgColor(track.holdColor);
  const router = useRouter();


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
      console.error(errorTrackStatus);
      setTrack({
        ...track, trackProgress: {
          ...track.trackProgress,
          status: previousStatus,
          liked: track.trackProgress?.liked ?? false
        }
      });
    }
  };

  const changeMountedStatus = async (removeTrack: boolean) => {
    const previousStatus = track.removed;
    setTrack({
      ...track,
      removed: removeTrack
    });
    const wasSuccessful = await changeMountedTrackStatus(track.id, removeTrack);

    if (!wasSuccessful) {
      // Handle failure (e.g., revert the status change in the UI, show an error message)
      console.error(errorRemove);
      setTrack({
        ...track,
        removed: previousStatus
      });
    }
  }

  const handleDeleteTrack = async () => {
    const wasSuccessful = await deleteTrack(track);
    if (!wasSuccessful) {
      // Handle failure (e.g., show an error message)
      console.error(errorDelete);
    } else {
      setDeleteDialogOpen(false);
      router.back();
    }
  }

  const handleCancelDelete = async () => {
    setDeleteDialogOpen(false);
    resetDelete();
  }


  return (
    <main className="flex flex-col items-center justify-between sm:pr-24 sm:pl-24 sm:pt-0">
      <div className="flex flex-col items-center dark:text-white w-full max-w-3xl">
        <div className="flex w-full dark:bg-black snap-x snap-mandatory overflow-x-auto scrollbar-custom">
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
        <div className="p-4 w-full sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4">
          {/* Name and Done button row */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">{track.name}</h1>
            <ToggleButton isActive={track.trackProgress?.status === TrackStatus.DONE} isLoading={false} onChange={handleStatusChange} />
          </div>

          {/* Zone and Date row */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-sm font-medium mr-2">Difficulty</span>
              <span className={`inline-block w-14 h-3 rounded ${levelClass}`}></span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{track.date ? track.date.toLocaleDateString() : '...'}</span>
          </div>

          {/* Difficulty and Points row */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-sm font-medium mr-2">Hold color</span>
              <span className={`inline-block w-14 h-3 ${holdClass} rounded`}></span>
            </div>
            <span className="text-sm font-semibold">{track.points}pts</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex self-start space-x-2">
              {track.removed && (
                <RemovedLabel color={'red'}></RemovedLabel>
              )}
            </div>

            <div className="flex flex-end items-center text-sm space-x-2 font-medium mr-2">
              <span>{track.countDone ?? 0}</span>
              <FaUserCheck />
            </div>
          </div>

          <div className="flex justify-center sm:justify-between items-center pt-3 mb-3">
            <Zone zone={track.zone} width={200} height={100} />
          </div>

        </div>

        {isOpener(session.data) && (
          <div className='p-4 w-full border-t-2 border-gray-600 sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>

            <h2 className="text-lg font-bold mb-3">Editor zone</h2>

            <div className='flex flex-wrap justify-between gap-2'>
              <Button btnStyle={track.removed ? 'primary' : 'secondary'} className='grow'
                disabled={isLoadingRemove} onClick={() => changeMountedStatus(!track.removed)} >
                Mark as {track.removed ? 'mounted' : 'removed'}
              </Button>

              <Button btnStyle='primary' className='grow'
                onClick={() => router.push(`${track.id}/edit`)} >
                Edit Block
              </Button>

              <Button btnStyle='danger' className='grow'
                onClick={() => setDeleteDialogOpen(true)} >
                Delete Block
              </Button>
            </div>
          </div>
        )}
      </div>
      <ConfirmationDialog isOpen={isDeleteDialogOpen} title='Delete block' text='Are you sure you want to delete this block ?'
        onCancel={handleCancelDelete} onConfirm={handleDeleteTrack}
        error={errorDelete ?? undefined} isLoading={isLoadingDelete} loadingMessage='Deleting block...'></ConfirmationDialog>
    </main>
  )


}

export default TrackDetails;
