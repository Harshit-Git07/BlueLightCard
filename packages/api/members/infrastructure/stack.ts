import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  ApiGatewayV1Api,
  ApiGatewayV1ApiFunctionRouteProps,
  App,
  Bucket,
  Config,
  dependsOn,
  Queue,
  Stack,
  StackContext,
  use,
} from 'sst/constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
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
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { memberProfileRoutes } from '@blc-mono/members/infrastructure/routes/member/MemberProfileRoutes';
import { memberApplicationRoutes } from '@blc-mono/members/infrastructure/routes/member/MemberApplicationRoutes';
import { memberOrganisationsRoutes } from '@blc-mono/members/infrastructure/routes/member/MemberOrganisationsRoutes';
import { memberMarketingRoutes } from './routes/member/MemberMarketingRoutes';
import { adminMarketingRoutes } from './routes/admin/AdminMarketingRoutes';
import { adminBatchRoutes } from './routes/admin/AdminBatchRoutes';
import { adminApplicationRoutes } from './routes/admin/AdminApplicationRoutes';
import { adminOrganisationsRoutes } from './routes/admin/AdminOrganisationsRoutes';
import { adminCardRoutes } from './routes/admin/AdminCardRoutes';
import { adminPaymentRoutes } from './routes/admin/AdminPaymentRoutes';
import { adminProfileRoutes } from './routes/admin/AdminProfileRoutes';
import { adminEmailRoutes } from './routes/admin/AdminEmailRoutes';
import { DocumentUpload } from './s3/DocumentUploadBucket';
import { ResponseType } from 'aws-cdk-lib/aws-apigateway';
import { DefaultRouteProps } from './routes/route';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getBrandFromEnv, isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { RemovalPolicy } from 'aws-cdk-lib';
import { createOutboundBatchFileCron } from '@blc-mono/members/infrastructure/crons/createOutboundBatchFileCron';
import { retrieveInboundBatchFilesCron } from '@blc-mono/members/infrastructure/crons/retrieveInboundBatchFilesCron';
import { createMemberProfileChangeEventPipes } from '@blc-mono/members/infrastructure/eventbridge/MemberProfileChangeEventPipes';
import { createMemberProfileIndexer } from '@blc-mono/members/infrastructure/lambdas/createMemberProfileIndexer';
import { memberEventRules } from '@blc-mono/members/infrastructure/eventbus/memberEventRules';
import { adminSearchRoutes } from '@blc-mono/members/infrastructure/routes/admin/AdminSearchRoutes';
import { createSeedOrganisations } from '@blc-mono/members/infrastructure/lambdas/createSeedOrganisations';
import { createUploadBatchFileFunction } from '@blc-mono/members/infrastructure/lambdas/createUploadBatchFileFunction';
import { createProcessInboundBatchFileFunction } from '@blc-mono/members/infrastructure/lambdas/createProcessInboundBatchFileFunction';
import { MembersOpenSearchDomain } from './opensearch/MembersOpenSearchDomain';
import { createProfilesSeedSearchIndexPipeline } from '@blc-mono/members/infrastructure/lambdas/createProfilesSeedSearchIndexPipeline';
import { createProfilesSeedSearchIndexTable } from '@blc-mono/members/infrastructure/dynamodb/createProfilesSeedSearchIndexTable';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '@blc-mono/core/identity/authorizer';
import { Identity } from '@blc-mono/identity/stack';

const SERVICE_NAME = 'members';

