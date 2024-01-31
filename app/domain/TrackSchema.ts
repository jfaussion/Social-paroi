import { z } from 'zod';

// Define the schema for a track
export const TrackSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  imageUrl: z.string().optional(),
  holdColor: z.string().optional(),
  level: z.enum(['Unknown', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Difficult', 'FuckingHard', 'Legendary']).default('Unknown'),
  status: z.enum(['ToDo', 'InProgress', 'Done']).default('ToDo'),
});

export type Track = z.infer<typeof TrackSchema>;

export const getColorForLevel = (level: string): string => {
  const levelColorMapping = {
    Unknown: 'gray-500',
    Beginner: 'white',
    Easy: 'green-500',
    Intermediate: 'blue-500',
    Advanced: 'pink-500',
    Difficult: 'red-500',
    FuckingHard: 'yellow-500',
    Legendary: 'black',
  };

  return levelColorMapping[level] || 'gray-500'; // default color if level is not found
};



