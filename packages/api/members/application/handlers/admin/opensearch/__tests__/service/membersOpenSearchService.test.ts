import * as getEnvModule from '@blc-mono/core/utils/getEnv';
jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/opensearch/service/membersOpenSearchService';

const mockBulkCreate = jest.fn().mockResolvedValue({ statusCode: 200 });

describe('MembersOpenSearchService', () => {
  let openSearchService: MembersOpenSearchService;
  const indexName = 'test-index';

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    openSearchService = new MembersOpenSearchService();
    jest.spyOn(openSearchService['openSearchClient'], 'bulk').mockImplementation(mockBulkCreate);
  });

  it('should get member profiles index name', () => {
    const result = openSearchService.getMemberProfilesIndexName();
    expect(result).toEqual('service-stage-member-profiles');
  });

  it('should upsert multiple documents to an index', async () => {
    await openSearchService.upsertDocumentsToIndex([], indexName);
    expect(mockBulkCreate).toHaveBeenCalledTimes(1);
    expect(mockBulkCreate).toHaveBeenCalledWith({
      body: [],
      index: indexName,
    });
  });
});
