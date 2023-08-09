import { StackContext, use } from 'sst/constructs';
import { Identity } from '@blc-mono/identity/stack';
import { Tables } from './src/constructs/tables';
import { OffersApi } from './src/constructs/offersApi';
import { Lambda } from './src/constructs/lambda';
import { DataSource } from './src/graphql/dataSources';
import { Resolver } from './src/graphql/resolvers/resolver';

export function Offers({ stack }: StackContext) {
  const { cognito } = use(Identity);
  const offersApi = OffersApi.create(stack, stack.stage, cognito.cdk.userPool, './packages/api/offers/schema.graphql');

  const tables = new Tables(stack);
  const lambdas = new Lambda(stack, tables);
  const dataSources = new DataSource(offersApi, tables, lambdas);
  const resolvers = new Resolver(dataSources);
  resolvers.initialise();

  stack.addOutputs({
    OffersApiEndpoint: offersApi.graphqlUrl,
  });
  
  return {
    offersApi,
  };
}
