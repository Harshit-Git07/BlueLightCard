import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';

// Need to handle filtering on employment status for eligibility
export function memberOrganisationsRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
  organisationsTable: Table,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    bind: [organisationsTable],
  };

  return {
    'GET /members/orgs': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetOrganisations',
      handler:
        'packages/api/members/application/handlers/member/organisations/getOrganisations.handler',
      responseModel: apiGatewayModelGenerator.generateModel(OrganisationModel),
    }),
    'GET /members/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetOrganisation',
      handler:
        'packages/api/members/application/handlers/member/organisations/getOrganisation.handler',
      responseModel: apiGatewayModelGenerator.generateModel(OrganisationModel),
    }),
    'GET /members/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetEmployers',
      handler:
        'packages/api/members/application/handlers/member/organisations/getEmployers.handler',
      responseModel: apiGatewayModelGenerator.generateModel(EmployerModel),
    }),
    'GET /members/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetEmployer',
      handler: 'packages/api/members/application/handlers/member/organisations/getEmployer.handler',
      responseModel: apiGatewayModelGenerator.generateModel(EmployerModel),
    }),
  };
}
