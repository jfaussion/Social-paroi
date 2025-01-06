import { z } from "zod";

export const ContestActivitySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  image: z.string().nullish(),
  contestId: z.number(),
});

export type ContestActivity = z.infer<typeof ContestActivitySchema>;
