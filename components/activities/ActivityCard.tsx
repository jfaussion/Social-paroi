"use client";
import React, { useEffect, useRef, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import Image from 'next/image';
import { Button } from '../ui/Button';
import Popin from '../ui/Popin';
import { ContestActivity } from '@/domain/ContestActivity.schema';
import { FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';

interface ActivityCardProps {
  activity: ContestActivity;
  onScoreUpdate: (activityId: number, newScore: number) => void;
  onEdit?: (activity: ContestActivity) => void;
  onDelete?: (activity: ContestActivity) => void;
  isOpener: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onScoreUpdate,
  onEdit,
  onDelete,
  isOpener 
}) => {
  const [isScorePopinOpen, setIsScorePopinOpen] = useState(false);
  const [currentScore, setCurrentScore] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleScoreSubmit = () => {
    const numScore = parseFloat(currentScore);
    if (!isNaN(numScore)) {
      onScoreUpdate(activity.id, numScore);
      setIsScorePopinOpen(false);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(activity);
      setMenuOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(activity);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full cursor-pointer bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg relative">
      {activity.image ? (
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
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{activity.name}</h3>
        <p className="text-gray-400 mb-4 whitespace-pre-line">
          {activity.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Score:</span>
            <span className="font-semibold">{'-'}</span>
          </div>
          <Button 
            onClick={() => setIsScorePopinOpen(true)}
            className="px-4 py-2"
          >
            Edit Score
          </Button>
        </div>
      </div>

      {isOpener && (
        <div className="absolute top-4 right-4">
          <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300">
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div 
              ref={menuRef} 
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10"
            >
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaEdit className="mr-2" /> Edit info
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
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
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Enter score"
          />
          <div className="flex justify-end space-x-2">
            <Button
              btnType="secondary"
              onClick={() => setIsScorePopinOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScoreSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </Popin>
    </div>
  );
};

export default ActivityCard; 