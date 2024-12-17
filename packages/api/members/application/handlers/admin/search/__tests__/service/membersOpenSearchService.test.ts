import * as getEnvModule from '@blc-mono/core/utils/getEnv';

jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchService';
import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';

const mockBulkCreate = jest.fn().mockResolvedValue({ statusCode: 200 });

describe('MembersOpenSearchService', () => {
  let openSearchService: MembersOpenSearchService;
  const indexName = 'test-index';

  const baseSearchResult: MemberDocumentModel = {
    memberId: '123',
    firstName: 'John',
    lastName: 'Doe',
  };
  const mockSearchHit = {
    _source: {
      ...baseSearchResult,
    },
  };
  const mockSearch = jest.fn().mockResolvedValue({
    body: {
      hits: {
        total: {
          value: 1,
        },
        hits: [mockSearchHit],
      },
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    openSearchService = new MembersOpenSearchService();
    jest.spyOn(openSearchService['openSearchClient'], 'bulk').mockImplementation(mockBulkCreate);
    jest.spyOn(openSearchService['openSearchClient'], 'search').mockImplementation(mockSearch);
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

  describe('searchProfiles', () => {
    it('should search index', async () => {
      const results = await openSearchService.searchProfiles({
        pageIndex: 1,
        firstName: 'John',
      });

      expect(mockSearch).toHaveBeenCalled();
      expect(results).toEqual({
        pageNumber: 1,
        totalResults: 1,
        results: [
          {
            memberId: '123',
            firstName: 'John',
            lastName: 'Doe',
          },
        ],
      });
    });
  });
});
