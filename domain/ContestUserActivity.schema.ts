import { z } from "zod"

export const ContestUserActivitySchema = z.object({
  id: z.number(),
  contestUserId: z.number(),
  contestActivityId: z.number(),
  score: z.number(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateContestUserActivitySchema = ContestUserActivitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateContestUserActivitySchema = CreateContestUserActivitySchema.partial()

export type ContestUserActivity = z.infer<typeof ContestUserActivitySchema>
export type CreateContestUserActivity = z.infer<typeof CreateContestUserActivitySchema>
export type UpdateContestUserActivity = z.infer<typeof UpdateContestUserActivitySchema> 