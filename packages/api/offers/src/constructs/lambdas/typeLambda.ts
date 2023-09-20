import { Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Tables } from '../tables';
import { LambdaAbstract } from './lambdaAbstract';

/**
 * This class is creating Lambda for type resolver
 * @param stack - The stack to add the lambda to
 * @param tables - The tables to use in the lambda
 */
export class TypeLambda extends LambdaAbstract {
  constructor(private stack: Stack, private tables: Tables) {
    super();
  }

  // This method is implementing the abstract method from LambdaAbstract to create the lambda
  create(): NodejsFunction {
    const typeLambdaResolver = new NodejsFunction(this.stack, 'typeResolverLambda', {
      entry: './packages/api/offers/src/graphql/resolvers/types/handlers/typeLambdaResolver.ts',
      handler: 'handler',
      environment: {
        BRAND_TABLE: this.tables.brandTable.tableName,
        OFFER_TABLE: this.tables.offerTable.tableName,
        OFFER_CATEGORIES_TABLE: this.tables.offerCategoryConnectionTable.tableName,
        CATEGORY_TABLE: this.tables.categoryTable.tableName,
        OFFER_BRAND_TABLE: this.tables.offerBrandConnectionTable.tableName,
      },
    });

    this.grantPermissions(typeLambdaResolver);

    return typeLambdaResolver;
  }

  // This method is implementing the abstract method from LambdaAbstract to grant permissions to the lambda
  protected grantPermissions(lambdaFunction: NodejsFunction): void {
    this.tables.offerTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.offerCategoryConnectionTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.offerBrandConnectionTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.brandTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.categoryTable.cdk.table.grantReadWriteData(lambdaFunction);
  }
}
