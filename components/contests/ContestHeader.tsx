"use client";
import React from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Contest } from "@/domain/Contest.schema";
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import ContestStatus from '../ui/ContestStatus';

type ContestHeaderProps = Pick<Contest, 'name' | 'date' | 'status' | 'coverImage'>;

const ContestHeader: React.FC<ContestHeaderProps> = ({ name, date, status, coverImage }) => {
  return (
    <>
      <div className="flex w-full dark:bg-black snap-x snap-mandatory overflow-x-auto scrollbar-custom">
        {coverImage ? (
          coverImage.split(' ').map((url, index) => (
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

      <div className="p-4 w-full sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 sm:m-4">
        <div className="flex justify-start items-center mb-3">
          <h1 className="text-xl font-bold">{name}</h1>
        </div>

        <div className="flex justify-between items-center gap-2 mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {date ? date.toLocaleDateString() : '...'}
          </span>
          <ContestStatus status={status} />
        </div>
      </div>
    </>
  );
};

export default ContestHeader;