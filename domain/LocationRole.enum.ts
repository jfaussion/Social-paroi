import { z } from "zod";

export const LocationRoleEnum = z.enum(['opener', 'admin']);
export type LocationRole = z.infer<typeof LocationRoleEnum>;
