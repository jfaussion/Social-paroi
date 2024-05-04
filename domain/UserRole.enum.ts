import { z } from "zod";

export const UserRoleEnum = z.enum(['user', 'admin', 'opener']);