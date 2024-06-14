import { z } from "zod";

export const RemovedEnum = z.enum(['YES', 'NO', 'ONLY']);

export type RemovedEnumType = z.infer<typeof RemovedEnum>;