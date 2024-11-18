import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Client } from '@opensearch-project/opensearch';
import { SearchResponse } from '@opensearch-project/opensearch/api/types';
import { isBefore, subWeeks } from 'date-fns';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { openSearchFieldMapping } from '@blc-mono/discovery/application/models/OpenSearchFieldMapping';
import { OpenSearchBulkCommand } from '@blc-mono/discovery/application/models/OpenSearchType';
import {
  InternalSearchResult,
  mapAllCompanies,
  mapInternalSearchResult,
  mapSearchResults,
  SearchResult,
} from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';
import { OpenSearchSearchRequests } from '@blc-mono/discovery/application/services/opensearch/OpenSearchSearchRequests';
import { isValidTrust } from '@blc-mono/discovery/application/utils/trustRules';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

export const draftIndexPrefix = 'draft-';

const logger = new LambdaLogger({ serviceName: 'openSearch' });

const service = getEnv(DiscoveryStackEnvironmentKeys.SERVICE);
const stage = getEnv(DiscoveryStackEnvironmentKeys.STAGE);
const indexType = 'offers';

type OpenSearchIndex = {
  indexName: string;
  creationDate: string;
};

export class OpenSearchService {
  private readonly openSearchClient: Client;
  private indicesList: OpenSearchIndex[] = [];

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
    const body = {
      settings: {
        index: {
          number_of_shards: 2,
          number_of_replicas: 0,
        },
      },
      mappings: {
        properties: openSearchFieldMapping,
      },
    };

    const response = await this.openSearchClient.indices.create({
      index: indexName,
      body,
    });

