import * as getEnvModule from '@blc-mono/core/utils/getEnv';
jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());
import { OpenSearchService } from './OpenSearchService';

const mockCreate = jest.fn().mockResolvedValue({ acknowledged: true });
const mockIndex = jest.fn().mockResolvedValue({ result: 'created' });
const mockSearch = jest.fn().mockResolvedValue({
  body: {
    hits: {
      hits: [
        {
          _source: {
            title: 'dummyTitle',
            description: 'dummyDescription',
            offer_id: '123',
            offer_name: 'OfferName',
            offer_type: '1',
            offer_image: 'img',
            company_id: '456',
            company_name: 'CompanyName',
            restricted_to: [],
          },
        },
      ],
    },
  },
});
const mockDelete = jest.fn().mockResolvedValue({ acknowledged: true });
const mockExists = jest.fn().mockResolvedValue({ body: true });
const mockGetLatest = jest.fn().mockResolvedValue({
  body: [{ index: 'service-stage-offers-010202000' }, { index: 'service-stage-offers-010202001' }],
});
const mockBulkCreate = jest.fn().mockResolvedValue({ statusCode: 200 });

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
    jest.spyOn(openSearchService['openSearchClient'].cat, 'indices').mockImplementation(mockGetLatest);

    jest.spyOn(openSearchService['openSearchClient'], 'bulk').mockImplementation(mockBulkCreate);

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  it('should create an index with the correct settings', async () => {
    const indexName = 'test-index';

    await openSearchService.createIndex(indexName);

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

  it('should Search Index', async () => {
    const results = await openSearchService.queryIndex(sampleDocument.title, indexName, '2001-01-01');

    expect(mockSearch).toHaveBeenCalledTimes(5);
    expect(results[0]).toMatchObject({
      ID: '123',
      OfferName: 'OfferName',
      OfferType: '1',
      offerimg: 'img',
      CompID: '456',
      CompanyName: 'CompanyName',
    });
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

  it('should generate index name', () => {
    const result = openSearchService.generateIndexName();
    expect(result).toEqual('service-stage-offers-1577836800000');
  });

  it('should get the latest index name', async () => {
    const result = await openSearchService.getLatestIndexName();
    expect(result).toEqual('service-stage-offers-010202001');
  });
});
