import { z } from "zod";

export const HoldColorEnum = z.enum(['Unknown', 'Green', 'Red', 'Blue', 'Yellow', 'White', 'Black', 'Orange', 'Pink', 'Purple']);
