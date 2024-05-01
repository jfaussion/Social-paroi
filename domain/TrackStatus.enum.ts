import { z } from "zod";

export enum TrackStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const TrackStatusEnum = z.enum([TrackStatus.TO_DO, TrackStatus.IN_PROGRESS, TrackStatus.DONE]);

export type TrackStatusType = z.infer<typeof TrackStatusEnum>;