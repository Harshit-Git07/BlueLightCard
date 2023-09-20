import { DynamoDbDataSource, GraphqlApi, LambdaDataSource } from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Lambda } from '../constructs/lambda';
import { Tables } from '../constructs/tables';

/**
 * DataSources are the way AppSync connects to data sources.
 * They can be DynamoDB tables, Lambda functions, HTTP endpoints, etc.
 * @param offerApi - The GraphQL API
 * @param tables - The DynamoDB tables
 * @param lambdas - The Lambda functions
 */
export class DataSource {
  brandDS: DynamoDbDataSource;
  offerTypeDS: DynamoDbDataSource;
  companyDS: DynamoDbDataSource;
  offerDS: DynamoDbDataSource;
  typeLambdaDS: LambdaDataSource;
  queryLambdaDS: LambdaDataSource;
  bannersDS: LambdaDataSource;

  constructor(private api: GraphqlApi, private tables: Tables, private lambdas: Lambda) {

    //DynamoDB DataSources
    this.brandDS = this.createDynamoDbDataSource('brandDataSource', tables.brandTable.cdk.table);
    this.companyDS = this.createDynamoDbDataSource('companyDataSource', tables.companyTable.cdk.table);
    this.offerTypeDS = this.createDynamoDbDataSource('offerTypeDataSource', tables.offerTypeTable.cdk.table);
    this.offerDS = this.createDynamoDbDataSource('offerDataSource', tables.offerTable.cdk.table);
    this.bannersDS = this.createDynamoDbDataSource('bannersDataSource', tables.bannersTable.cdk.table);

    //Lambda DataSources
    this.typeLambdaDS = this.createLambdaDataSource('typeLambdaDataSource', lambdas.typeLambda);
    this.queryLambdaDS = this.createLambdaDataSource('queryLambdaDataSource', lambdas.queryLambda);
  }

  private createDynamoDbDataSource(dsId: string, table: ITable) {
    return this.api.addDynamoDbDataSource(dsId, table);
  }

  private createLambdaDataSource(dsId: string, lambda: IFunction) {
    return this.api.addLambdaDataSource(dsId, lambda);
  }
}
