import { z } from 'zod';

export const WELL_KNOWN_PORTS_SCHEMA = z.coerce.number().int().min(1024).max(65535);
