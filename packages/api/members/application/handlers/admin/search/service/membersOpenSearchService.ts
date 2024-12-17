import { getEnv } from '@blc-mono/core/utils/getEnv';
import { OpenSearchService } from '@blc-mono/core/aws/opensearch/OpenSearchService';
import { OpenSearchBulkUpdateCommand } from '@blc-mono/members/application/handlers/admin/search/service/opensearchMemberProfileDocument';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { logger } from '@blc-mono/members/application/middleware';
import {
  MemberDocumentsSearchModel,
  MemberDocumentsSearchResponseModel,
} from '@blc-mono/members/application/models/memberDocument';
import {
  buildOpenSearchRequest,
  mapOpenSearchResultsToMemberDocuments,
} from '@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchRequest';
import { SearchResponse } from '@opensearch-project/opensearch/api/types';

const service = getEnv(MemberStackEnvironmentKeys.SERVICE);
const stage = getEnv(MemberStackEnvironmentKeys.STAGE);

export class MembersOpenSearchService extends OpenSearchService {
  constructor() {
    const searchDomainHost = getEnv(MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT);
    super(searchDomainHost);
  }

  public getMemberProfilesIndexName(): string {
    return `${service}-${stage}-member-profiles`.toLowerCase();
  }

  public async upsertDocumentsToIndex(
    documents: OpenSearchBulkUpdateCommand[],
    indexName: string,
  ): Promise<void> {
    const response = await this.openSearchClient.bulk({
      body: documents,
      index: indexName,
    });
    logger.debug({
      message: `Response from upserting documents to index ${indexName} was ${response.statusCode} - ${JSON.stringify(response.body)}`,
    });
  }

  public async searchProfiles(
    filterParams: MemberDocumentsSearchModel,
  ): Promise<MemberDocumentsSearchResponseModel> {
    const indexName = this.getMemberProfilesIndexName();

    const searchBody = buildOpenSearchRequest(filterParams);

    const response = await this.openSearchClient.search({
      index: indexName,
      body: searchBody.body,
    });

    const responseBody = response.body as SearchResponse;

    return {
      results: mapOpenSearchResultsToMemberDocuments(responseBody),
      pageNumber: filterParams.pageIndex,
      totalResults:
        typeof responseBody.hits.total === 'number'
          ? responseBody.hits.total
          : responseBody.hits.total.value,
    };
  }
}
