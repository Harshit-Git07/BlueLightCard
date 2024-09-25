import { getEnv } from '@blc-mono/core/utils/getEnv'; // Ensure the correct import of getEnv
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { OpenSearchService } from './OpenSearchService';

jest.mock('@blc-mono/core/utils/getEnv');

const mockCreate = jest.fn().mockResolvedValue({ acknowledged: true });
const mockIndex = jest.fn().mockResolvedValue({ result: 'created' });
const mockSearch = jest.fn().mockResolvedValue({ result: 'created' });
const mockDelete = jest.fn().mockResolvedValue({ acknowledged: true });
const mockExists = jest.fn().mockResolvedValue({ body: true });
const mockBulkCreate = jest.fn().mockResolvedValue({ statusCode: 200 });

(getEnv as jest.Mock).mockReturnValue('hostname');

const openSearchService = new OpenSearchService();

describe('OpenSearchService', () => {
  const indexName = 'test-index';
  const sampleDocument = {
    title: 'dummyTitle',
    description: 'dummyDescription',
  };

  beforeEach(() => {
    jest.spyOn(openSearchService['openSearchClient'].indices, 'create').mockImplementation(mockCreate);
    jest.spyOn(openSearchService['openSearchClient'], 'index').mockImplementation(mockIndex);
    jest.spyOn(openSearchService['openSearchClient'], 'search').mockImplementation(mockSearch);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'delete').mockImplementation(mockDelete);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'exists').mockImplementation(mockExists);
    jest.spyOn(openSearchService['openSearchClient'], 'bulk').mockImplementation(mockBulkCreate);
  });

  it('should create an index with the correct settings', async () => {
    const indexName = 'test-index';

    await openSearchService.createIndex(indexName);

    expect(getEnv).toHaveBeenCalledWith(DiscoveryStackEnvironmentKeys.OPENSEARCH_DOMAIN_ENDPOINT);

    expect(mockCreate).toHaveBeenCalledWith({
      index: indexName,
      body: {
        settings: {
          index: {
            number_of_shards: 2,
            number_of_replicas: 0,
          },
        },
      },
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('should add Document To Index', async () => {
    await openSearchService.addDocumentToIndex(sampleDocument, indexName);

    expect(mockIndex).toHaveBeenCalledWith({
      id: '1',
      index: indexName,
      body: sampleDocument,
      refresh: true,
    });

    expect(mockIndex).toHaveBeenCalledTimes(1);
  });

  it('should Search Index', async () => {
    await openSearchService.queryIndex(sampleDocument.title, indexName);

    const query = {
      query: {
        match: {
          title: {
            query: sampleDocument.title,
          },
        },
      },
    };

    expect(mockSearch).toHaveBeenCalledWith({
      index: indexName,
      body: query,
    });

    expect(mockSearch).toHaveBeenCalledTimes(1);
  });

  it('should delete an index', async () => {
    await openSearchService.deleteIndex(indexName);

    expect(mockDelete).toHaveBeenCalledWith({
      index: indexName,
    });

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('should check if an index exists', async () => {
    const result = await openSearchService.doesIndexExist(indexName);

    expect(mockExists).toHaveBeenCalledWith({
      index: indexName,
    });

    expect(result).toBe(true);
  });

  it('should add multiple documents to an index', async () => {
    await openSearchService.addDocumentsToIndex([], indexName);
    expect(mockBulkCreate).toHaveBeenCalledTimes(1);
    expect(mockBulkCreate).toHaveBeenCalledWith({ body: [], index: indexName, refresh: true });
  });
});
