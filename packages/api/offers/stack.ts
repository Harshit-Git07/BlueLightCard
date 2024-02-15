import { App, Cognito, Stack, StackContext, use } from 'sst/constructs';
import { Identity } from '@blc-mono/identity/stack';
import { Tables } from './src/constructs/tables';
import { OffersApi } from './src/constructs/offersApi';
import { Lambda } from './src/constructs/lambda';
import { DataSource } from './src/graphql/dataSources';
import { Resolver } from './src/graphql/resolvers/resolver';
import { Buckets } from './src/constructs/buckets';
import { EventBridge } from './src/constructs/eventBridge';
import { Queues } from './src/constructs/queues';
import { Tags } from './src/constructs/tags';
import { AppsyncCache } from './src/constructs/appsyncCache';
import { Shared } from '../../../stacks/stack';
import { OffersApiGateway } from './src/constructs/offersApiGateway';
import { Database } from './src/constructs/database';
import { SecurityGroupManager } from './src/constructs/security-group-manager';
import { SecretManager } from './src/constructs/secret-manager';
import { EC2Manager } from './src/constructs/ec2-manager';

export function Offers({ stack, app }: StackContext) {
  new Tags(stack);
  const { cognito } = use(Identity);
  const { vpc } = use(Shared);
  const secretsManger: SecretManager = new SecretManager(stack);
  const securityGroupManager: SecurityGroupManager = new SecurityGroupManager(stack, vpc);
  const ec2Manager: EC2Manager = new EC2Manager(stack, vpc, securityGroupManager);
  const offersApiGateway: OffersApiGateway = new OffersApiGateway(stack, cognito.userPoolId);
  // const database: Database = new Database(stack, vpc, secretsManger, securityGroupManager, ec2Manager);
  const offersApi: OffersApi = new OffersApi(
    stack,
    cognito.cdk.userPool,
    secretsManger,
    './packages/api/offers/schema.graphql',
  );
  new AppsyncCache(stack, stack.stage, offersApi.api);
  const queues = new Queues(stack);
  const tables = new Tables(stack);
  const buckets = new Buckets(stack, stack.stage, queues);
  const lambdas = new Lambda(stack, tables, buckets, queues, stack.stage);
  const dataSources = new DataSource(offersApi.api, tables, lambdas);
  const resolvers = new Resolver(dataSources);
  resolvers.initialise();
  new EventBridge(stack, stack.stage, tables, queues);

  stack.addOutputs({
    OffersApiEndpoint: offersApi.api.graphqlUrl,
    OffersApiGatewayEndpoint: offersApiGateway.restApi.url,
  });

  return {
    offersApi,
    offersApiGateway,
  };
}
