
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Track } from '../domain/TrackSchema';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";

const TrackDetails: React.FC<Track> = ({ ...track}) => {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 sm:pt-8">
      <div className="flex flex-col items-center bg-gray-900 text-white w-full">
        {/* Image container */}
        <div className="w-full bg-black">
          {/* Replace with an img tag or background-image style as needed */}
          {track?.imageUrl ?
            <CldImage
              width="400"
              height="400"
              src={track.imageUrl}
              crop="thumb"
              alt="Climbing Track"
              className="mx-auto" />
            :
            <Image src={placeholderImage} alt="Climbing Track - place holder" sizes='(max-width: 200px)' className="mx-auto" />}
        </div>

        {/* Track details container */}
        <div className="p-4 w-full max-w-md">
          {/* Name and Done button row */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">Name of the tracks...{track?.id} </h1>
            <button className="bg-green-500 rounded-full p-2">
              {/* Replace with check icon when done */}
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          {/* Zone and Date row */}
          <div className="flex justify-between items-center mb-3">
            <span className="bg-green-600 text-xs font-semibold px-2 py-1 rounded">Zone 2</span>
            <span className="text-sm text-gray-400">14.02.2024</span>
          </div>

          {/* Difficulty and Points row */}
          <div className="flex justify-between items-center mb-3">
            <span className="inline-block w-14 h-3 bg-red-600 rounded-full"></span>
            <span className="text-sm font-semibold">200pts</span>
          </div>

          {/* Hold color row */}
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium mr-2">Hold color</span>
            <span className="inline-block w-14 h-3 bg-pink-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </main>
  )


}

export default TrackDetails;
