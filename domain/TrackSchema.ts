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
  holdColor: z.enum(['Unknown', 'Green', 'Red', 'Blue', 'Yellow', 'White', 'Black', 'Orange', 'Pink', 'Purple']).nullish().transform(val => val ?? 'Unknown').default('Unknown'),
  level: z.enum(['Unknown', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Difficult', 'FuckingHard', 'Legendary']).default('Unknown'),
  status: z.enum([TrackStatus.TO_DO, TrackStatus.IN_PROGRESS, TrackStatus.DONE]).nullish().transform(val => val ?? TrackStatus.TO_DO).default(TrackStatus.TO_DO),
  zone: z.number(),
  points: z.number(),
});

export type Track = z.infer<typeof TrackSchema>;

export const getColorClassForLevel = (property: 'bg' | 'border', level: Track['level']): string => {
  const levelColorMapping: { [K in Track['level']]?: string } = {
    Unknown: `${property}-gray-500`,
    Beginner: `${property}-white`,
    Easy: `${property}-green-500`,
    Intermediate: `${property}-blue-500`,
    Advanced: `${property}-pink-500`,
    Difficult: `${property}-red-500`,
    FuckingHard: `${property}-yellow-500`,
    Legendary: `${property}-black`,
  };

  return levelColorMapping[level] ?? `${property}-gray-500`;
};

export const getColorClassForHold = (property: 'bg' | 'border', level: Track['holdColor']): string => {
  const holdColorMapping: { [K in Track['holdColor']]?: string } = {
    Unknown: `${property}-gray-500`,
    Red: 'bg-red-500',
    Green: `${property}-green-500`,
    Blue: `${property}-blue-500`,
    Yellow: `${property}-yellow-500`,
    White: `${property}-white`, 
    Black: `${property}-black`, 
    Orange: `${property}-orange-500`, 
    Pink: `${property}-pink-500`,
    Purple: `${property}-purple-500`
  };

  return holdColorMapping[level] ?? 'bg-gray-500';
};





