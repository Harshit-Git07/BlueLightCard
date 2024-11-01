import { Cron, FunctionDefinition, Stack } from 'sst/constructs';

import { isStaging } from '@blc-mono/core/utils/checkEnvironment';

import { CronJobIDs } from '../constants/cronJobIDs';

const EVERY_HOUR_AT_15_MINUTES_PAST = 'cron(15 * * * ? *)';
const EVERY_2_MINUTES = 'rate(2 minutes)';

export function populateSearchIndexCron(stack: Stack, functionDefinition: FunctionDefinition): Cron {
  return new Cron(stack, CronJobIDs.POPULATE_SEARCH_INDEX, {
    job: {
      function: functionDefinition,
    },
    schedule: isStaging(stack.stage) ? EVERY_2_MINUTES : EVERY_HOUR_AT_15_MINUTES_PAST,
    enabled: true,
  });
}
