"use client";
import React from 'react';
import { Contest } from '@/domain/Contest.schema';
import TrackTabContent from './TrackTabContent';
import UserTabContent from './UserTabContent';
import ActivityTabContent from './ActivityTabContent';
import { ContestUser } from '@/domain/ContestUser.schema';
import { ContestActivity } from '@/domain/ContestActivity.schema';
import { Track } from '@/domain/Track.schema';
import { TrackStatus } from '@/domain/TrackStatus.enum';

type TabType = 'tracks' | 'users' | 'bonus';

type ContestTabsProps = {
  contest: Contest;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  userId?: string;
  isOpener: boolean;
  onAddUser: (user: ContestUser) => void;
  onRemoveUser: (user: ContestUser) => void;
  onAddTrack: (track: Track) => void;
  onRemoveTrack: (track: Track) => void;
  onStatusUpdate: (trackId: number, newStatus: TrackStatus) => void;
  onPostActivity: (activity: ContestActivity) => void;
  onRemoveActivity: (activity: ContestActivity) => void;
  onUpdateActivityScore: (activityId: number, newScore: number) => void;
};

const ContestTabs: React.FC<ContestTabsProps> = ({
  contest,
  activeTab,
  onTabChange,
  userId,
  isOpener,
  onAddUser,
  onRemoveUser,
  onAddTrack,
  onRemoveTrack,
  onStatusUpdate,
  onPostActivity,
  onRemoveActivity,
  onUpdateActivityScore,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UserTabContent
            contest={contest}
            isOpener={isOpener}
            onAddUser={onAddUser}
            onRemoveUser={onRemoveUser}
          />
        );
      case 'tracks':
        return (
          <TrackTabContent
            contest={contest}
            userId={userId}
            isOpener={isOpener}
            onAddTrack={onAddTrack}
            onRemoveTrack={onRemoveTrack}
            onStatusUpdate={onStatusUpdate}
          />
        );
      case 'bonus':
        return (
          <ActivityTabContent
            contest={contest}
            isOpener={isOpener}
            userId={userId}
            onPostActivity={onPostActivity}
            onRemoveActivity={onRemoveActivity}
            onUpdateScore={onUpdateActivityScore}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex space-x-4 border-b border-gray-700">
        <button
          className={`py-2 px-4 ${activeTab === 'tracks' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
          onClick={() => onTabChange('tracks')}
        >
          Blocks
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
          onClick={() => onTabChange('users')}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'bonus' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
          onClick={() => onTabChange('bonus')}
        >
          Activities
        </button>
      </div>
      <div className="my-4">{renderTabContent()}</div>
    </>
  );
};

export default ContestTabs;
export type { TabType };