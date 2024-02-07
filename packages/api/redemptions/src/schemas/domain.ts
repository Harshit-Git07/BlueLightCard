import { z } from 'zod';

import { platformEnum } from '../database/schema';

export const PLATFORM_SCHEMA = z.enum(platformEnum.enumValues);
