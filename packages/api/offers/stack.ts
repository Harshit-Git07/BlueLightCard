import { StackContext, use } from 'sst/constructs';
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
import { SecurityGroupManager } from './src/constructs/security-group-manager';
import { SecretManager } from './src/constructs/secret-manager';
import { EC2Manager } from './src/constructs/ec2-manager';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import { IDatabaseAdapter } from './src/constructs/database/IDatabaseAdapter';
import { DatabaseAdapter } from './src/constructs/database/adapter';

export async function Offers({ stack, app }: StackContext) {

  const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';
  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT === 'true' ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`] : undefined;

  stack.setDefaultFunctionProps({
    environment: {
      DD_VERSION: process.env.DD_VERSION || '',
      DD_ENV: process.env.SST_STAGE || 'undefined',
      DD_API_KEY: process.env.DD_API_KEY || '',
      DD_GIT_COMMIT_SHA: process.env.DD_GIT_COMMIT_SHA || '',
      DD_GIT_REPOSITORY_URL: process.env.DD_GIT_REPOSITORY_URL || '',
      USE_DATADOG_AGENT,
      DD_SERVICE: 'offers',
    },
    layers,
  });

  new Tags(stack);
  const { authorizer, cognito, newCognito } = use(Identity);
  const { vpc, certificateArn } = use(Shared);
  const secretsManger: SecretManager = new SecretManager(stack);
  const securityGroupManager: SecurityGroupManager = new SecurityGroupManager(stack, vpc);
  const queues = new Queues(stack);
  const tables = new Tables(stack);
  const buckets = new Buckets(stack, stack.stage, queues);
  const ec2Manager: EC2Manager = new EC2Manager(stack, vpc, securityGroupManager);
  let dbAdapter: IDatabaseAdapter | undefined;
  if (!isProduction(stack.stage)) {
    dbAdapter = await new DatabaseAdapter(stack, app, vpc, secretsManger, securityGroupManager, ec2Manager).init();
  }
  const offersApiGateway: OffersApiGateway = new OffersApiGateway(stack, authorizer, tables, dbAdapter, certificateArn);

  //Need to be removed once the ApiGateway is ready to support the Offers API functionality
  const offersApi: OffersApi = new OffersApi(
    stack,
    cognito,
    newCognito,
    secretsManger,
    './packages/api/offers/schema.graphql',
  );

  // Need to be removed once the Appsync API is removed
  new AppsyncCache(stack, stack.stage, offersApi.api);

  const lambdas = new Lambda(stack, tables, buckets, queues, stack.stage);
  const dataSources = new DataSource(offersApi.api, tables, lambdas);
  const resolvers = new Resolver(dataSources);
  resolvers.initialise();
  new EventBridge(stack, tables, queues);

  stack.addOutputs({
    'OffersApiEndpoint': offersApi.api.graphqlUrl,
    'OffersApiGatewayEndpoint': offersApiGateway.restApi.url,
  });

  return {
    offersApi,
    offersApiGateway,
  };
}
