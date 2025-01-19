import { z } from "zod"
import { TrackStatusEnum } from "./TrackStatus.enum"

export const ContestUserTrackSchema = z.object({
  id: z.number(),
  contestUserId: z.number(),
  contestTrackId: z.number(),
  status: TrackStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateContestUserTrackSchema = ContestUserTrackSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateContestUserTrackSchema = CreateContestUserTrackSchema.partial()

export type ContestUserTrack = z.infer<typeof ContestUserTrackSchema>
export type CreateContestUserTrack = z.infer<typeof CreateContestUserTrackSchema>
export type UpdateContestUserTrack = z.infer<typeof UpdateContestUserTrackSchema> 