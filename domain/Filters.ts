import { z } from "zod";

export const FiltersSchema = z.object({
  zones: z.array(z.number()).optional(),
  difficulties: z.array(z.string()).optional(),
  difficultyIds: z.array(z.number()).optional(),
  showRemoved: z.string().optional(),
  holdColorIds: z.array(z.number()).optional(),
});

export type Filters = z.infer<typeof FiltersSchema>;