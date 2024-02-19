import { z } from 'zod';

export const WELL_KNOWN_PORTS_SCHEMA = z.coerce.number().int().min(1024).max(65535);
export const NON_NEGATIVE_INT = z.number().nonnegative().int();
export const DATE_YYYY_MM_DD_SCHEMA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