export async function MembersStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);
  stack.setDefaultFunctionProps(getDefaultFunctionProps(stack.region));

  const { vpc } = use(Shared);

  // Profile table - profiles, cards, notes, applications, promo codes
  // Orgs tables - orgs, employers, ID requirements, trusted domains
  // Admin table - batches, allocations
  const profilesTable = createProfilesTable(stack);
  const profilesSeedSearchIndexTable = createProfilesSeedSearchIndexTable(stack);
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

  //email templates stuff
  const whatDeployment = isDdsUkBrand()
    ? 'dds'
    : app.region === 'ap-south-east-2'
      ? 'blcau'
      : 'blcuk';
  const emailTemplatesBucket = new s3.Bucket(stack, `${whatDeployment}-emailTemplatesBucket`, {
    removalPolicy: RemovalPolicy.RETAIN,
    autoDeleteObjects: false,
  });

  new s3deploy.BucketDeployment(stack, 'DeployFiles', {
    sources: [
      s3deploy.Source.asset(
        `./packages/api/members/libs/emailTemplates/${whatDeployment}/service/`,
      ),
    ],
    destinationBucket: emailTemplatesBucket,
  });
  const bucketName = new Config.Parameter(stack, 'email-templates-bucket', {
    value: emailTemplatesBucket.bucketName,
  });

  const enableAutomaticCardBatching = getEnvOrDefault(
    MemberStackEnvironmentKeys.ENABLE_AUTOMATIC_EXTERNAL_CARD_BATCHING,
    'false',
  );
  if (enableAutomaticCardBatching !== 'false' && !isDdsUkBrand()) {
    createOutboundBatchFileCron(
      stack,
      adminTable,
      profilesTable,
      organisationsTable,
      documentUpload.bucket,
      batchFilesBucket,
    );
    retrieveInboundBatchFilesCron(stack, adminTable);
    createProcessInboundBatchFileFunction(
      stack,
      adminTable,
      profilesTable,
      organisationsTable,
      documentUpload.bucket,
      batchFilesBucket,
    );
    createUploadBatchFileFunction(
      stack,
      adminTable,
      profilesTable,
      organisationsTable,
      documentUpload.bucket,
      batchFilesBucket,
    );
  }

  const memberProfilesChangeEventQueue: Queue = new Queue(stack, 'MemberProfilesTableEventQueue', {
    cdk: {
      queue: {
        deadLetterQueue: {
          queue: new Queue(stack, 'MemberProfilesTableEventQueueDeadLetterQueue').cdk.queue,
          maxReceiveCount: 3,
        },
      },
    },
  });

  const openSearchDomain = await new MembersOpenSearchDomain(stack, vpc).setup();
  createMemberProfileChangeEventPipes(
    stack,
    profilesTable,
    profilesSeedSearchIndexTable,
    memberProfilesChangeEventQueue,
  );
  createMemberProfileIndexer(
    stack,
    vpc,
    memberProfilesChangeEventQueue,
    openSearchDomain,
    organisationsTable,
    SERVICE_NAME,
  );
  createSeedOrganisations(stack, organisationsTable, SERVICE_NAME);
  createProfilesSeedSearchIndexPipeline(stack, profilesTable, profilesSeedSearchIndexTable);

  const { bus } = use(Shared);
  bus.addRules(stack, memberEventRules(profilesTable));

  return {
    profilesTable,
    organisationsTable,
    adminTable,
    documentUploadBucket: documentUpload.bucket,
    batchFilesBucket: batchFilesBucket,
    emailTemplatesBucket: bucketName,
    openSearchDomain,
  };
}

export async function MembersApiStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  const { profilesTable, organisationsTable, documentUploadBucket, emailTemplatesBucket } =
    use(MembersStack);
  const { certificateArn } = use(Shared);
  const { authorizer } = use(Identity);

  const { api, requestValidator, config } = createRestApi(
    app,
    stack,
    'members-api',
    certificateArn,
    authorizer,
  );
  const restApi = api.cdk.restApi;

  stack.addOutputs({
    MembersApiEndpoint: api.url,
    MembersApiCustomDomain: api.customDomainUrl,
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(restApi);
  const defaultRouteProps: DefaultRouteProps = {
    name: '',
    stack,
    requestValidator,
    apiGatewayModelGenerator,
    defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
  };
  const routes: Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> = {
    ...memberProfileRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable],
    }),
    ...memberApplicationRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable, documentUploadBucket],
    }),
    ...memberOrganisationsRoutes({ ...defaultRouteProps, bind: [organisationsTable] }),
    ...memberMarketingRoutes({ ...defaultRouteProps, bind: [emailTemplatesBucket] }),
  };

  api.addRoutes(stack, routes);
}

