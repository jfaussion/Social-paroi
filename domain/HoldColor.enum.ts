import { z } from "zod";

export const HoldColorEnum = z.enum(['Unknown', 'Green', 'Red', 'Blue', 'Yellow', 'White', 'Black', 'Orange', 'Pink', 'Purple']);

type HoldColorType = z.infer<typeof HoldColorEnum>;

export const getBgColorForHold = (hold: HoldColorType): string => {
  const holdColorMapping: { [K in HoldColorType]?: string } = {
    Unknown: 'bg-gray-600',
    Red: 'bg-red-500',
    Green: 'bg-green-500',
    Blue: 'bg-blue-500',
    Yellow: 'bg-yellow-500',
    White: 'bg-white border dark:border-none border-black', 
    Black: 'bg-black dark:border dark:border-white', 
    Orange: 'bg-orange-500', 
    Pink: 'bg-pink-500',
    Purple: 'bg-purple-500'
  };

  return holdColorMapping[hold] ?? 'bg-gray-500';
};