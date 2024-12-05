import * as getEnvModule from '@blc-mono/core/src/utils/getEnv';
import { OpenSearchService } from '@blc-mono/core/src/aws/opensearch/OpenSearchService';
import { LambdaLogger } from '@blc-mono/core/src/utils/logger'

jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

const mockExists = jest.fn().mockResolvedValue({ body: true });
const mockAddBlock = jest.fn().mockResolvedValue({});
const mockClone = jest.fn().mockResolvedValue({});
const mockPutSettings = jest.fn().mockResolvedValue({});
const mockCreate = jest.fn().mockResolvedValue({ acknowledged: true });
const mockDelete = jest.fn().mockResolvedValue({ acknowledged: true });

const logger = new LambdaLogger({ serviceName: 'openSearch' });

describe('OpenSearchService', () => {
  let openSearchService: OpenSearchService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    openSearchService = new OpenSearchService('search-domain', logger);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'exists').mockImplementation(mockExists);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'addBlock').mockImplementation(mockAddBlock);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'clone').mockImplementation(mockClone);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'putSettings').mockImplementation(mockPutSettings);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'create').mockImplementation(mockCreate);
    jest.spyOn(openSearchService['openSearchClient'].indices, 'delete').mockImplementation(mockDelete);
  });

  it('should check if an index exists', async () => {
    const indexName = 'index-name';

    const result = await openSearchService.indexExists(indexName);

    expect(mockExists).toHaveBeenCalledWith({
      index: indexName,
    });
    expect(result).toBe(true);
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

  it('throw error when cloning an index fails', async () => {
    const sourceIndexName = 'draft-test-index';
    const targetIndexName = 'test-index';

    mockClone.mockRejectedValue(new Error('error'));

    await expect(openSearchService.cloneIndex(sourceIndexName, targetIndexName)).rejects.toThrow('error');
  });

  it('should delete an index', async () => {
    const indexName = 'index-name';

    await openSearchService.deleteIndex(indexName);

    expect(mockDelete).toHaveBeenCalledWith({
      index: indexName,
    });
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
