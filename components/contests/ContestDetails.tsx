"use client";
import React, { useId, useState } from 'react';
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
import { ContestActivity } from '@/domain/ContestActivity.schema';
import ContestStatus from '../ui/ContestStatus';
import { useChangeContestStatus } from '@/lib/contests/hooks/useChangeContestStatus';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { ContestStatusType } from '@/domain/ContestStatus.enum';
import Popin from '../ui/Popin';
import customSelectClassName from '../ui/customSelectClassName';
import Select from 'react-select';
import { useContestRankings } from '@/lib/contests/hooks/useContestRankings';
import { ContestRankingType, ContestRankingTypeEnum } from '@/domain/ContestRankingType.enum';
import { TrackStatus } from '@/domain/TrackStatus.enum';

type StatusOption = {
  value: ContestStatusType;
  label: ContestStatusType;
};

const ContestDetails: React.FC<Contest> = ({ ...propContest }) => {
  const [contest, setContest] = useState<Contest>(propContest);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isStatusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<ContestStatusType>(contest.status);
  const { deleteContest, isLoading: isLoadingDelete, error: errorDelete, reset: resetDelete } = useDeleteContest();
  const { changeContestStatus, isLoading: isLoadingChangeStatus, error: errorChangeStatus, reset: resetChangeStatus } = useChangeContestStatus();
  const {
    isGenerating,
    isExporting,
    generateError,
    exportError,
    generateRankings,
    exportRanking,
    resetErrors: resetRankingErrors
  } = useContestRankings();
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tracks');

  const handleGenerateRanking = async () => {
    const success = await generateRankings(contest.id);
    if (success) {
      setContest(prev => ({
        ...prev,
        status: ContestStatusEnum.Enum.Over
      }));
    }
  };

  const handleExportRanking = async (type: ContestRankingType) => {
    const csvContent = await exportRanking(contest.id, type);
    if (csvContent) {
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${contest.name}_${type}_ranking.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleStatusChange = async () => {
    const result = await changeContestStatus(contest, selectedStatus);
    if (result.success) {
      setContest(prevContest => ({
        ...prevContest,
        status: selectedStatus
      }));
      setStatusDialogOpen(false);
    }
  };

  const handleTrackStatusUpdate = (trackId: number, newStatus: TrackStatus) => {
    console.log('Updating track status:', trackId, newStatus);
    setContest(prevContest => ({
      ...prevContest,
      tracks: prevContest.tracks.map(track =>
        track.id === trackId ? {
          ...track,
          contestProgress: track.contestProgress
            ? {
              ...track.contestProgress,
              status: newStatus
            }
            : {
              id: 0,
              contestUserId: contest.users.find(contestUser => contestUser.user?.id === session?.user?.id)?.id ?? 0,
              contestTrackId: trackId,
              status: newStatus,
              createdAt: new Date(),
              updatedAt: new Date()
            }
        }
          : track
      )
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserTabContent
          session={session}
          contest={contest}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
        />;
      case 'tracks':
        return (
          <TrackTabContent
            session={session}
            contest={contest}
            onAddTrack={handleAddTrack}
            onRemoveTrack={handleRemoveTrack}
            onStatusUpdate={handleTrackStatusUpdate}
          />
        );
      case 'bonus':
        return (
          <ActivityTabContent
            contest={contest}
            session={session}
            onPostActivity={handlePostActivity}
            onRemoveActivity={handleRemoveActivity}
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

  const handlePostActivity = (activityToAddOrUpdate: ContestActivity) => {
    console.log('Adding/Updating activity:', activityToAddOrUpdate);
    setContest(prevContest => ({
      ...prevContest,
      activities: prevContest.activities.some(activity => activity.id === activityToAddOrUpdate.id)
        ? prevContest.activities.map(activity =>
          activity.id === activityToAddOrUpdate.id ? activityToAddOrUpdate : activity
        )
        : [...prevContest.activities, activityToAddOrUpdate]
    }));
  };

  const handleRemoveActivity = (activityToRemove: ContestActivity) => {
    console.log('Removing activity:', activityToRemove);
    setContest(prevContest => ({
      ...prevContest,
      activities: prevContest.activities.filter(activity => activity.id !== activityToRemove.id)
    }));
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
          ? { ...activity, userScore: newScore }
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

          {/* Date and Status row */}
          <div className="flex justify-between items-center gap-2 mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {contest.date ? contest.date.toLocaleDateString() : '...'}
            </span>
            <ContestStatus status={contest.status} />
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

          {contest.status === ContestStatusEnum.Enum.Over && (
            <div className='flex flex-wrap justify-between gap-2 mt-2 mb-4 '>
              <Button
                className='grow'
                btnType='secondary'
                onClick={() => handleExportRanking(ContestRankingTypeEnum.Enum.Men)}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Men\'s Ranking'}
              </Button>
              <Button
                className='grow'
                btnType='secondary'
                onClick={() => handleExportRanking(ContestRankingTypeEnum.Enum.Women)}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Women\'s Ranking'}
              </Button>
              <Button
                className='grow'
                btnType='secondary'
                onClick={() => handleExportRanking(ContestRankingTypeEnum.Enum.Overall)}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Overall Ranking'}
              </Button>
              {exportError && (
                <p className="text-red-500 text-sm w-full mt-1">{exportError}</p>
              )}
            </div>
          )}

          {/* Editor zone for admin actions */}
          {isOpener(session) && (
            <div className='p-4 w-full border-t-2 border-gray-600 sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>
              <h2 className="text-lg font-bold mb-3">Editor zone</h2>
              <div className='flex flex-wrap justify-between gap-2'>
                <Button className='grow' onClick={() => setStatusDialogOpen(true)}>
                  Change Status
                </Button>
                <Button className='grow bg-red-500 text-white' btnType='danger' onClick={() => setDeleteDialogOpen(true)}>Delete Contest</Button>
              </div>
              <div className='flex flex-wrap justify-between gap-2'>
                <Button
                  className='grow'
                  btnType={contest.status === ContestStatusEnum.Enum.Over ? 'primary' : 'secondary'}
                  onClick={handleGenerateRanking}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : contest.status === ContestStatusEnum.Enum.Over ? 'Regenerate Rankings' : 'Generate Rankings'}
                </Button>
                {generateError && (
                  <p className="text-red-500 text-sm w-full mt-1">{generateError}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <ConfirmationDialog isOpen={isDeleteDialogOpen} title='Delete Contest' text='Are you sure you want to delete this contest?'
          onCancel={handleCancelDelete} onConfirm={handleDeleteContest}
          error={errorDelete ?? undefined} isLoading={isLoadingDelete} loadingMessage='Deleting contest...'></ConfirmationDialog>

        {/* Status Change Dialog */}
        <Popin isOpen={isStatusDialogOpen} onClose={() => setStatusDialogOpen(false)} title="Change Contest Status">
          <div>
            <Select<StatusOption>
              instanceId={useId()}
              isSearchable={false}
              name="status"
              value={{ value: selectedStatus, label: selectedStatus }}
              options={Object.values(ContestStatusEnum.Enum).map(status => ({ value: status, label: status }))}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(newValue) => setSelectedStatus(newValue?.value as ContestStatusType)}
              classNames={customSelectClassName}
              unstyled={true}
              placeholder="Select Status"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button btnType="secondary" onClick={handleStatusChange} disabled={isLoadingChangeStatus}>
                Change Status
              </Button>
              <Button onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
            </div>
            {errorChangeStatus && (
              <p className="text-red-500 mt-2">{errorChangeStatus}</p>
            )}
          </div>
        </Popin>
      </div>
    </main>
  );
}

export default ContestDetails;