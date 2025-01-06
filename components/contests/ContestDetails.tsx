"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Contest } from "@/domain/Contest.schema";
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import { useSession } from 'next-auth/react';
import { Button } from '../ui/Button';
import { useRouter } from "next/navigation";
import ConfirmationDialog from '../ui/ConfirmDialog';
import { useDeleteContest } from '@/lib/contests/hooks/useDeleteContest';
import { isOpener } from '@/utils/session.utils';
import { Track } from '@/domain/Track.schema';
import TrackTabContent from './TrackTabContent';
import UserTabContent from './UserTabContent';
import { ContestUser } from '@/domain/ContestUser.schema';
import ActivityTabContent from './ActivityTabContent';

const ContestDetails: React.FC<Contest> = ({ ...propContest }) => {
  const [contest, setContest] = useState<Contest>(propContest);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { deleteContest, isLoading: isLoadingDelete, error: errorDelete, reset: resetDelete } = useDeleteContest();
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tracks');


  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserTabContent 
          contestUsers={contest.users}
          isOpener={isOpener(session)}
          contestId={contest.id} 
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
        />;
      case 'tracks':
        return (
          <TrackTabContent
            contestTracks={contest.tracks}
            isOpener={isOpener(session)}
            contestId={contest.id}
            onAddTrack={handleAddTrack}
            onRemoveTrack={handleRemoveTrack}
          />
        );
      case 'bonus':
        return (
          <ActivityTabContent
            contestActivities={contest.activities}
            isOpener={isOpener(session)}
            contestId={contest.id}
            onAddActivity={(activity) => {
              setContest(prev => ({
                ...prev,
                activities: [...prev.activities, activity]
              }));
            }}
            onRemoveActivity={(activity) => {
              setContest(prev => ({
                ...prev,
                activities: prev.activities.filter(a => a.id !== activity.id)
              }));
            }}
            onUpdateScore={handleUpdateActivityScore}
          />
        );
      default:
        return null;
    }
  };

  const handleDeleteContest = async () => {
    const wasSuccessful = await deleteContest(contest);
    if (!wasSuccessful) {
      console.error(errorDelete);
    } else {
      setDeleteDialogOpen(false);
      router.back();
    }
  };

  const handleCancelDelete = async () => {
    setDeleteDialogOpen(false);
    resetDelete();
  };

  const handleAddUser = (userToAdd: ContestUser) => {
    console.log('Adding user:', userToAdd);
    setContest(prevContest => ({
      ...prevContest,
      users: [...prevContest.users, userToAdd]
    }));
  };

  const handleRemoveUser = (userToRemove: ContestUser) => {
    console.log('Removing user:', userToRemove);
    setContest(prevContest => ({
      ...prevContest,
      users: prevContest.users.filter(user => user.id !== userToRemove.id)
    }));
  };

  const handleAddTrack = (trackToAdd: Track) => {
    console.log('Adding track:', trackToAdd);
    setContest(prevContest => ({
      ...prevContest,
      tracks: prevContest.tracks.some(track => track.id === trackToAdd.id)
        ? prevContest.tracks
        : [...prevContest.tracks, trackToAdd]
    }));
  };

  const handleRemoveTrack = (trackToRemove: Track) => {
    console.log('Removing track:', trackToRemove);
    setContest(prevContest => ({
      ...prevContest, 
      tracks: prevContest.tracks.filter(track => track.id !== trackToRemove.id)
    }));
  };

  const handleUpdateActivityScore = (activityId: number, newScore: number) => {
    setContest(prevContest => ({
      ...prevContest,
      activities: prevContest.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, score: newScore }
          : activity
      )
    }));
  };

  return (
    <main className="flex flex-col items-center justify-between sm:pr-24 sm:pl-24 sm:pt-0">
      <div className="flex flex-col items-center dark:text-white w-full max-w-3xl">
        <div className="flex w-full dark:bg-black snap-x snap-mandatory overflow-x-auto scrollbar-custom">
          {contest?.coverImage ? (
            contest.coverImage.split(' ').map((url, index) => (
              <div key={index} className="snap-center w-full shrink-0">
                <CldImage
                  width={800}
                  height={400}
                  crop="fill"
                  gravity="center"
                  improve="indoor"
                  src={url}
                  alt="Contest"
                  className="mx-auto sm:rounded" />
              </div>
            ))
          ) : (
            <Image
              src={placeholderImage}
              alt="Contest - placeholder"
              sizes="(max-width: 200px)"
              className="mx-auto" />
          )}
        </div>

        {/* Contest details container */}
        <div className="p-4 w-full sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4">
          {/* Name and Status button row */}
          <div className="flex justify-start items-center mb-3">
            <h1 className="text-xl font-bold">{contest.name}</h1>
          </div>

          {/* Date and Zone row */}
          <div className="flex justify-start items-center mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">{contest.date ? contest.date.toLocaleDateString() : '...'}</span>
          </div>

          {/* Tab navigation */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              className={`py-2 px-4 ${activeTab === 'tracks' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
              onClick={() => setActiveTab('tracks')}
            >
              Blocks
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'bonus' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
              onClick={() => setActiveTab('bonus')}
            >
              Activities
            </button>
          </div>

          {/* Tab content */}
          <div className="my-4">{renderTabContent()}</div>

          {/* Editor zone for admin actions */}
          {isOpener(session) && (
            <div className='p-4 w-full border-t-2 border-gray-600 sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>
              <h2 className="text-lg font-bold mb-3">Editor zone</h2>
              <div className='flex flex-wrap justify-between gap-2'>
                <Button className='grow' onClick={() => router.push(`${contest.id}/edit`)}>Edit Contest</Button>
                <Button className='grow bg-red-500 text-white' btnType='danger' onClick={() => setDeleteDialogOpen(true)}>Delete Contest</Button>
              </div>
            </div>
          )}
        </div>

        <ConfirmationDialog isOpen={isDeleteDialogOpen} title='Delete Contest' text='Are you sure you want to delete this contest?'
          onCancel={handleCancelDelete} onConfirm={handleDeleteContest}
          error={errorDelete ?? undefined} isLoading={isLoadingDelete} loadingMessage='Deleting contest...'></ConfirmationDialog>
      </div>
    </main>
  );
}

export default ContestDetails;