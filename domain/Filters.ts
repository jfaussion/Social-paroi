import { z } from "zod";

export const FiltersSchema = z.object({
  zones: z.array(z.number()).optional(),
  difficulties: z.array(z.string()).optional(),
  showRemoved: z.string().optional(),
  holdColor: z.string().optional(),
});

export type Filters = z.infer<typeof FiltersSchema>;