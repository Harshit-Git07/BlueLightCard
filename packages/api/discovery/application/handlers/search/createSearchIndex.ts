import 'dd-trace/init';

import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { OpenSearchService } from '@blc-mono/discovery/application/services/OpenSearchService';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const logger = new LambdaLogger({ serviceName: 'create-search-index' });

const openSearchService = new OpenSearchService();

const handlerUnwrapped = async () => {
  const indexName = 'dummy_index';
  const sampleDocument = {
    title: 'dummyTitle',
    description: 'dummyDescription',
  };

  try {
    if (await openSearchService.doesIndexExist(indexName)) {
      return { message: 'Index already exists - skipping' };
    }

    await openSearchService.createIndex(indexName);
    await openSearchService.addDocumentToIndex(sampleDocument, indexName);
    await openSearchService.queryIndex(sampleDocument.title, indexName);

    return { message: 'Index Populated' };
  } catch (error) {
    logger.info({ message: `Error creating search index: ${JSON.stringify(error)}` });
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
