import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  ApiGatewayV1Api,
  ApiGatewayV1ApiFunctionRouteProps,
  App,
  Bucket,
  dependsOn,
  Queue,
  Stack,
  StackContext,
  use,
} from 'sst/constructs';
import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { Shared } from '../../../../stacks/stack';
import {
  MemberStackConfigResolver,
  MemberStackRegion,
} from '@blc-mono/members/infrastructure/config/config';
import { createAdminTable } from '@blc-mono/members/infrastructure/dynamodb/createAdminTable';
import { createOrganisationsTable } from '@blc-mono/members/infrastructure/dynamodb/createOrganisationsTable';
import { createProfilesTable } from '@blc-mono/members/infrastructure/dynamodb/createProfilesTable';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { getEnvOrDefault, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { memberProfileRoutes } from '@blc-mono/members/infrastructure/routes/member/MemberProfileRoutes';
import { memberApplicationRoutes } from '@blc-mono/members/infrastructure/routes/member/MemberApplicationRoutes';
import { memberOrganisationsRoutes } from '@blc-mono/members/infrastructure/routes/member/MemberOrganisationsRoutes';
import { memberMarketingRoutes } from './routes/member/MemberMarketingRoutes';
import { adminMarketingRoutes } from './routes/admin/AdminMarketingRoutes';
import { adminApplicationRoutes } from './routes/admin/AdminApplicationRoutes';
import { adminOrganisationsRoutes } from './routes/admin/AdminOrganisationsRoutes';
import { adminCardRoutes } from './routes/admin/AdminCardRoutes';
import { adminPaymentRoutes } from './routes/admin/AdminPaymentRoutes';
import { adminProfileRoutes } from './routes/admin/AdminProfileRoutes';
import { DocumentUpload } from './s3/DocumentUploadBucket';
import { ResponseType } from 'aws-cdk-lib/aws-apigateway';
import { DefaultRouteProps } from './routes/route';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { RemovalPolicy } from 'aws-cdk-lib';
import { createOutboundBatchFileCron } from '@blc-mono/members/infrastructure/crons/createOutboundBatchFileCron';
import { processInboundBatchFileCron } from '@blc-mono/members/infrastructure/crons/processInboundBatchFileCron';
import { createMemberProfilesPipe } from '@blc-mono/members/infrastructure/eventbridge/MemberProfilesPipe';
import { createMemberProfileIndexer } from '@blc-mono/members/infrastructure/lambdas/createMemberProfileIndexer';

const SERVICE_NAME = 'members';

export async function MembersStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);
  const { vpc } = use(Shared);

  // Profile table - profiles, cards, notes, applications, promo codes
  // Orgs tables - orgs, employers, ID requirements, trusted domains
  // Admin table - batches, allocations
  const profilesTable = createProfilesTable(stack);
  const organisationsTable = createOrganisationsTable(stack);
  const adminTable = createAdminTable(stack);

  const documentUpload = new DocumentUpload(stack, 'DocumentUpload', {
    profilesTable: profilesTable,
    organisationsTable: organisationsTable,
  });

  const batchFilesBucket = new Bucket(stack, 'batchFilesBucket', {
    cdk: {
      bucket: {
        removalPolicy: RemovalPolicy.RETAIN,
        autoDeleteObjects: false,
      },
    },
  });

  createOutboundBatchFileCron(stack, adminTable);
  processInboundBatchFileCron(stack, adminTable);

  const memberProfilesTableEventQueue: Queue = new Queue(stack, 'MemberProfilesTableEventQueue', {
    cdk: {
      queue: {
        deadLetterQueue: {
          queue: new Queue(stack, 'MemberProfilesTableEventQueueDeadLetterQueue').cdk.queue,
          maxReceiveCount: 3,
        },
      },
    },
  });

  createMemberProfilesPipe(stack, profilesTable, memberProfilesTableEventQueue);
  createMemberProfileIndexer(stack, vpc, memberProfilesTableEventQueue, SERVICE_NAME);

  return {
    profilesTable,
    organisationsTable,
    adminTable,
    documentUploadBucket: documentUpload.bucket,
    batchFilesBucket: batchFilesBucket,
  };
}

export async function MembersApiStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  const { profilesTable, organisationsTable, documentUploadBucket } = use(MembersStack);
  const { certificateArn } = use(Shared);

  const { api, requestValidator, config } = createRestApi(
    app,
    stack,
    'members-api',
    certificateArn,
  );
  const restApi = api.cdk.restApi;

  stack.addOutputs({
    MembersApiEndpoint: api.url,
    MembersApiCustomDomain: api.customDomainUrl,
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(restApi);
  const defaultRouteProps: DefaultRouteProps = {
    stack,
    requestValidator,
    apiGatewayModelGenerator,
    defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
  };
  const routes: Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> = {
    ...memberProfileRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable],
    }),
    ...memberApplicationRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable, documentUploadBucket],
    }),
    ...memberOrganisationsRoutes({
      ...defaultRouteProps,
      bind: [organisationsTable],
    }),
    ...memberMarketingRoutes(defaultRouteProps),
  };

  api.addRoutes(stack, routes);
}

