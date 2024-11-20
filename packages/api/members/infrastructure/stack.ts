import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, App, Stack, StackContext, use } from 'sst/constructs';
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
import { adminAllocationRoutes } from './routes/admin/AdminAllocationRoutes';
import { adminPaymentRoutes } from './routes/admin/AdminPaymentRoutes';
import { adminProfileRoutes } from './routes/admin/AdminProfileRoutes';
import { DocumentUpload } from './s3/DocumentUploadBucket';

const SERVICE_NAME = 'members';

async function MembersStack({ stack, app }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  // Profile table - profiles, cards, notes, applications, promo codes
  // Orgs tables - orgs, employers, ID requirements, trusted domains
  // Admin table - batches, allocations
  const profilesTable = createProfilesTable(stack);
  const organisationsTable = createOrganisationsTable(stack);
  const adminTable = createAdminTable(stack);

  const documentUpload = new DocumentUpload(stack, 'DocumentUpload', {
    profilesTable: profilesTable,
    organisationsTable: organisationsTable,
    stage: app.stage,
    appName: app.name,
  });

  return {
    profilesTable,
    organisationsTable,
    adminTable,
    documentUploadBucket: documentUpload.bucket,
  };
}

async function MembersApiStack({ stack, app }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  const { profilesTable, organisationsTable, documentUploadBucket } = use(MembersStack);

  const api = createRestApi(app, stack, 'members');
  const restApi = api.cdk.restApi;

  stack.addOutputs({
    MembersApiEndpoint: api.url,
    MembersApiCustomDomain: api.customDomainUrl,
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(restApi);
  api.addRoutes(
    stack,
    memberProfileRoutes(
      stack,
      restApi,
      apiGatewayModelGenerator,
      profilesTable,
      organisationsTable,
    ),
  );
  api.addRoutes(stack, memberMarketingRoutes(stack, restApi, apiGatewayModelGenerator));
  api.addRoutes(
    stack,
    memberApplicationRoutes(
      stack,
      restApi,
      apiGatewayModelGenerator,
      profilesTable,
      organisationsTable,
      documentUploadBucket,
    ),
  );
  api.addRoutes(
    stack,
    memberOrganisationsRoutes(stack, restApi, apiGatewayModelGenerator, organisationsTable),
  );
}

async function MembersAdminApiStack({ stack, app }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  const { profilesTable, organisationsTable, adminTable, documentUploadBucket } = use(MembersStack);

  const api = createRestApi(app, stack, 'members-admin');
  const restApi = api.cdk.restApi;

  stack.addOutputs({
    MembersAdminApiEndpoint: api.url,
    MembersAdminApiCustomDomain: api.customDomainUrl,
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(restApi);
  api.addRoutes(
    stack,
    adminProfileRoutes(stack, restApi, apiGatewayModelGenerator, profilesTable, organisationsTable),
  );
  api.addRoutes(stack, adminMarketingRoutes(stack, restApi, apiGatewayModelGenerator));
  api.addRoutes(
    stack,
    adminApplicationRoutes(
      stack,
      restApi,
      apiGatewayModelGenerator,
      profilesTable,
      organisationsTable,
      documentUploadBucket,
    ),
  );
  api.addRoutes(
    stack,
    adminOrganisationsRoutes(stack, restApi, apiGatewayModelGenerator, organisationsTable),
  );
  api.addRoutes(stack, adminCardRoutes(stack, restApi, apiGatewayModelGenerator, adminTable));
  api.addRoutes(stack, adminAllocationRoutes(stack, restApi, apiGatewayModelGenerator, adminTable));
  api.addRoutes(stack, adminPaymentRoutes(stack, restApi, apiGatewayModelGenerator, profilesTable));
}

function createRestApi(app: App, stack: Stack, name: string) {
  const { certificateArn } = use(Shared);
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

  const apikey = api.cdk.restApi.addApiKey('members-api-key');

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
  usagePlan.addApiKey(apikey);

  return api;
}

const getDomainName = (stage: string, region: string, name: string) => {
  return region === 'ap-southeast-2'
    ? getAustraliaDomainName(stage, name)
    : getUKDomainName(stage, name);
};

const getAustraliaDomainName = (stage: string, name: string) =>
  stage === 'production' ? `${name}-au.blcshine.io` : `${stage}-${name}-au.blcshine.io`;

const getUKDomainName = (stage: string, name: string) =>
  stage === 'production' ? `${name}.blcshine.io` : `${stage}-${name}.blcshine.io`;

export const Members =
  getEnvRaw(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK) === 'false'
    ? MembersStack
    : () => Promise.resolve();

export const MembersApi =
  getEnvRaw(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK) === 'false'
    ? MembersApiStack
    : () => Promise.resolve();

export const MembersAdminApi =
  getEnvRaw(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK) === 'false'
    ? MembersAdminApiStack
    : () => Promise.resolve();
