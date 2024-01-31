"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import * as z from 'zod';
import { Track, TrackSchema, getColorForLevel } from '../domain/TrackSchema';


type ClimbingTrackCardProps = z.infer<typeof TrackSchema>;

const ClimbingTrackCard: React.FC<ClimbingTrackCardProps> = ({ ...track }) => { // Make sure 'imageUrl' is defined
  const [status, setStatus] = useState<Track['status']>('ToDo');
  const placeholderImage = '/bouldering-placeholder.jpeg';
  const borderColorClass = `border-${getColorForLevel(track.level)}`;

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 relative rounded-full overflow-hidden border-4 ${borderColorClass}`}>
            <Image src={track.imageUrl || placeholderImage} alt="Climbing Track" layout="fill" objectFit="cover" />
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white">{track.name}</h4>
          <p className="text-sm text-gray-300">{track.date.getDate()}</p>
        </div>
      </div>
      <div>
        <select
          value={status}
            onChange={(e) => setStatus(e.target.value as Track['status'])}
          className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-white bg-gray-800 bg-clip-padding bg-no-repeat border border-gray-600 rounded transition ease-in-out m-0 focus:text-white focus:bg-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="ToDo">To do</option>
          <option value="InProgress">Working on it</option>
          <option value="Done">Done</option>
        </select>
      </div>

    </div>
  );
};

export default ClimbingTrackCard;
