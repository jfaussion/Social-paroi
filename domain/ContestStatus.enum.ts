import { z } from "zod";

export const ContestStatusEnum = z.enum(['Created', 'Upcoming', 'InProgress', 'Over']);
export type ContestStatusType = z.infer<typeof ContestStatusEnum>;