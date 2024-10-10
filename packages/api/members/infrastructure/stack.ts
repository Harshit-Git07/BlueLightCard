import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, StackContext, use, Table } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';

import { Shared } from '../../../../stacks/stack';
import { MemberStackConfigResolver, MemberStackRegion } from './config/config';

import { createMemberCodesTable } from '@blc-mono/members/infrastructure/dynamodb/createMemberCodesTable';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { MemberProfileModel } from '../application/models/memberProfileModel';
import { GetMemberProfilesRoute } from './routes/GetMemberProfilesRoute';
import { GetMemberCardRoute } from './routes/GetMemberCardRoute';
import { GetMemberApplicationRoute } from './routes/GetMemberApplicationRoute';
import { UpdateMemberApplicationRoute } from './routes/UpdateMemberApplicationRoute';
import { UpdateMemberCardRoute } from './routes/UpdateMemberCardRoute';
import { MemberCardModel } from '../application/models/memberCardModel';

import { MemberApplicationModel } from '../application/models/memberApplicationModel';

import { GetOrganisationsRoute } from './routes/GetOrganisationsRoute';
import { OrganisationModel } from 'application/models/organisationModel';

export async function Members({ stack, app }: StackContext) {
  const identityTableName = `${app.stage}-${app.name}-identityTable`;

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

  const memberCodesTable = createMemberCodesTable(stack);

  const restApi = membersApi.cdk.restApi;

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(membersApi.cdk.restApi);

  const agMembersProfileModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(MemberProfileModel);

  const agMemberCardModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(MemberCardModel);

  const agMemberApplicationModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(MemberApplicationModel);

  const agOrganisationModel =
    apiGatewayModelGenerator.generateModelFromZodEffect(OrganisationModel);

  membersApi.addRoutes(stack, {
    'GET /members/v5/profiles': new GetMemberProfilesRoute(
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
