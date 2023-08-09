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
  private stack: Stack;
  private tables: Tables;

  constructor(stack: Stack, tables: Tables) {
    super();
    this.stack = stack;
    this.tables = tables;
  }

  // This method is implementing the abstract method from LambdaAbstract to create the lambda
  create(): NodejsFunction {
    const typeLambdaResolver = new NodejsFunction(this.stack, 'typeResolverLambda', {
      entry: './packages/api/offers/src/graphql/resolvers/types/handlers/typeLambdaResolver.ts',
      handler: 'handler',
      environment: {
        BRAND_TABLE: this.tables.brandTable.tableName,
        HOMEPAGE_TABLE: this.tables.homePageTable.tableName,
        OFFERS_CONTAINER_TABLE: this.tables.offersContainerTable.tableName,
        OFFERS_CONTAINER_OFFER_TABLE: this.tables.offersContainer_offerTable.tableName,
        OFFER_TABLE: this.tables.offerTable.tableName,
        OFFER_CATEGORIES_TABLE: this.tables.offers_categoryTable.tableName,
        CATEGORY_TABLE: this.tables.categoryTable.tableName,
        OFFER_BRAND_TABLE: this.tables.offers_brandTable.tableName,
      },
    });

    this.grantPermissions(typeLambdaResolver);

    return typeLambdaResolver;
  }

  // This method is implementing the abstract method from LambdaAbstract to grant permissions to the lambda
  protected grantPermissions(lambdaFunction: NodejsFunction): void {
    this.tables.offersContainer_offerTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.offerTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.offers_categoryTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.offers_brandTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.brandTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.tables.categoryTable.cdk.table.grantReadWriteData(lambdaFunction);
  }
}
