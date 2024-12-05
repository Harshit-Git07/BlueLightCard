import { Logger } from '@aws-lambda-powertools/logger';
import { datadog } from 'datadog-lambda-js';

import { isPr, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const logger = new Logger({ serviceName: 'delete-old-search-indices' });
const openSearchService = new DiscoveryOpenSearchService();

export const handlerUnwrapped = async () => {
  const indicesToDelete: string[] = [];

  indicesToDelete.push(...(await openSearchService.getPublishedIndicesForDeletion()));
  indicesToDelete.push(...(await openSearchService.getDraftIndicesForDeletion()));

  const stage = getEnv(DiscoveryStackEnvironmentKeys.STAGE);

  if (isPr(stage) || isStaging(stage)) {
    indicesToDelete.push(...(await openSearchService.getPrEnvironmentIndicesForDeletion()));
  }

  try {
    if (indicesToDelete.length > 0) {
      logger.info({ message: `Deleting [${indicesToDelete.length}] search indices`, indices: indicesToDelete });
      await Promise.all(indicesToDelete.map((index) => openSearchService.deleteIndex(index)));
    }
  } catch (err) {
    logger.error('Error deleting search indices', JSON.stringify(err));
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
