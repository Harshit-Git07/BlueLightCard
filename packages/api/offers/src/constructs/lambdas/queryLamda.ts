import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaAbstract } from './lambdaAbstract';
import { Stack } from 'aws-cdk-lib';
import { Buckets } from '../buckets';

export class QueryLambda extends LambdaAbstract {
  constructor(private stack: Stack, private buckets: Buckets) {
    super();
  }

  create(): NodejsFunction {
    const queryLambdaResolver = new NodejsFunction(this.stack, 'queryResolverLambda', {
      entry: './packages/api/offers/src/graphql/resolvers/queries/handlers/queryLambdaResolver.ts',
      handler: 'handler',
      environment: {
        BUCKET_BLC_UK: this.buckets.blcUKBucket.bucketName,
        BUCKET_BLC_AUS: this.buckets.blcAUSBucket.bucketName,
        BUCKET_DDS_UK: this.buckets.ddsUKBucket.bucketName,
      },
    });

    this.grantPermissions(queryLambdaResolver);

    return queryLambdaResolver;
  }

  protected grantPermissions(lambdaFunction: NodejsFunction) {
    this.buckets.blcUKBucket.cdk.bucket.grantRead(lambdaFunction);
    this.buckets.blcAUSBucket.cdk.bucket.grantRead(lambdaFunction);
    this.buckets.ddsUKBucket.cdk.bucket.grantRead(lambdaFunction);
  }
}
