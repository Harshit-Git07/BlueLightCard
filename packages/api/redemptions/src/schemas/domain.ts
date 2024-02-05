import { z } from 'zod';

export const PLATFORM_SCHEMA = z.enum(['BLC_UK', 'BLC_AU', 'DDS_UK']);
export type Platform = z.infer<typeof PLATFORM_SCHEMA>;
