import { z } from "zod";

export const ContestRankingTypeEnum = z.enum(['Overall', 'Men', 'Women']);
export type ContestRankingType = z.infer<typeof ContestRankingTypeEnum>;

