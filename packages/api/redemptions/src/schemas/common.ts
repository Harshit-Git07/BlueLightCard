import { z } from 'zod';

export const WELL_KNOWN_PORTS_SCHEMA = z.coerce.number().int().min(1024).max(65535);
export const NUMERIC_ID_SCHEMA = z.number().nonnegative().int();
export type NumericId = z.infer<typeof NUMERIC_ID_SCHEMA>;
