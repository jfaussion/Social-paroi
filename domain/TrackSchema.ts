import { z } from 'zod';

export enum TrackStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// Define the schema for a track
export const TrackSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  imageUrl: z.string().optional(),
  holdColor: z.string().optional(),
  level: z.enum(['Unknown', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Difficult', 'FuckingHard', 'Legendary']).default('Unknown'),
  status: z.enum([TrackStatus.TO_DO, TrackStatus.IN_PROGRESS, TrackStatus.DONE]).nullish().transform(val => val ?? TrackStatus.TO_DO).default(TrackStatus.TO_DO),
  zone: z.number(),
  points: z.number(),
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
    Beginner: 'bg-white',
    Easy: 'bg-green-500',
    Intermediate: 'bg-blue-500',
    Advanced: 'bg-pink-500',
    Difficult: 'bg-red-500',
    FuckingHard: 'bg-yellow-500',
    Legendary: 'bg-black',
  };

  return levelColorMapping[level] ?? 'bg-gray-500';
};