    logger.info({ message: `Response from creating index ${indexName} was ${response.statusCode}` });
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
      logger.error({
        message: `Error cloning index ${sourceIndexName} as new index ${targetIndexName} - ${JSON.stringify(error)}`,
      });
      throw error;
    }
  }

  public async addDocumentsToIndex(documents: OpenSearchBulkCommand[], indexName: string): Promise<void> {
    const response = await this.openSearchClient.bulk({ body: documents, index: indexName, refresh: true });
    logger.info({
      message: `Response from adding documents to index ${indexName} was ${response.statusCode} - ${JSON.stringify(response.body)}`,
    });
  }

  public async queryBySearchTerm(
    term: string,
    indexName: string,
    dob: string,
    organisation: string,
    offerType?: string,
  ): Promise<SearchResult[]> {
    const searchResults = new OpenSearchSearchRequests(indexName, dob)
      .buildSearchRequest(term, offerType)
      .map(async (search) => {
        return this.openSearchClient.search({
          index: indexName,
          body: search.body,
        });
      });

    let allSearchResults: InternalSearchResult[] = [];
    await Promise.all(searchResults).then((results) => {
      results.forEach((result) => {
        const mappedSearchResults = mapSearchResults(result.body as SearchResponse);
        logger.debug({
          message: `Received ${mappedSearchResults.length} search results - ${JSON.stringify(mappedSearchResults)}`,
        });
        allSearchResults = allSearchResults.concat(mappedSearchResults);
      });
    });

    return this.buildUniqueSearchResults(
      allSearchResults.filter((result) => isValidTrust(organisation, result.IncludedTrusts, result.ExcludedTrusts)),
    );
  }

  public async queryAllCompanies(indexName: string, dob: string): Promise<CompanySummary[]> {
    const allCompaniesRequest = new OpenSearchSearchRequests(indexName, dob).buildAllCompaniesRequest();

    const allCompaniesResults = await this.openSearchClient.search({
      index: indexName,
      body: allCompaniesRequest.body,
    });

    return mapAllCompanies(allCompaniesResults.body as SearchResponse);
  }

  public async queryByCategory(
    indexName: string,
    dob: string,
    organisation: string,
    categoryId: string,
  ): Promise<SearchResult[]> {
    const MAX_RESULTS_PER_CATEGORY = 1000;
    const searchRequest = new OpenSearchSearchRequests(indexName, dob).buildCategorySearch(categoryId);
    const searchResults = await this.openSearchClient.search({
      index: indexName,
      body: searchRequest.body,
    });

    const mappedSearchResults = mapSearchResults(searchResults.body as SearchResponse);

    return this.buildUniqueSearchResults(
      mappedSearchResults.filter((result) => isValidTrust(organisation, result.IncludedTrusts, result.ExcludedTrusts)),
      MAX_RESULTS_PER_CATEGORY,
    );
  }

  private buildUniqueSearchResults(allSearchResults: InternalSearchResult[], maxResults = 40): SearchResult[] {
    const uniqueSearchResults: SearchResult[] = [];

    allSearchResults.forEach((searchResult) => {
      if (!uniqueSearchResults.some(({ ID }) => ID === searchResult.ID)) {
        uniqueSearchResults.push(mapInternalSearchResult(searchResult));
      }
    });

    logger.info({
      message: `Found ${uniqueSearchResults.length} unique search results`,
    });

    const uniqueResultsSubset = uniqueSearchResults.slice(0, maxResults);
    logger.info({
      message: `Returning ${uniqueResultsSubset.length} unique search results`,
    });
    logger.debug({
      message: `Returning unique search results - ${JSON.stringify(uniqueResultsSubset)}`,
    });

    return uniqueResultsSubset;
  }

  public async deleteIndex(indexName: string): Promise<void> {
    const response = await this.openSearchClient.indices.delete({
      index: indexName,
    });

    logger.info({ message: `Response from deleting index ${indexName} was ${response.statusCode}` });
  }

  public async getPublishedIndicesForDeletion(): Promise<string[]> {
    await this.initializeIndicesList();
    const numberOfIndicesToRetain = 2;

    const orderedIndexNames = getOfferIndexNamesByLatest(this.indicesList);
    const indexNamesToRetain = orderedIndexNames.slice(0, numberOfIndicesToRetain);

    return orderedIndexNames.filter((indexName: string) => !indexNamesToRetain.includes(indexName));
  }

  public async getDraftIndicesForDeletion(): Promise<string[]> {
    await this.initializeIndicesList();

    return this.indicesList
      .filter(
        (index: OpenSearchIndex) =>
          index.indexName.startsWith(`${draftIndexPrefix}${service}-${stage}-${indexType}`) &&
          indexOlderThan7Days(index),
      )
      .map((index: OpenSearchIndex) => index.indexName);
  }

  public async getPrEnvironmentIndicesForDeletion(): Promise<string[]> {
    await this.initializeIndicesList();

    return this.indicesList
      .filter((index: OpenSearchIndex) => index.indexName.startsWith(`${service}-pr-`) && indexOlderThan7Days(index))
      .map((index: OpenSearchIndex) => index.indexName);
  }

  private async initializeIndicesList(): Promise<void> {
    if (this.indicesList.length === 0) {
      this.indicesList = await getIndicesList(this.openSearchClient);
    }
  }

  public async getLatestIndexName(): Promise<string> {
    const indices = await getIndicesList(this.openSearchClient);
    const orderedIndexNames = getOfferIndexNamesByLatest(indices);
    return orderedIndexNames[0];
  }

  public generateIndexName(): string {
    const timestamp = new Date().getTime();
    return `${service}-${stage}-${indexType}-${timestamp}`.toLowerCase();
  }
}

const getIndicesList = async (openSearchClient: Client): Promise<OpenSearchIndex[]> => {
  const response = await openSearchClient.cat.indices({ h: ['index', 'creation.date.string'], format: 'json' });
  return response.body.map((index: { index: string; 'creation.date.string': string }) => toIndex(index));
};

const toIndex = (index: { index: string; 'creation.date.string': string }): OpenSearchIndex => {
  return {
    indexName: index.index,
    creationDate: index['creation.date.string'],
  };
};

const getOfferIndexNamesByLatest = (indices: OpenSearchIndex[]): string[] => {
  return indices
    .map((index: OpenSearchIndex) => index.indexName)
    .filter((indexName: string) => indexName.startsWith(`${service}-${stage}-${indexType}`))
    .sort((a, b) => a.localeCompare(b))
    .reverse();
};

const indexOlderThan7Days = (index: OpenSearchIndex): boolean => {
  return isBefore(new Date(index.creationDate), subWeeks(new Date(), 1));
};
