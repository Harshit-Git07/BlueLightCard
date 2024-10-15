import { Cron, FunctionDefinition, Stack } from 'sst/constructs';

import { isStaging } from '@blc-mono/core/utils/checkEnvironment';

import { CronJobIDs } from '../constants/cronJobIDs';

const EVERY_12_HOURS = 'cron(0 0/12 * * ? *)';

export function deleteOldSearchIndicesCron(stack: Stack, functionDefinition: FunctionDefinition): Cron {
  return new Cron(stack, CronJobIDs.DELETE_OLD_SEARCH_INDICES, {
    job: {
      function: functionDefinition,
    },
    schedule: EVERY_12_HOURS,
    enabled: isStaging(stack.stage),
  });
}
