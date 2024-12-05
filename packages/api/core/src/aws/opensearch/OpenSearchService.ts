import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Client } from '@opensearch-project/opensearch';
import { LambdaLogger } from '../../utils/logger/lambdaLogger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

export class OpenSearchService {
  private readonly logger: LambdaLogger;

  constructor(
    searchDomainHost: string,
    logger?: LambdaLogger,
    readonly openSearchClient: Client = new Client({
      ...AwsSigv4Signer({
        region: process.env.AWS_REGION ?? 'eu-west-2',
        service: 'es',
        getCredentials: () => {
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
        },
      }),
      node: searchDomainHost.includes('http') ? searchDomainHost : `https://${searchDomainHost}`,
    }),
  ) {
    this.logger = logger ?? new LambdaLogger({ serviceName: 'openSearch' });
  }

  public async indexExists(indexName: string): Promise<boolean> {
    const response = await this.openSearchClient.indices.exists({
      index: indexName,
    });

    this.logger.info({ message: `Response from checking if index ${indexName} exists was ${response.body}` });
    return response.body;
  }

  public async cloneIndex(sourceIndexName: string, targetIndexName: string): Promise<void> {
    try {
      await this.openSearchClient.indices.addBlock({
        index: sourceIndexName,
        block: 'write',
      });
      await this.openSearchClient.indices.clone({
        index: sourceIndexName,
        target: targetIndexName,
      });
      await this.openSearchClient.indices.putSettings({
        index: sourceIndexName,
        body: { index: { blocks: { write: false } } },
      });
    } catch (error) {
      this.logger.error({
        message: `Error cloning index ${sourceIndexName} as new index ${targetIndexName} - ${JSON.stringify(error)}`,
      });
      throw error;
    }
  }

  public async deleteIndex(indexName: string): Promise<void> {
    const response = await this.openSearchClient.indices.delete({
      index: indexName,
    });

    this.logger.info({ message: `Response from deleting index ${indexName} was ${response.statusCode}` });
  }
}
