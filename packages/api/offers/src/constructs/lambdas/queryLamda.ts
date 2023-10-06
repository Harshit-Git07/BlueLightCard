import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaAbstract } from './lambdaAbstract';
import { Stack } from 'aws-cdk-lib';
import { Tables } from '../tables';

export class QueryLambda extends LambdaAbstract {
  constructor(private stack: Stack, private tables: Tables) {
    super();
  }

  create(): NodejsFunction {
    const queryLambdaResolver = new NodejsFunction(this.stack, 'queryResolverLambda', {
      entry: './packages/api/offers/src/graphql/resolvers/queries/handlers/queryLambdaResolver.ts',
      handler: 'handler',
      environment: {
        OFFER_HOMEPAGE_TABLE: this.tables.offerHomepageTable.tableName
      },
    });

    this.grantPermissions(queryLambdaResolver);

    return queryLambdaResolver;
  }

  protected grantPermissions(lambdaFunction: NodejsFunction) {
    this.tables.offerHomepageTable.cdk.table.grantReadData(lambdaFunction);
  }
}
