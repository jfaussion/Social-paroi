"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/Button';
import { useRouter } from "next/navigation";
import ConfirmationDialog from '../ui/ConfirmDialog';
import { useDeleteContest } from '@/lib/contests/hooks/useDeleteContest';
import { useChangeContestStatus } from '@/lib/contests/hooks/useChangeContestStatus';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { ContestStatusType } from '@/domain/ContestStatus.enum';
import { useContestRankings } from '@/lib/contests/hooks/useContestRankings';
import { ContestRankingType } from '@/domain/ContestRankingType.enum';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { Contest } from '@/domain/Contest.schema';
import { Track } from '@/domain/Track.schema';
import { ContestUser } from '@/domain/ContestUser.schema';
import { ContestActivity } from '@/domain/ContestActivity.schema';
import ContestHeader from './ContestHeader';
import ContestTabs, { TabType } from './ContestTabs';
import RankingPanel from './RankingPanel';
import ContestEditorZone from './ContestEditorZone';
import Popin from '../ui/Popin';
import { useId } from 'react';
import customSelectClassName from '../ui/customSelectClassName';
import Select from 'react-select';

type StatusOption = {
  value: ContestStatusType;
  label: ContestStatusType;
};

type ContestDetailsProps = Contest & { isOpener: boolean };

const ContestDetails: React.FC<ContestDetailsProps> = ({ isOpener: isOpenerProp, ...propContest }) => {
  const [contest, setContest] = useState<Contest>(propContest);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isStatusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<ContestStatusType>(contest.status);
  const [activeTab, setActiveTab] = useState<TabType>('tracks');
  const { deleteContest, isLoading: isLoadingDelete, error: errorDelete, reset: resetDelete } = useDeleteContest();
  const { changeContestStatus, isLoading: isLoadingChangeStatus, error: errorChangeStatus, reset: resetChangeStatus } = useChangeContestStatus();
  const {
    isGenerating,
    isExporting,
    generateError,
    exportError,
    generateRankings,
    exportRanking,
  } = useContestRankings();
  const { data: session } = useSession();
  const router = useRouter();

  const handleGenerateRanking = async () => {
    const success = await generateRankings(contest.id);
    if (success) {
      setContest(prev => ({ ...prev, status: ContestStatusEnum.Enum.Over }));
    }
  };

  const handleExportRanking = async (type: ContestRankingType) => {
    const csvContent = await exportRanking(contest.id, type);
    if (csvContent) {
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
      setContest(prevContest => ({ ...prevContest, status: selectedStatus }));
      setStatusDialogOpen(false);
    }
  };

  const handleTrackStatusUpdate = (trackId: number, newStatus: TrackStatus) => {
    console.log('Updating track status:', trackId, newStatus);
    setContest(prevContest => ({
      ...prevContest,
      tracks: prevContest.tracks.map(track =>
        track.id === trackId
          ? {
            ...track,
            contestProgress: track.contestProgress
              ? { ...track.contestProgress, status: newStatus }
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

  const handleDeleteContest = async () => {
    const wasSuccessful = await deleteContest(contest, contest.locationId!);
    if (!wasSuccessful) {
      console.error(errorDelete);
    } else {
      setDeleteDialogOpen(false);
      router.back();
    }
  };

  const handlePostActivity = (activityToAddOrUpdate: ContestActivity) => {
    setContest(prevContest => ({
      ...prevContest,
      activities: prevContest.activities.some(activity => activity.id === activityToAddOrUpdate.id)
        ? prevContest.activities.map(activity => activity.id === activityToAddOrUpdate.id ? activityToAddOrUpdate : activity)
        : [...prevContest.activities, activityToAddOrUpdate]
    }));
  };

  const handleRemoveActivity = (activityToRemove: ContestActivity) => {
    setContest(prevContest => ({
      ...prevContest,
      activities: prevContest.activities.filter(activity => activity.id !== activityToRemove.id)
    }));
  };

  const handleAddUser = (userToAdd: ContestUser) => {
    setContest(prevContest => ({ ...prevContest, users: [...prevContest.users, userToAdd] }));
  };

  const handleRemoveUser = (userToRemove: ContestUser) => {
    setContest(prevContest => ({ ...prevContest, users: prevContest.users.filter(user => user.id !== userToRemove.id) }));
  };

  const handleAddTrack = (trackToAdd: Track) => {
    setContest(prevContest => ({
      ...prevContest,
      tracks: prevContest.tracks.some(track => track.id === trackToAdd.id)
        ? prevContest.tracks
        : [...prevContest.tracks, trackToAdd]
    }));
  };

  const handleRemoveTrack = (trackToRemove: Track) => {
    setContest(prevContest => ({ ...prevContest, tracks: prevContest.tracks.filter(track => track.id !== trackToRemove.id) }));
  };

  const handleUpdateActivityScore = (activityId: number, newScore: number) => {
    setContest(prevContest => ({
      ...prevContest,
      activities: prevContest.activities.map(activity =>
        activity.id === activityId ? { ...activity, userScore: newScore } : activity
      )
    }));
  };

  return (
    <main className="flex flex-col items-center justify-between sm:pr-24 sm:pl-24 sm:pt-0">
      <div className="flex flex-col items-center dark:text-white w-full max-w-3xl">
        <ContestHeader
          name={contest.name}
          date={contest.date}
          status={contest.status}
          coverImage={contest.coverImage}
        />

        <div className="p-4 w-full sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4">
          <ContestTabs
            contest={contest}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userId={session?.user?.id}
            isOpener={isOpenerProp}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
            onAddTrack={handleAddTrack}
            onRemoveTrack={handleRemoveTrack}
            onStatusUpdate={handleTrackStatusUpdate}
            onPostActivity={handlePostActivity}
            onRemoveActivity={handleRemoveActivity}
            onUpdateActivityScore={handleUpdateActivityScore}
          />

          {contest.status === ContestStatusEnum.Enum.Over && (
            <RankingPanel
              onExport={handleExportRanking}
              isExporting={isExporting}
              error={exportError}
            />
          )}

          {isOpenerProp && (
            <ContestEditorZone
              contestStatus={contest.status}
              isGenerating={isGenerating}
              isExporting={isExporting}
              generateError={generateError}
              onStatusDialogOpen={() => setStatusDialogOpen(true)}
              onDeleteDialogOpen={() => setDeleteDialogOpen(true)}
              onGenerateRanking={handleGenerateRanking}
            />
          )}
        </div>

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          title='Delete Contest'
          text='Are you sure you want to delete this contest?'
          onCancel={() => { setDeleteDialogOpen(false); resetDelete(); }}
          onConfirm={handleDeleteContest}
          confirmBtnType="danger"
          error={errorDelete ?? undefined}
          isLoading={isLoadingDelete}
          loadingMessage='Deleting contest...'
        />

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
};

export default ContestDetails;