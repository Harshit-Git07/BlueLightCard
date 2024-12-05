import { getEnv } from '@blc-mono/core/utils/getEnv';
import { OpenSearchService } from '@blc-mono/core/aws/opensearch/OpenSearchService';
import { OpenSearchBulkUpdateCommand } from '@blc-mono/members/application/handlers/admin/opensearch/service/opensearchMemberProfileDocument';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { logger } from '@blc-mono/members/application/middleware';

const service = getEnv(MemberStackEnvironmentKeys.SERVICE);
const stage = getEnv(MemberStackEnvironmentKeys.STAGE);

export class MembersOpenSearchService extends OpenSearchService {
  constructor() {
    const searchDomainHost = getEnv(MemberStackEnvironmentKeys.OPENSEARCH_DOMAIN_ENDPOINT);
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
}
