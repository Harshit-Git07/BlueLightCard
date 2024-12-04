import { Cron, FunctionDefinition, Stack } from 'sst/constructs';

import { isPr, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

import { CronJobIDs } from '../constants/cronJobIDs';

const EVERY_12_HOURS = 'cron(0 0/12 * * ? *)';
const EVERY_HOUR = 'rate(1 hour)';

export function deleteOldSearchIndicesCron(stack: Stack, functionDefinition: FunctionDefinition): Cron {
  return new Cron(stack, CronJobIDs.DELETE_OLD_SEARCH_INDICES, {
    job: {
      function: functionDefinition,
    },
    schedule: isStaging(stack.stage) || isPr(stack.stage) ? EVERY_HOUR : EVERY_12_HOURS,
    enabled: isProduction(stack.stage) || isStaging(stack.stage) || isPr(stack.stage),
  });
}
