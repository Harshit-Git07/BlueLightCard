import { z } from 'zod';

import { platformEnum } from '../../../redemptions/libs/database/schema';

export const PLATFORM_SCHEMA = z.enum(platformEnum.enumValues);
