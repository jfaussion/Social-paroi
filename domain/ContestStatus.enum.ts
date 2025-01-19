import { z } from "zod";

export const ContestStatusEnum = z.enum(['Created', 'InProgress', 'Over']);
export type ContestStatusType = z.infer<typeof ContestStatusEnum>;