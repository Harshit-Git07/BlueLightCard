import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaAbstract } from './lambdaAbstract';
import { Stack } from 'aws-cdk-lib';
import { Tables } from '../tables';
import { COMPANY_FOLLOWS_SECRET, ENDPOINTS } from '../../utils/global-constants';

type environmentConfig = {
  OFFER_HOMEPAGE_TABLE: string;
  COMPANY_FOLLOWS_ENDPOINT: string;
  USER_PROFILE_ENDPOINT: string;
  COMPANY_FOLLOWS_SECRET: string;
};

export class QueryLambda extends LambdaAbstract {
  constructor(private stack: Stack, private tables: Tables, private stage: string) {
    super();
  }

  create(): NodejsFunction {
    const queryLambdaResolver = new NodejsFunction(this.stack, 'queryResolverLambda', {
      entry: './packages/api/offers/src/graphql/resolvers/queries/handlers/queryLambdaResolver.ts',
      handler: 'handler',
      environment: this.getEnvironmentConfig(this.tables.offerHomepageTable.tableName, this.stage),
    });

    this.grantPermissions(queryLambdaResolver);

    return queryLambdaResolver;
  }

  protected grantPermissions(lambdaFunction: NodejsFunction) {
    this.tables.offerHomepageTable.cdk.table.grantReadData(lambdaFunction);
  }

  private getEnvironmentConfig(tableName: string, stageName: string): environmentConfig {
    return {
      OFFER_HOMEPAGE_TABLE: tableName,
      COMPANY_FOLLOWS_ENDPOINT:
        stageName == 'production' ? ENDPOINTS.PRODUCTION_COMPANY_FOLLOWS : ENDPOINTS.DEVELOP_COMPANY_FOLLOWS,
      COMPANY_FOLLOWS_SECRET: COMPANY_FOLLOWS_SECRET,
      USER_PROFILE_ENDPOINT:
        stageName == 'production' ? ENDPOINTS.PRODUCTION_USER_PROFILE : ENDPOINTS.DEVELOP_USER_PROFILE,
    };
  }
}
