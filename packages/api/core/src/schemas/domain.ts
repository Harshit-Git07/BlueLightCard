import { z } from 'zod';

import { platformEnum } from '../../../redemptions/libs/database/schema';

export const PLATFORM_SCHEMA = z.enum(platformEnum.enumValues);

// This is the client type provided in the X-Client-Type header in API requests.
export const ClientTypeSchema = z.enum(['web', 'mobile']);
export type ClientType = z.infer<typeof ClientTypeSchema>;