export async function MembersAdminApiStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);

  dependsOn(MembersApiStack);
  const {
    profilesTable,
    organisationsTable,
    adminTable,
    documentUploadBucket,
    openSearchDomain,
    emailTemplatesBucket,
  } = use(MembersStack);
  const { certificateArn, vpc } = use(Shared);
  const { authorizer } = use(Identity);

  const { api, requestValidator, config } = createRestApi(
    app,
    stack,
    'members-admin-api',
    certificateArn,
    authorizer,
  );
  const restApi = api.cdk.restApi;

  stack.addOutputs({
    MembersAdminApiEndpoint: api.url,
    MembersAdminApiCustomDomain: api.customDomainUrl,
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(restApi);
  const defaultRouteProps: DefaultRouteProps = {
    name: '',
    stack,
    requestValidator,
    apiGatewayModelGenerator,
    defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
  };
  const routes: Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> = {
    ...adminProfileRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, organisationsTable],
    }),
    ...adminSearchRoutes(
      {
        ...defaultRouteProps,
        environment: {
          [MemberStackEnvironmentKeys.STAGE]: stack.stage,
          [MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT]:
            config.openSearchDomainEndpoint ?? openSearchDomain,
        },
      },
      vpc,
    ),
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
      bind: [profilesTable, adminTable, organisationsTable],
    }),
    ...adminBatchRoutes({
      ...defaultRouteProps,
      bind: [profilesTable, adminTable, organisationsTable],
    }),
    ...adminPaymentRoutes({
      ...defaultRouteProps,
      bind: [adminTable],
    }),
    ...adminEmailRoutes({ ...defaultRouteProps, bind: [emailTemplatesBucket] }),
  };

  api.addRoutes(stack, routes);
}

function createRestApi(
  app: App,
  stack: Stack,
  name: string,
  certificateArn?: string,
  authorizer?: SharedAuthorizer,
) {
  const config = MemberStackConfigResolver.for(stack, app.region as MemberStackRegion);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  stack.setDefaultFunctionProps(getDefaultFunctionProps(stack.region));

  const authorizers =
    authorizer !== undefined
      ? { memberAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer) }
      : undefined;

  const api = new ApiGatewayV1Api(stack, name, {
    authorizers,
    defaults: {
      authorizer: authorizer !== undefined ? 'memberAuthorizer' : 'none',
    },
    cdk: {
      restApi: {
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
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

function getDefaultFunctionProps(region: string) {
  const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && region
      ? [`arn:aws:lambda:${region}:464622532012:layer:Datadog-Extension:65`]
      : undefined;

  return {
    timeout: 20,
    environment: {
      service: SERVICE_NAME,
      BRAND: getBrandFromEnv(),
      REGION: region,
      SFTP_HOST: getEnvOrDefault(MemberStackEnvironmentKeys.SFTP_HOST, ''),
      SFTP_USER: getEnvOrDefault(MemberStackEnvironmentKeys.SFTP_USER, ''),
      SFTP_PASSWORD: getEnvOrDefault(MemberStackEnvironmentKeys.SFTP_PASSWORD, ''),
      SFTP_PATH_SEND_BATCH_FILE: getEnvOrDefault(
        MemberStackEnvironmentKeys.SFTP_PATH_SEND_BATCH_FILE,
        '',
      ),
      BRAZE_SERVICE_JSON: getEnvOrDefault(MemberStackEnvironmentKeys.BRAZE_SERVICE_JSON, '{}'),
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
      SERVICE_LAYER_EVENT_BUS_NAME: process.env?.SST_STAGE + '-blc-mono-eventBus',
      SERVICE_LAYER_BRAZE_SQS_QUEUE: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_BRAZE_SQS_QUEUE,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERCHANGES: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERCHANGES,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSCOUNTY: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCOUNTY,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSEMAIL: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSEMAIL,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSNEW: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSNEW,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERPROFILES: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERPROFILES,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERUUID: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERUUID,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSVALIDATED: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSVALIDATED,
        '',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_GLOBAL: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_GLOBAL,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_BRAZE: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_BRAZE,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_DWH: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_DWH,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_EMAIL: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_EMAIL,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_LEGACY: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_LEGACY,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_SYSTEM: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_SYSTEM,
        'false',
      ),
    },
    layers,
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
