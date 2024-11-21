import { z } from 'zod';

export const ContestSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  date: z.date(),
  coverImage: z.string().url().optional(),
});

export type Contest = z.infer<typeof ContestSchema>;