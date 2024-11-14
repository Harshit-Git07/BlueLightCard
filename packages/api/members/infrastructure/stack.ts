import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  ApiGatewayV1Api,
  StackContext,
  use,
  Table,
  Bucket,
  Function as SSTFunction,
} from 'sst/constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';

import { Shared } from '../../../../stacks/stack';
import {
  MemberStackConfigResolver,
  MemberStackRegion,
} from '@blc-mono/members/infrastructure/config/config';

import { createMemberAdminTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberAdminTable';
import { createMemberBatchesTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberBatchesTable';
import { createMemberCodesTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberCodesTable';
import { createMemberNotesTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberNotesTable';
import { createMemberPromosTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberPromosTable';
import { createMemberProfilesTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberProfilesTable';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { MemberProfileModel } from '../application/models/memberProfileModel';
import { GetMemberCardRoute } from './routes/GetMemberCardRoute';
import { GetMemberApplicationRoute } from './routes/GetMemberApplicationRoute';
import { UpdateMemberApplicationRoute } from './routes/UpdateMemberApplicationRoute';
import { UpdateMemberCardRoute } from './routes/UpdateMemberCardRoute';
import { MemberCardModel } from '../application/models/memberCardModel';
import { MemberApplicationModel } from '../application/models/memberApplicationModel';
import { GetOrganisationsRoute } from './routes/GetOrganisationsRoute';
import { OrganisationModel } from 'application/models/organisationModel';
import { ReusableCrudGetRoute } from './routes/ReusableCrudGetRoute';
import { MemberApplicationExternalModel } from '../application/models/reusableCrudPayloadModels';
import { ReusableCrudUpdateRoute } from './routes/ReusableCrudUpdateRoute';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { EmployerModel } from '../application/models/employerModel';
import { GetEmployersRoute } from './routes/GetEmployersRoute';
import { MemberProfileCustomerModel } from '../application/models/memberProfileCustomerModel';
import { UpdateMemberProfileRoute } from './routes/UpdateMemberProfileRoute';
import { UpdateMemberProfileCustomerRoute } from './routes/UpdateMemberProfileCustomerRoute';
import { CreateMemberProfileCustomerRoute } from './routes/CreateMemberProfileCustomerRoute';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { createMemberCardsTable } from './dynamodb/createMemberCardsTable';
import { IdUploadRoute } from './routes/IdUploadRoute';
import { IdUploadBucketConstruct } from './s3/IdUploadBucketConstruct';
import { GetCustomerProfileRoute } from './routes/GetCustomerProfileRoute';
import { CustomerProfileModel } from '../application/models/customer/customerProfileModel';

import { GetMarketingPreferencesRoute } from './routes/GetMarketingPreferencesRoute';
import { GetBrazeAttributesRoute } from './routes/GetBrazeAttributesRoute';

async function MembersStack({ stack, app }: StackContext) {
  const noteTableName = `${stack.stage}-${app.name}-memberNotes`;
  const SERVICE_NAME = 'members';
  const memberProfilesTableName = `${stack.stage}-${app.name}-memberProfiles`;
  const promoCodeTableName = `${stack.stage}-${app.name}-memberPromos`;

  const { certificateArn } = use(Shared);

  stack.tags.setTag('service', SERVICE_NAME);

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

  const membersApi = new ApiGatewayV1Api(stack, SERVICE_NAME, {
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
              domainName: getDomainName(stack.stage, app.region),
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

  const memberAdminTable = createMemberAdminTable(stack);
  const memberBatchesTable = createMemberBatchesTable(stack);
  const memberCodesTable = createMemberCodesTable(stack);
  const memberNotesTable = createMemberNotesTable(stack);
  const memberPromosTable = createMemberPromosTable(stack);
  const memberProfilesTable = createMemberProfilesTable(stack);
  const memberCardsTable = createMemberCardsTable(stack);

  const restApi = membersApi.cdk.restApi;

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(membersApi.cdk.restApi);

  const agMembersProfileModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(MemberProfileModel);

  const agMemberCardModel = apiGatewayModelGenerator.generateModelFromZodEffect(MemberCardModel);

  const agMemberApplicationModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(MemberApplicationModel);
  const agMemberProfileModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(MemberProfileModel);
  const agMemberProfileCustomerModel = apiGatewayModelGenerator.generateModelFromZodEffect(
    MemberProfileCustomerModel,
  );

  const agMemberApplicationExternalModel = apiGatewayModelGenerator.generateModelFromZodEffect(
    MemberApplicationExternalModel,
  );

  const agOrganisationModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(OrganisationModel);

  const agCustomerProfileModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(CustomerProfileModel);

  const agEmployerModel = apiGatewayModelGenerator.generateModelFromZodEffect(EmployerModel);

  const idUploadBucketConstruct = new IdUploadBucketConstruct(stack, 'IdUploadBucketConstruct', {
    memberProfilesTableName: memberProfilesTableName,
    noteTableName: noteTableName,
    stage: app.stage,
    appName: app.name,
  });

  membersApi.addRoutes(stack, {
    'POST /members/v5/customers': new CreateMemberProfileCustomerRoute(
      apiGatewayModelGenerator,
      agMemberProfileModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'PUT /members/v5/customers/{brand}/{memberUUID}/{profileId}':
      new UpdateMemberProfileCustomerRoute(
        apiGatewayModelGenerator,
        agMemberProfileModel,
        memberProfilesTableName,
      ).getRouteDetails(),
    'GET /members/v5/cards/{brand}/{uuid}': new GetMemberCardRoute(
      apiGatewayModelGenerator,
      agMemberCardModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/cards/{brand}/{uuid}/{cardNumber}': new GetMemberCardRoute(
      apiGatewayModelGenerator,
      agMemberCardModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'PUT /members/v5/cards/{brand}/{uuid}/{cardNumber}': new UpdateMemberCardRoute(
      apiGatewayModelGenerator,
      agMemberCardModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/applications/{brand}/{memberUUID}': new GetMemberApplicationRoute(
      apiGatewayModelGenerator,
      agMemberApplicationModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/applications/{brand}/{memberUUID}/{applicationId}':
      new GetMemberApplicationRoute(
        apiGatewayModelGenerator,
        agMemberApplicationModel,
        memberProfilesTableName,
      ).getRouteDetails(),
    'PUT /members/v5/applications/{brand}/{memberUUID}/{applicationId}':
      new UpdateMemberApplicationRoute(
        apiGatewayModelGenerator,
        agMemberApplicationModel,
        memberProfilesTableName,
      ).getRouteDetails(),
    'PUT /members/v5/profiles/{memberUUID}/{profileId}': new UpdateMemberProfileRoute(
      apiGatewayModelGenerator,
      agMemberProfileModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/profile/id/init/{memberUUID}': new IdUploadRoute(
      apiGatewayModelGenerator,
      agMembersProfileModel,
      memberProfilesTableName,
      idUploadBucketConstruct.bucket,
    ).getRouteDetails(),
    'POST /members/v5/applications/{brand}/{memberUUID}/{applicationId}':
      new UpdateMemberApplicationRoute(
        apiGatewayModelGenerator,
        agMemberApplicationModel,
        memberProfilesTableName,
      ).getRouteDetails(),
    'GET /members/v5/customers/applications/{memberUUID}/{applicationId}': new ReusableCrudGetRoute(
      apiGatewayModelGenerator,
      agMemberApplicationExternalModel,
      memberProfilesTableName,
      'application',
      'applications',
      'MEMBER',
      'APPLICATION',
      'memberUUID',
      'applicationId',
      'MemberApplicationExternalModel',
      'MemberApplicationCustomerPayload',
    ).getRouteDetails(),
    'PUT /members/v5/customers/applications/{memberUUID}/{applicationId}':
      new ReusableCrudUpdateRoute(
        apiGatewayModelGenerator,
        agMemberApplicationExternalModel,
        memberProfilesTableName,
        'application',
        'applications',
        memberProfilesTableName,
        promoCodeTableName,
        'MEMBER',
        'APPLICATION',
        'memberUUID',
        'applicationId',
        'MemberApplicationExternalModel',
        'MemberApplicationCustomerPayload',
      ).getRouteDetails(),
    'GET /members/v5/orgs/{brand}': new GetOrganisationsRoute(
      apiGatewayModelGenerator,
      agOrganisationModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/orgs/{brand}/{organisationId}': new GetOrganisationsRoute(
      apiGatewayModelGenerator,
      agOrganisationModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/customer/{brand}/{memberUuid}/{profileUuid}': new GetCustomerProfileRoute(
      apiGatewayModelGenerator,
      agCustomerProfileModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/orgs/employers/{brand}/{organisationId}': new GetEmployersRoute(
      apiGatewayModelGenerator,
      agEmployerModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/orgs/employers/{brand}/{organisationId}/{employerId}': new GetEmployersRoute(
      apiGatewayModelGenerator,
      agEmployerModel,
      memberProfilesTableName,
    ).getRouteDetails(),
    'GET /members/v5/marketingPreferences/{brand}/{memberUUID}/{version}':
      new GetMarketingPreferencesRoute(
        apiGatewayModelGenerator,
        agOrganisationModel,
        app.stage,
      ).getRouteDetails(),
    'POST /members/v5/getBrazeAttributes/': new GetBrazeAttributesRoute(
      apiGatewayModelGenerator,
      agOrganisationModel,
      app.stage,
    ).getRouteDetails(),
  });

  stack.addOutputs({
    MembersApiEndpoint: membersApi.url,
    MembersApiCustomDomain: membersApi.customDomainUrl,
  });

  const apikey = membersApi.cdk.restApi.addApiKey('members-api-key');

  const usagePlan = membersApi.cdk.restApi.addUsagePlan('members-api-usage-plan', {
    throttle: {
      rateLimit: 1,
      burstLimit: 2,
    },
    apiStages: [
      {
        api: membersApi.cdk.restApi,
        stage: membersApi.cdk.restApi.deploymentStage,
      },
    ],
  });
  usagePlan.addApiKey(apikey);

  return {
    membersApi: membersApi,
  };
}

const getDomainName = (stage: string, region: string) => {
  return region === 'ap-southeast-2' ? getAustraliaDomainName(stage) : getUKDomainName(stage);
};

const getAustraliaDomainName = (stage: string) =>
  stage === 'production' ? 'members-au.blcshine.io' : `${stage}-members-au.blcshine.io`;

const getUKDomainName = (stage: string) =>
  stage === 'production' ? 'members.blcshine.io' : `${stage}-members.blcshine.io`;

export const Members =
  getEnvRaw(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK) === 'false'
    ? MembersStack
    : () => Promise.resolve();
