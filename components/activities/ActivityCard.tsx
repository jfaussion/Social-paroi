"use client";
import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import Image from 'next/image';
import { Button } from '../ui/Button';
import Popin from '../ui/Popin';
import { ContestActivity } from '@/domain/ContestActivity.schema';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ToggleMenu from '../ui/ToggleMenu';
import { ContestUser } from '@/domain/ContestUser.schema';

interface ActivityCardProps {
  activity: ContestActivity;
  contestUser: ContestUser | undefined;
  onScoreUpdate: (activityId: number, newScore: number, contestUserId: number) => void;
  onEdit?: (activity: ContestActivity) => void;
  onDelete?: (activity: ContestActivity) => void;
  isLoading: boolean;
  displayEditButton: boolean
  displayToggleMenu: boolean;
  displayImageAndDesc: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  contestUser,
  onScoreUpdate,
  onEdit,
  onDelete,
  isLoading,
  displayEditButton,
  displayToggleMenu,
  displayImageAndDesc = true,
}) => {
  const [isScorePopinOpen, setIsScorePopinOpen] = useState(false);
  const [currentScore, setCurrentScore] = useState<string>(activity.userScore?.toString() || '');
  
  const handleScoreSubmit = () => {
    const numScore = parseFloat(currentScore);
    if (!isNaN(numScore) && contestUser) {
      onScoreUpdate(activity.id, numScore, contestUser.id);
      setIsScorePopinOpen(false);
    }
  };
    
  return (
    <div className="w-full cursor-pointer bg-gradient-to-r from-slate-200 to-slate-100 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg relative">
      {displayImageAndDesc && (
        activity.image ? (
          <CldImage
            width="400"
            height="200"
            src={activity.image}
            crop="thumb"
            gravity="center"
            alt={activity.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <Image
            src={placeholderImage}
            alt={activity.name}
            className="w-full h-48 object-cover rounded-t-lg"
            width={400}
            height={200}
          />
        )
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{activity.name}</h3>
        {displayImageAndDesc &&
          <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">
            {activity.description}
          </p>
        }
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Score:</span>
            <span className="font-semibold">
              {activity.userScore > 0 ? activity.userScore : '-'}
            </span>
          </div>
          {displayEditButton && (
            <Button 
              disabled={isLoading}
              onClick={() => {
                setCurrentScore(activity.userScore?.toString() || '');
                setIsScorePopinOpen(true);
              }}
              className="px-4 py-2"
            >
              Edit Score
              </Button>
          )}
        </div>
      </div>

      {displayToggleMenu && (
        <div className="absolute top-4 right-4">
          <ToggleMenu
            actions={[
              {
                label: 'Edit info',
                icon: <FaEdit />,
                onClick: () => onEdit?.(activity),
              },
              {
                label: 'Delete',
                icon: <FaTrash />,
                onClick: () => onDelete?.(activity),
                className: 'text-red-600 dark:text-red-400'
              }
            ]}
          />
        </div>
      )}

      <Popin
        isOpen={isScorePopinOpen}
        onClose={() => setIsScorePopinOpen(false)}
        title="Edit Score"
      >
        <div className="p-4">
          <input
            type="number"
            value={currentScore}
            onChange={(e) => setCurrentScore(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            placeholder="Enter score"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              btnType="secondary"
              onClick={handleScoreSubmit}
            >
              Save
            </Button>
            <Button
              onClick={() => setIsScorePopinOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Popin>
    </div>
  );
};

export default ActivityCard; 