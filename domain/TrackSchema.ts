import { z } from 'zod';

export enum TrackStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const UserTrackProgressSchema = z.object({
  status: z.enum([TrackStatus.TO_DO, TrackStatus.IN_PROGRESS, TrackStatus.DONE]),
  dateCompleted: z.date().optional(),
  updatedAt: z.date().optional(),
  liked: z.boolean().default(false),
});

export const DifficultyEnum = z.enum(['Unknown', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Difficult', 'FuckingHard', 'Legendary']);

// Define the schema for a track
export const TrackSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  imageUrl: z.string().optional(),
  holdColor: z.enum(['Unknown', 'Green', 'Red', 'Blue', 'Yellow', 'White', 'Black', 'Orange', 'Pink', 'Purple']).nullish().transform(val => val ?? 'Unknown').default('Unknown'),
  level: DifficultyEnum.default('Unknown'),
  zone: z.number(),
  points: z.number(),
  trackProgress: UserTrackProgressSchema.optional(),
});

export type Track = z.infer<typeof TrackSchema>;

export const getBorderColorForLevel = (level: Track['level']): string => {
  const levelColorMapping: { [K in Track['level']]?: string } = {
    Unknown: 'border-gray-500',
    Beginner: 'border-white',
    Easy: 'border-green-500',
    Intermediate: 'border-blue-500',
    Advanced: 'border-pink-500',
    Difficult: 'border-red-500',
    FuckingHard: 'border-yellow-500',
    Legendary: 'border-black',
  };

  return levelColorMapping[level] ?? 'border-gray-500';
};

export const getBgColorForLevel = (level: Track['level']): string => {
  const levelColorMapping: { [K in Track['level']]?: string } = {
    Unknown: 'bg-gray-500',
    Beginner: 'bg-white border dark:border-none border-black',
    Easy: 'bg-green-500',
    Intermediate: 'bg-blue-500',
    Advanced: 'bg-pink-500',
    Difficult: 'bg-red-500',
    FuckingHard: 'bg-yellow-500',
    Legendary: 'bg-black dark:border dark:border-white',
  };

  return levelColorMapping[level] ?? 'bg-gray-500';
};

export const getBgColorForHold = (level: Track['holdColor']): string => {
  const holdColorMapping: { [K in Track['holdColor']]?: string } = {
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

  return holdColorMapping[level] ?? 'bg-gray-500';
};





