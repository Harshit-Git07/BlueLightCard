import { z } from 'zod';
import { BRANDS } from '../constants/common';

export const BRANDS_SCHEMA = z.enum(BRANDS);

// This is the client type provided in the X-Client-Type header in API requests.
export const ClientTypeSchema = z.enum(['web', 'mobile']);
export type ClientType = z.infer<typeof ClientTypeSchema>;
