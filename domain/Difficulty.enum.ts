import { z } from "zod";

export const DifficultyEnum = z.enum(['Unknown', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Difficult', 'FuckingHard', 'Legendary']);

export type DifficultyType = z.infer<typeof DifficultyEnum>;
