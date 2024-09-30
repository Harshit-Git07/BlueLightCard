import 'dd-trace/init';

import { Logger } from '@aws-lambda-powertools/logger';
import { datadog } from 'datadog-lambda-js';

import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { mapOfferToOpenSearchBody, OpenSearchBulkCommand } from '@blc-mono/discovery/application/models/OpenSearchType';
import { OpenSearchService } from '@blc-mono/discovery/application/services/OpenSearchService';

import { getNonLocalOffers } from '../../repositories/Offer/service/OfferService';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const logger = new Logger({ serviceName: 'populate-search-index' });

const openSearchService = new OpenSearchService();

const createOpenSearchDocuments = (items: Offer[]) => {
  const result: OpenSearchBulkCommand[] = [];
  items.forEach((item) => {
    result.push({ create: {} });
    result.push(mapOfferToOpenSearchBody(item));
  });

  return result;
};

export const handlerUnwrapped = async () => {
  const offers = await getNonLocalOffers();
  try {
    if (offers.length > 0) {
      const openSearchRequestBody = createOpenSearchDocuments(offers);
      await openSearchService.addDocumentsToIndex(openSearchRequestBody, openSearchService.generateIndexName());
    } else {
      logger.error('No offers or companies found in dynamoDB');
      return;
    }
  } catch (err) {
    logger.error('Error building search index', JSON.stringify(err));
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
