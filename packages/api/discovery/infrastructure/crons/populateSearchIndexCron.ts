import { Cron, FunctionDefinition, Stack } from 'sst/constructs';

import { CronJobIDs } from '../constants/cronJobIDs';

const EVERY_HOUR_AT_15_MINUTES_PAST = 'cron(15 * * * ? *)';

export function populateSearchIndexCron(stack: Stack, functionDefinition: FunctionDefinition): Cron {
  return new Cron(stack, CronJobIDs.POPULATE_SEARCH_INDEX, {
    job: {
      function: functionDefinition,
    },
    schedule: EVERY_HOUR_AT_15_MINUTES_PAST,
    enabled: false,
  });
}
