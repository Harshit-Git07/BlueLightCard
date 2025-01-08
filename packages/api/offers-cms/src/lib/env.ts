import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    BRAND: z.string(),
    OFFERS_DISCOVERY_EVENT_BUS_NAME: z.string().optional(),
    OFFERS_CMS_ACCOUNT: z.string().optional(),
    DWH_FIREHOSE_COMPANY_LOCATION_STREAM_NAME: z.string().optional(),
    DWH_FIREHOSE_MENU_STREAM_NAME: z.string().optional(),
    DWH_FIREHOSE_THEMED_MENU_STREAM_NAME: z.string().optional(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
