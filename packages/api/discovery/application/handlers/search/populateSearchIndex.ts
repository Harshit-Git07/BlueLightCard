import 'dd-trace/init';

import { Logger } from '@aws-lambda-powertools/logger';
import { datadog } from 'datadog-lambda-js';
import { format } from 'date-fns';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { mapOfferToOpenSearchBody, OpenSearchBulkCommand } from '@blc-mono/discovery/application/models/OpenSearchType';
import { OpenSearchService } from '@blc-mono/discovery/application/services/OpenSearchService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { getNonLocalOffers } from '../../repositories/Offer/service/OfferService';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const logger = new Logger({ serviceName: 'populate-search-index' });

const openSearchService = new OpenSearchService();

const buildIndexName = (service: string, environment: string, name: string) => {
  const timeZoneTimeISO = new Date().toISOString();
  const formattedTime = format(new Date(timeZoneTimeISO), 'Hdmy');
  return `${service}-${environment}-${name}-${formattedTime}00`;
};

const createOpenSearchDocuments = (items: Offer[]) => {
  const result: OpenSearchBulkCommand[] = [];
  items.forEach((item) => {
    result.push({ create: {} });
    result.push(mapOfferToOpenSearchBody(item));
  });

  return result;
};

const service = getEnv(DiscoveryStackEnvironmentKeys.SERVICE);
const environment = getEnv(DiscoveryStackEnvironmentKeys.STAGE);
const indexType = 'offers';

export const handlerUnwrapped = async () => {
  const offers = await getNonLocalOffers();
  try {
    if (offers.length > 0) {
      const openSearchRequestBody = createOpenSearchDocuments(offers);
      const indexName = buildIndexName(service, environment, indexType);
      await openSearchService.addDocumentsToIndex(openSearchRequestBody, indexName.toLowerCase());
    } else {
      logger.error('No offers or companies found in dynamoDB');
      return;
    }
  } catch (err) {
    logger.error('Error building search index', JSON.stringify(err));
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
