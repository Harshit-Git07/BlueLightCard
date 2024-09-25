import { Client } from '@opensearch-project/opensearch';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
import { defaultProvider } from '@aws-sdk/credential-provider-node';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { OpenSearchBulkCommand } from '@blc-mono/discovery/application/models/OpenSearchType';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

const logger = new LambdaLogger({ serviceName: 'openSearch' });

export class OpenSearchService {
  private openSearchClient: Client;

  constructor() {
    const searchDomainHost = getEnv(DiscoveryStackEnvironmentKeys.OPENSEARCH_DOMAIN_ENDPOINT);
    const searchDomainContainsProtocol = searchDomainHost.includes('http');

    this.openSearchClient = new Client({
      ...AwsSigv4Signer({
        region: process.env.AWS_REGION ?? 'eu-west-2',
        service: 'es',
        getCredentials: () => {
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
        },
      }),
      node: searchDomainContainsProtocol ? searchDomainHost : `https://${searchDomainHost}`,
    });
  }

  public async doesIndexExist(indexName: string): Promise<boolean> {
    const response = await this.openSearchClient.indices.exists({
      index: indexName,
    });

    logger.info({ message: `Response from checking if index ${indexName} exists was ${response.body}` });
    return response.body;
  }

  public async createIndex(indexName: string): Promise<void> {
    const settings = {
      settings: {
        index: {
          number_of_shards: 2,
          number_of_replicas: 0,
        },
      },
    };

    const response = await this.openSearchClient.indices.create({
      index: indexName,
      body: settings,
    });

    logger.info({ message: `Response from creating index ${indexName} was ${response.statusCode}` });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async addDocumentToIndex(document: any, indexName: string): Promise<void> {
    const id = '1';

    const response = await this.openSearchClient.index({
      id,
      index: indexName,
      body: document,
      refresh: true,
    });
    logger.info({ message: `Response from adding document to index ${indexName} was ${response.statusCode}` });
  }

  public async addDocumentsToIndex(documents: OpenSearchBulkCommand[], indexName: string): Promise<void> {
    const response = await this.openSearchClient.bulk({ body: documents, index: indexName, refresh: true });
    logger.info({
      message: `Response from adding documents to index ${indexName} was ${response.statusCode} - ${JSON.stringify(response.body)}`,
    });
  }

  public async queryIndex(term: string, indexName: string): Promise<void> {
    const query = {
      query: {
        match: {
          title: {
            query: term,
          },
        },
      },
    };

    const response = await this.openSearchClient.search({
      index: indexName,
      body: query,
    });

    logger.info({
      message: `Response from querying index ${indexName} was ${response.statusCode} - ${JSON.stringify(
        response.body,
      )}`,
    });
  }

  public async deleteIndex(indexName: string): Promise<void> {
    const response = await this.openSearchClient.indices.delete({
      index: indexName,
    });

    logger.info({ message: `Response from deleting index ${indexName} was ${response.statusCode}` });
  }
}
