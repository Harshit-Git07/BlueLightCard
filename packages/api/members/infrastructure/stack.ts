import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, StackContext, use, Table } from 'sst/constructs';

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
import { GetMemberProfilesRoute } from './routes/GetMemberProfilesRoute';
import { CreateCustomerProfilesRoute } from './routes/CreateCustomerProfilesRoute';
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
import { createMemberCardsTable } from './dynamodb/createMemberCardsTable';

async function MembersStack({ stack, app }: StackContext) {
  const identityTableName = `${stack.stage}-${app.name}-memberProfiles`;

  const { certificateArn } = use(Shared);

  stack.tags.setTag('service', 'members');

  const config = MemberStackConfigResolver.for(stack, app.region as MemberStackRegion);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      service: 'members',
    },
  });

  const membersApi = new ApiGatewayV1Api(stack, 'members', {
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

  const agMemberApplicationExternalModel = apiGatewayModelGenerator.generateModelFromZodEffect(
    MemberApplicationExternalModel,
  );

  const agOrganisationModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(OrganisationModel);

  const agEmployerModel = apiGatewayModelGenerator.generateModelFromZodEffect(EmployerModel);

  membersApi.addRoutes(stack, {
    'GET /members/v5/profiles': new GetMemberProfilesRoute(
      apiGatewayModelGenerator,
      agMembersProfileModel,
      identityTableName,
    ).getRouteDetails(),
    'POST /members/v5/customers/{brand}': new CreateCustomerProfilesRoute(
      apiGatewayModelGenerator,
      agMembersProfileModel,
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/cards/{brand}/{uuid}': new GetMemberCardRoute(
      apiGatewayModelGenerator,
      agMemberCardModel,
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/cards/{brand}/{uuid}/{cardNumber}': new GetMemberCardRoute(
      apiGatewayModelGenerator,
      agMemberCardModel,
      identityTableName,
    ).getRouteDetails(),
    'PUT /members/v5/cards/{brand}/{uuid}/{cardNumber}': new UpdateMemberCardRoute(
      apiGatewayModelGenerator,
      agMemberCardModel,
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/applications/{brand}/{memberUUID}': new GetMemberApplicationRoute(
      apiGatewayModelGenerator,
      agMemberApplicationModel,
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/applications/{brand}/{memberUUID}/{applicationId}':
      new GetMemberApplicationRoute(
        apiGatewayModelGenerator,
        agMemberApplicationModel,
        identityTableName,
      ).getRouteDetails(),
    'PUT /members/v5/applications/{brand}/{memberUUID}/{applicationId}':
      new UpdateMemberApplicationRoute(
        apiGatewayModelGenerator,
        agMemberApplicationModel,
        identityTableName,
      ).getRouteDetails(),
    'POST /members/v5/applications/{brand}/{memberUUID}/{applicationId}':
      new UpdateMemberApplicationRoute(
        apiGatewayModelGenerator,
        agMemberApplicationModel,
        identityTableName,
      ).getRouteDetails(),
    'GET /members/v5/customers/applications/{brand}/{memberUUID}/{applicationId}':
      new ReusableCrudGetRoute(
        apiGatewayModelGenerator,
        agMemberApplicationExternalModel,
        identityTableName,
        'application',
        'applications',
        'MEMBER',
        'APPLICATION',
        'memberUUID',
        'applicationId',
        'MemberApplicationExternalModel',
        'MemberApplicationCustomerPayload',
      ).getRouteDetails(),
    'PUT /members/v5/customers/applications/{brand}/{memberUUID}/{applicationId}':
      new ReusableCrudUpdateRoute(
        apiGatewayModelGenerator,
        agMemberApplicationExternalModel,
        identityTableName,
        'application',
        'applications',
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
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/orgs/{brand}/{organisationId}': new GetOrganisationsRoute(
      apiGatewayModelGenerator,
      agOrganisationModel,
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/orgs/employers/{brand}/{organisationId}': new GetEmployersRoute(
      apiGatewayModelGenerator,
      agEmployerModel,
      identityTableName,
    ).getRouteDetails(),
    'GET /members/v5/orgs/employers/{brand}/{organisationId}/{employerId}': new GetEmployersRoute(
      apiGatewayModelGenerator,
      agEmployerModel,
      identityTableName,
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
