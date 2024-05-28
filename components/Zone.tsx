import React from 'react';
import Image from 'next/image';


interface ZoneProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  zone: number;
  height?: number;
  width?: number;
}

export function Zone({ zone, height, width }: ZoneProps, ) {


  return (
    <Image src={`/zone${zone}-room-map.png`} alt="Climbing Track - place holder" width={width} height={height} className='dark:invert' />
  );
}