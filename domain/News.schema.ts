import { z } from 'zod';

export const NewsSchema = z.object({
  id: z.number(),
  date: z.date(),
  title: z.string(),
  content: z.string(),
  deleted: z.boolean().default(false),
  userId: z.string(),

});

export type News = z.infer<typeof NewsSchema>;





