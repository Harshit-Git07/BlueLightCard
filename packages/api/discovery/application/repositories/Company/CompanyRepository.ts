import { getEnv } from '@blc-mono/core/utils/getEnv';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { COMPANY_LOCATION_PREFIX } from '../constants/PrimaryKeyPrefixes';
import { CompanyLocationEntity, CompanyLocationKeyBuilders } from '../schemas/CompanyLocationEntity';

export class CompanyRepository {
  private readonly tableName: string;
  constructor() {
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME);
  }

  async insert(companyEntity: CompanyEntity | CompanyLocationEntity): Promise<void> {
    await DynamoDBService.put({
      Item: companyEntity,
      TableName: this.tableName,
    });
  }

  async delete(companyEntity: CompanyEntity | CompanyLocationEntity): Promise<void> {
    await DynamoDBService.delete({
      Key: {
        partitionKey: companyEntity.partitionKey,
        sortKey: companyEntity.sortKey,
      },
      TableName: this.tableName,
    });
  }

  async batchInsert(companyEntities: (CompanyEntity | CompanyLocationEntity)[]): Promise<void> {
    // @ts-expect-error Typescript doesn't like the nested geopoint object as its not a top level type on companyEntity
    await DynamoDBService.batchInsert(companyEntities, this.tableName);
  }

  async batchDelete(companyEntities: (CompanyEntity | CompanyLocationEntity)[]): Promise<void> {
    await DynamoDBService.batchDelete(
      companyEntities.map(({ partitionKey, sortKey }) => ({ partitionKey, sortKey })),
      this.tableName,
    );
  }

  async retrieveById(id: string): Promise<CompanyEntity | undefined> {
    return (await DynamoDBService.get({
      Key: {
        partitionKey: CompanyKeyBuilders.buildPartitionKey(id),
        sortKey: CompanyKeyBuilders.buildSortKey(id),
      },
      TableName: this.tableName,
    })) as CompanyEntity;
  }

  async retrieveLocationsByCompanyId(id: string): Promise<CompanyLocationEntity[] | undefined> {
    return (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key and begins_with(sortKey, :location_prefix)',
      ExpressionAttributeValues: {
        ':partition_key': CompanyLocationKeyBuilders.buildPartitionKey(id),
        ':location_prefix': COMPANY_LOCATION_PREFIX,
      },
      TableName: this.tableName,
    })) as CompanyLocationEntity[] | undefined;
  }

  async retrieveCompanyRecordsById(id: string): Promise<(CompanyEntity | CompanyLocationEntity)[] | undefined> {
    return (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key',
      ExpressionAttributeValues: {
        ':partition_key': CompanyKeyBuilders.buildPartitionKey(id),
      },
      TableName: this.tableName,
    })) as (CompanyEntity | CompanyLocationEntity)[] | undefined;
  }
}
