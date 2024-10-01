import { Client } from '@opensearch-project/opensearch';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SearchResponse } from '@opensearch-project/opensearch/api/types';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { OpenSearchBulkCommand } from '@blc-mono/discovery/application/models/OpenSearchType';
import {
  mapSearchResults,
  SearchResult,
} from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';
import { OpenSearchSearchRequests } from '@blc-mono/discovery/application/services/opensearch/OpenSearchSearchRequests';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

const logger = new LambdaLogger({ serviceName: 'openSearch' });

const service = getEnv(DiscoveryStackEnvironmentKeys.SERVICE);
const stage = getEnv(DiscoveryStackEnvironmentKeys.STAGE);
const indexType = 'offers';

export class OpenSearchService {
  private readonly openSearchClient: Client;

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

  public async addDocumentsToIndex(documents: OpenSearchBulkCommand[], indexName: string): Promise<void> {
    const response = await this.openSearchClient.bulk({ body: documents, index: indexName, refresh: true });
    logger.info({
      message: `Response from adding documents to index ${indexName} was ${response.statusCode} - ${JSON.stringify(response.body)}`,
    });
  }

  public async queryIndex(term: string, indexName: string, dob: string, offerType?: string): Promise<SearchResult[]> {
    const searchResults = new OpenSearchSearchRequests(indexName, dob, term, offerType).build().map(async (search) => {
      return this.openSearchClient.search({
        index: indexName,
        body: search.body,
      });
    });

    let allSearchResults: SearchResult[] = [];
    await Promise.all(searchResults).then((results) => {
      results.forEach((result) => {
        const mappedSearchResults = mapSearchResults(result.body as SearchResponse);
        logger.debug({
          message: `Received ${mappedSearchResults.length} search results - ${JSON.stringify(mappedSearchResults)}`,
        });
        allSearchResults = allSearchResults.concat(mappedSearchResults);
      });
    });

    return this.buildUniqueSearchResults(allSearchResults);
  }

  private buildUniqueSearchResults(allSearchResults: SearchResult[]): SearchResult[] {
    const MAX_RESULTS = 40;

    const uniqueSearchResults = [...new Set(allSearchResults)];
    logger.info({
      message: `Found ${uniqueSearchResults.length} unique search results`,
    });
    logger.debug({
      message: `Found unique search results - ${JSON.stringify(uniqueSearchResults)}`,
    });

    const uniqueResultsSubset = uniqueSearchResults.slice(0, MAX_RESULTS);
    logger.info({
      message: `Returning ${uniqueResultsSubset.length} unique search results`,
    });
    logger.debug({
      message: `Returning unique search results - ${JSON.stringify(uniqueResultsSubset)}`,
    });

    return uniqueSearchResults;
  }

  public async deleteIndex(indexName: string): Promise<void> {
    const response = await this.openSearchClient.indices.delete({
      index: indexName,
    });

    logger.info({ message: `Response from deleting index ${indexName} was ${response.statusCode}` });
  }

  public async getLatestIndexName(): Promise<string> {
    const response = await this.openSearchClient.cat.indices({ format: 'json' });
    const indexNames = response.body.map((index: { index: string }) => index.index);
    const latestIndex = indexNames
      .filter((indexName: string) => indexName.startsWith(`${service}-${stage}-${indexType}`))
      .sort()
      .reverse()[0];

    return latestIndex;
  }

  public generateIndexName(): string {
    const timestamp = new Date().getTime();
    return `${service}-${stage}-${indexType}-${timestamp}`.toLowerCase();
  }
}
