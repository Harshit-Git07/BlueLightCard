import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaAbstract } from './lambdaAbstract';
import { Duration, Stack } from 'aws-cdk-lib';
import { Tables } from '../tables';
import { isDev } from '../../../../core/src/utils/checkEnvironment';
import { Tracing } from 'aws-cdk-lib/aws-lambda';

type environmentConfig = {
  STAGE: string;
  BANNER_TABLE: string;
  OFFER_HOMEPAGE_TABLE: string;
  COMPANY_TABLE: string;
  COMPANY_BRAND_CONNECTION_TABLE: string;
};

export class QueryLambda extends LambdaAbstract {
  constructor(private stack: Stack, private tables: Tables, private stage: string) {
    super();
  }

  create(): NodejsFunction {
    let nodeJsFunctionProps = {
      entry: './packages/api/offers/src/graphql/resolvers/queries/handlers/queryLambdaResolver.ts',
      handler: 'handler',
      environment: this.getEnvironmentConfig(),
      memorySize: 1024,
      timeout: Duration.seconds(5),
      tracing: Tracing.ACTIVE,
    };

    if (!isDev(this.stage)) {
      nodeJsFunctionProps = { ...nodeJsFunctionProps };
    }

    const queryLambdaResolver = new NodejsFunction(this.stack, 'queryResolverLambda', nodeJsFunctionProps);

    this.grantPermissions(queryLambdaResolver);

    return queryLambdaResolver;
  }

  protected grantPermissions(lambdaFunction: NodejsFunction) {
    this.tables.offerHomepageTable.cdk.table.grantReadData(lambdaFunction);
    this.tables.bannersTable.cdk.table.grantReadData(lambdaFunction);
    this.tables.companyTable.cdk.table.grantReadData(lambdaFunction);
    this.tables.companyBrandConnectionTable.cdk.table.grantReadData(lambdaFunction);
  }

  private getEnvironmentConfig(): environmentConfig {
    return {
      STAGE: this.stage,
      BANNER_TABLE: this.tables.bannersTable.tableName,
      OFFER_HOMEPAGE_TABLE: this.tables.offerHomepageTable.tableName,
      COMPANY_TABLE: this.tables.companyTable.tableName,
      COMPANY_BRAND_CONNECTION_TABLE: this.tables.companyBrandConnectionTable.tableName,
    };
  }
}
