import { z } from 'zod';

// Define the schema for a track
export const TrackSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  imageUrl: z.string().optional(),
  holdColor: z.string().optional(),
  level: z.enum(['Unknown', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Difficult', 'FuckingHard', 'Legendary']).default('Unknown'),
  status: z.enum(['TO_DO', 'IN_PROGRESS', 'DONE']).nullish().transform(val => val ?? 'TO_DO').default('TO_DO'),
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