export async function MembersAdminApiStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  dependsOn(MembersApiStack);

  const { profilesTable, organisationsTable, adminTable, documentUploadBucket } = use(MembersStack);
  const { certificateArn } = use(Shared);

  const { api, requestValidator, config } = createRestApi(
    app,
    stack,
    'members-admin-api',
    certificateArn,
  );
  const restApi = api.cdk.restApi;

  stack.addOutputs({
    MembersAdminApiEndpoint: api.url,
    MembersAdminApiCustomDomain: api.customDomainUrl,
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(restApi);
  const defaultRouteProps: DefaultRouteProps = {
    stack,
    requestValidator,
    apiGatewayModelGenerator,
    defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
  };
  const routes: Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> = {
    ...adminProfileRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable],
    }),
    ...adminMarketingRoutes(defaultRouteProps),
    ...adminApplicationRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable, documentUploadBucket],
    }),
    ...adminOrganisationsRoutes({
      ...defaultRouteProps,
      bind: [organisationsTable],
    }),
    ...adminCardRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, adminTable],
    }),
    ...adminPaymentRoutes({
      ...defaultRouteProps,
      bind: [adminTable],
    }),
  };

  api.addRoutes(stack, routes);
}

function createRestApi(app: App, stack: Stack, name: string, certificateArn?: string) {
  const config = MemberStackConfigResolver.for(stack, app.region as MemberStackRegion);
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region
      ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:65`]
      : undefined;

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      service: SERVICE_NAME,
      USE_DATADOG_AGENT: getEnvOrDefault(MemberStackEnvironmentKeys.USE_DATADOG_AGENT, 'false'),
      DD_API_KEY: getEnvOrDefault(MemberStackEnvironmentKeys.DD_API_KEY, ''),
      DD_ENV: process.env?.SST_STAGE || 'undefined',
      DD_GIT_COMMIT_SHA: getEnvOrDefault(MemberStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(MemberStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
      DD_VERSION: getEnvOrDefault(MemberStackEnvironmentKeys.DD_VERSION, ''),
      SERVICE_LAYER_AUTH0_DOMAIN: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_DOMAIN,
        '',
      ),
      SERVICE_LAYER_AUTH0_API_CLIENT_ID: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_ID,
        '',
      ),
      SERVICE_LAYER_AUTH0_API_CLIENT_SECRET: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_SECRET,
        '',
      ),
      SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID,
        '',
      ),
      SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET,
        '',
      ),
    },
    layers,
  });

  const api = new ApiGatewayV1Api(stack, name, {
    authorizers: {
      // memberAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      // authorizer: 'memberAuthorizer',
      authorizer: 'none',
    },
    cdk: {
      restApi: {
        ...(['production', 'staging'].includes(stack.stage) &&
          certificateArn && {
            domainName: {
              domainName: getDomainName(stack.stage, app.region, name),
              certificate: Certificate.fromCertificateArn(
                stack,
                'DomainCertificate',
                certificateArn,
              ),
            },
          }),
        deployOptions: {
          stageName: 'v1',
        },
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        defaultCorsPreflightOptions: {
          allowOrigins: config.apiDefaultAllowedOrigins,
          allowHeaders: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowCredentials: true,
        },
      },
    },
  });

  const requestValidator = api.cdk.restApi.addRequestValidator('RequestValidator', {
    validateRequestBody: true,
    validateRequestParameters: true,
  });

  api.cdk.restApi.addGatewayResponse('BadRequestParametersResponse', {
    type: ResponseType.BAD_REQUEST_PARAMETERS,
    statusCode: '400',
    templates: {
      'application/json': JSON.stringify({
        error: '$context.error.validationErrorString',
      }),
    },
  });

  api.cdk.restApi.addGatewayResponse('BadRequestBodyResponse', {
    type: ResponseType.BAD_REQUEST_BODY,
    statusCode: '400',
    templates: {
      'application/json': JSON.stringify({
        error: '$context.error.validationErrorString',
      }),
    },
  });

  const apiKey = api.cdk.restApi.addApiKey('members-api-key');

  const usagePlan = api.cdk.restApi.addUsagePlan('members-api-usage-plan', {
    throttle: {
      rateLimit: 1,
      burstLimit: 2,
    },
    apiStages: [
      {
        api: api.cdk.restApi,
        stage: api.cdk.restApi.deploymentStage,
      },
    ],
  });
  usagePlan.addApiKey(apiKey);

  return {
    api,
    requestValidator,
    config,
  };
}

const getDomainName = (stage: string, region: string, name: string) => {
  return region === 'ap-southeast-2'
    ? getAustraliaDomainName(stage, name)
    : getUKDomainName(stage, name);
};

const getAustraliaDomainName = (stage: string, name: string) =>
  isProduction(stage) ? `${name}-au.blcshine.io` : `${stage}-${name}-au.blcshine.io`;

const getUKDomainName = (stage: string, name: string) => {
  if (isProduction(stage)) {
    return isDdsUkBrand() ? `${name}-dds-uk.blcshine.io` : `${name}.blcshine.io`;
  } else {
    return isDdsUkBrand() ? `${stage}-${name}-dds-uk.blcshine.io` : `${stage}-${name}.blcshine.io`;
  }
};

export const Members =
  getEnvOrDefault(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK, 'false') === 'false'
    ? MembersStack
    : () => Promise.resolve();

export const MembersApi =
  getEnvOrDefault(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK, 'false') === 'false'
    ? MembersApiStack
    : () => Promise.resolve();

export const MembersAdminApi =
  getEnvOrDefault(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK, 'false') === 'false'
    ? MembersAdminApiStack
    : () => Promise.resolve();
