import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { TypeLambda } from './lambdas/typeLambda';
import { Tables } from './tables';
import { Stack } from 'aws-cdk-lib';
import { Buckets } from './buckets';
import { QueryLambda } from './lambdas/queryLamda';

/**
 * This class centralises the creation of the lambdas.
 * @param stack - The stack to add the lambdas to
 * @param tables - The tables to use in the lambdas
 */
export class Lambda {
  typeLambda: NodejsFunction;
  queryLambda: NodejsFunction;

  constructor(private stack: Stack, private tables: Tables, private buckets: Buckets) {
    this.typeLambda = new TypeLambda(this.stack, this.tables).create();
    this.queryLambda = new QueryLambda(this.stack, this.buckets).create();
  }
}
