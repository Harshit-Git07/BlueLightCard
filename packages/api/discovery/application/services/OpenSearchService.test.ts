import { subDays } from 'date-fns';

import * as getEnvModule from '@blc-mono/core/utils/getEnv';
jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());
import { openSearchFieldMapping } from '@blc-mono/discovery/application/models/OpenSearchFieldMapping';

import { OpenSearchService } from './OpenSearchService';

const mockCreate = jest.fn().mockResolvedValue({ acknowledged: true });
const mockAddBlock = jest.fn().mockResolvedValue({});
const mockClone = jest.fn().mockResolvedValue({});
const mockPutSettings = jest.fn().mockResolvedValue({});
const mockIndex = jest.fn().mockResolvedValue({ result: 'created' });
const mockSearchHit = {
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
};
const mockSearch = jest.fn().mockResolvedValue({
  body: {
    hits: {
      hits: [mockSearchHit],
    },
  },
});
const mockDelete = jest.fn().mockResolvedValue({ acknowledged: true });
const mockExists = jest.fn().mockResolvedValue({ body: true });
const mockGetLatestWithPublishedIndices = (numberOfIndices: number) => {
  const indices = Array.from({ length: numberOfIndices }, (_, i) => ({
    index: `service-stage-offers-01020200${i}`,
    'creation.date.string': '2020-01-01T00:00:00',
  }));
  return jest.fn().mockResolvedValue({ body: indices });
};
const mockGetLatestWithPRIndices = (creationDate: string) =>
  jest
    .fn()
    .mockResolvedValue({ body: [{ index: `service-pr-101-offers-010202000`, 'creation.date.string': creationDate }] });
const mockGetLatestWithDraftIndices = (creationDate: string) =>
  jest.fn().mockResolvedValue({
    body: [{ index: `draft-service-stage-offers-010202000`, 'creation.date.string': creationDate }],
  });
const mockBulkCreate = jest.fn().mockResolvedValue({ statusCode: 200 });

describe('OpenSearchService', () => {
  let openSearchService: OpenSearchService;
  const indexName = 'test-index';
  const sampleDocument = {
    title: 'dummyTitle',
    description: 'dummyDescription',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    openSearchService = new OpenSearchService();
    jest.spyOn(openSearchService['openSearchClient'].indices, 'create').mockImplementation(mockCreate);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'addBlock').mockImplementation(mockAddBlock);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'clone').mockImplementation(mockClone);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'putSettings').mockImplementation(mockPutSettings);
    jest.spyOn(openSearchService['openSearchClient'], 'index').mockImplementation(mockIndex);
    jest.spyOn(openSearchService['openSearchClient'], 'search').mockImplementation(mockSearch);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'delete').mockImplementation(mockDelete);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'exists').mockImplementation(mockExists);
    jest
      .spyOn(openSearchService['openSearchClient'].cat, 'indices')
      .mockImplementation(mockGetLatestWithPublishedIndices(2));

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
        mappings: {
          properties: openSearchFieldMapping,
        },
      },
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('should clone an index', async () => {
    const sourceIndexName = 'draft-test-index';
    const targetIndexName = 'test-index';

    await openSearchService.cloneIndex(sourceIndexName, targetIndexName);

    expect(mockAddBlock).toHaveBeenCalledWith({
      index: sourceIndexName,
      block: 'write',
    });
    expect(mockClone).toHaveBeenCalledWith({
      index: sourceIndexName,
      target: targetIndexName,
    });
    expect(mockPutSettings).toHaveBeenCalledWith({
      index: sourceIndexName,
      body: { index: { blocks: { write: false } } },
    });
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

  it('should return unique search results', async () => {
    const mockSearchWithDuplicates = jest.fn().mockResolvedValue({
      body: {
        hits: {
          hits: [mockSearchHit, mockSearchHit],
        },
      },
    });
    jest.spyOn(openSearchService['openSearchClient'], 'search').mockImplementation(mockSearchWithDuplicates);

    const results = await openSearchService.queryIndex(sampleDocument.title, indexName, '2001-01-01');

    expect(results).toStrictEqual([
      {
        ID: '123',
        OfferName: 'OfferName',
        OfferType: '1',
        offerimg: 'img',
        CompID: '456',
        CompanyName: 'CompanyName',
      },
    ]);
  });

  it('should return max 40 search results', async () => {
    const searchHits = [];
    for (let i = 0; i < 41; i++) {
      const searchHit = {
        _source: {
          offer_id: `${i}`,
        },
      };
      searchHits.push({ ...searchHit });
    }
    const mockSearchWith41Results = jest.fn().mockResolvedValue({
      body: {
        hits: {
          hits: searchHits,
        },
      },
    });
    jest.spyOn(openSearchService['openSearchClient'], 'search').mockImplementation(mockSearchWith41Results);

    const results = await openSearchService.queryIndex(sampleDocument.title, indexName, '2001-01-01');

    expect(results.length).toBe(40);
  });

  it('should delete an index', async () => {
    await openSearchService.deleteIndex(indexName);

    expect(mockDelete).toHaveBeenCalledWith({
      index: indexName,
    });

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  describe('getPublishedIndicesForDeletion', () => {
    it('should get no indices for deletion if less than 2 indices returned', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPublishedIndices(1));

      const result = await openSearchService.getPublishedIndicesForDeletion();

      expect(result).toEqual([]);
    });

    it('should get no indices for deletion if 2 indices returned', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPublishedIndices(2));

      const result = await openSearchService.getPublishedIndicesForDeletion();

      expect(result).toEqual([]);
    });

    it('should get indices for deletion if greater than 2 indices returned', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPublishedIndices(3));

      const result = await openSearchService.getPublishedIndicesForDeletion();

      expect(result).toEqual(['service-stage-offers-010202000']);
    });
  });

  describe('getDraftIndicesForDeletion', () => {
    it('should get no indices for deletion if no draft indices returned', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPublishedIndices(1));

      const result = await openSearchService.getDraftIndicesForDeletion();

      expect(result).toEqual([]);
    });

    it('should get indices for deletion if draft indices returned older than 7 days', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithDraftIndices(subDays(new Date(), 8).toISOString()));

      const result = await openSearchService.getDraftIndicesForDeletion();

      expect(result).toEqual(['draft-service-stage-offers-010202000']);
    });

    it('should get no indices for deletion if draft indices returned younger than 7 days', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithDraftIndices(new Date().toISOString()));

      const result = await openSearchService.getDraftIndicesForDeletion();

      expect(result).toEqual([]);
    });
  });

  describe('getPrIndicesForDeletion', () => {
    it('should get no indices for deletion if no pr indices returned', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPublishedIndices(1));

      const result = await openSearchService.getPrEnvironmentIndicesForDeletion();

      expect(result).toEqual([]);
    });

    it('should get indices for deletion if pr indices returned older than 7 days', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPRIndices(subDays(new Date(), 8).toISOString()));

      const result = await openSearchService.getPrEnvironmentIndicesForDeletion();

      expect(result).toEqual(['service-pr-101-offers-010202000']);
    });

    it('should get no indices for deletion if pr indices returned younger than 7 days', async () => {
      jest
        .spyOn(openSearchService['openSearchClient'].cat, 'indices')
        .mockImplementation(mockGetLatestWithPRIndices(new Date().toISOString()));

      const result = await openSearchService.getPrEnvironmentIndicesForDeletion();

      expect(result).toEqual([]);
    });
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
