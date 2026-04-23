import { z } from "zod";

export const LocationStatusEnum = z.enum(['published', 'hidden']);
export type LocationStatusType = z.infer<typeof LocationStatusEnum>;

export const LocationStatus = LocationStatusEnum.enum;
