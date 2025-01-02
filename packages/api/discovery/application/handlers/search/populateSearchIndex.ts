import 'dd-trace/init';

import { Logger } from '@aws-lambda-powertools/logger';
import { datadog } from 'datadog-lambda-js';

import { EventOffer, Offer } from '@blc-mono/discovery/application/models/Offer';
import {
  mapEventToOpenSearchBody,
  mapOfferToOpenSearchBody,
  OpenSearchBulkCommand,
} from '@blc-mono/discovery/application/models/OpenSearchType';
import {
  DiscoveryOpenSearchService,
  draftIndexPrefix,
} from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';

import { getAllEvents } from '../../repositories/Offer/service/EventService';
import { getNonLocalOffers } from '../../repositories/Offer/service/OfferService';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const logger = new Logger({ serviceName: 'populate-search-index' });

const openSearchService = new DiscoveryOpenSearchService();

const createOpenSearchDocuments = (offers: Offer[], events: EventOffer[]) => {
  const result: OpenSearchBulkCommand[] = [];
  offers.forEach((item) => {
    result.push({ create: {} });
    result.push(mapOfferToOpenSearchBody(item));
  });
  events.forEach((item) => {
    result.push({ create: {} });
    result.push(mapEventToOpenSearchBody(item));
  });

  return result;
};

export const handlerUnwrapped = async () => {
  const offers = await getNonLocalOffers();
  const events = await getAllEvents();
  try {
    if (offers.length === 0 && events.length === 0) {
      logger.error('No offers, companies or events found in dynamoDB');
      return;
    }

    const openSearchRequestBody = createOpenSearchDocuments(offers, events);
    const indexName = openSearchService.generateIndexName();
    const draftIndexName = `${draftIndexPrefix}${indexName}`;

    await openSearchService.createIndex(draftIndexName);
    await openSearchService.addDocumentsToIndex(openSearchRequestBody, draftIndexName);
    await openSearchService.cloneIndex(draftIndexName, indexName);
    await openSearchService.deleteIndex(draftIndexName);
  } catch (error) {
    logger.error('Error building search index', JSON.stringify(error));
    throw error;
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
