import React from 'react';
import Image from 'next/image';
import placeholderZone from '@/public/zone1-room-map.png';

interface ZoneProps {
  miniMapUrl?: string | null;
  zoneName?: string;
  height?: number;
  width?: number;
}

export function Zone({ miniMapUrl, zoneName, height, width }: ZoneProps) {
  if (miniMapUrl) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const src = miniMapUrl.startsWith('http')
      ? miniMapUrl
      : `https://res.cloudinary.com/${cloudName}/image/upload/${miniMapUrl}`;

    return (
      <Image
        src={src}
        alt={zoneName ?? 'Zone map'}
        width={width ?? 60}
        height={height ?? 50}
        unoptimized
        className='dark:invert'
      />
    );
  }

  return (
    <Image
      src={placeholderZone}
      alt="Climbing Track - place holder"
      width={width}
      height={height}
      className='dark:invert'
    />
  );
}
