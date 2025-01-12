"use client";
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { FaPlus } from 'react-icons/fa';
import ActivityCard from '../activities/ActivityCard';
import { useManageContestActivities } from '@/lib/contests/hooks/useManageContestActivities';
import { ContestActivity } from '@/domain/ContestActivity.schema';
import ActivityForm from '../activities/ActivityForm';
import ConfirmationDialog from '../ui/ConfirmDialog';
import { Contest } from '@/domain/Contest.schema';
import { ContestUser } from '@/domain/ContestUser.schema';
import { toast } from 'sonner';

interface ActivityTabContentProps {
  contest: Contest;
  isOpener: boolean;
  contestUser: ContestUser | undefined;
  onAddActivity: (activityToAdd: ContestActivity) => void;
  onRemoveActivity: (activityToRemove: ContestActivity) => void;
  onUpdateScore: (activityId: number, newScore: number) => void;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({
  contest,
  contestUser,
  isOpener,
  onAddActivity,
  onRemoveActivity,
  onUpdateScore
}) => {
  const [isAddActivityPopinOpen, setIsAddActivityPopinOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ContestActivity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<ContestActivity | null>(null);
  const { 
    addActivity, 
    deleteActivity, 
    updateActivityScore,
    isLoading,
    loadingMessage,
    error 
  } = useManageContestActivities();

  const handleScoreUpdate = async (activityId: number, newScore: number, contestUserId: number) => {
    const success = await updateActivityScore(contest.id, activityId, newScore, contestUserId);
    if (success) {
      onUpdateScore(activityId, newScore);
    } else {
      toast.error('Failed to update score');
    }
  };

  const handleAddActivity = async (
    activityData: Omit<ContestActivity, 'contestId' | 'userScore'>,
    imageFile: File | null
  ) => {
    const newActivity = await addActivity(contest.id, activityData, imageFile);
    if (newActivity) {
      onAddActivity(newActivity);
      setIsAddActivityPopinOpen(false);
      setSelectedActivity(null);
    } else if (error) {
      toast.error(error);
    }
  };

  const handleEditActivity = (activity: ContestActivity) => {
    setSelectedActivity(activity);
    setIsAddActivityPopinOpen(true);
  };

  const handleDeleteActivity = async (activity: ContestActivity) => {
    setActivityToDelete(activity);
  };

  const confirmDeleteActivity = async () => {
    if (activityToDelete) {
      const success = await deleteActivity(activityToDelete);
      if (success) {
        onRemoveActivity(activityToDelete);
      } else if (error) {
        toast.error(error);
      }
      setActivityToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {contest.activities.length === 0 ? (
        <p className="text-gray-400">No activities yet</p>
      ) : (
        contest.activities.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            contestUser={contestUser}
            onScoreUpdate={handleScoreUpdate}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            isOpener={isOpener}
          />
        ))
      )}

      {isOpener && (
        <Button 
          onClick={() => {
            setSelectedActivity(null);
            setIsAddActivityPopinOpen(true);
          }} 
          className="w-full flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          Add Activity
        </Button>
      )}

      <ActivityForm
        isOpen={isAddActivityPopinOpen}
        onCancel={() => {
          setIsAddActivityPopinOpen(false);
          setSelectedActivity(null);
        }}
        onConfirm={handleAddActivity}
        error={error ?? undefined}
        isLoading={isLoading}
        loadingMessage={loadingMessage ?? undefined}
        activity={selectedActivity}
      />

      <ConfirmationDialog 
        isOpen={activityToDelete !== null}
        title="Delete Activity"
        text={`Are you sure you want to delete "${activityToDelete?.name}"?`}
        onCancel={() => setActivityToDelete(null)}
        onConfirm={confirmDeleteActivity}
        error={error ?? undefined}
        isLoading={isLoading}
        loadingMessage="Deleting activity..."
      />
    </div>
  );
};

export default ActivityTabContent; 