import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';
import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';

// Need to handle filtering on employment status for eligibility
export function adminOrganisationsRoutes(
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
    'POST /admin/members/orgs': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCreateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createOrganisation.handler',
      requestModel: apiGatewayModelGenerator.generateModel(OrganisationModel),
    }),
    'PUT /admin/members/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateOrganisation.handler',
      requestModel: apiGatewayModelGenerator.generateModel(OrganisationModel),
    }),
    'GET /admin/members/orgs': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetOrganisations',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisations.handler',
      responseModel: apiGatewayModelGenerator.generateModel(OrganisationModel),
    }),
    'GET /admin/members/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisation.handler',
      responseModel: apiGatewayModelGenerator.generateModel(OrganisationModel),
    }),
    'POST /admin/members/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCreateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createEmployer.handler',
      requestModel: apiGatewayModelGenerator.generateModel(EmployerModel),
    }),
    'PUT /admin/members/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateEmployer.handler',
      requestModel: apiGatewayModelGenerator.generateModel(EmployerModel),
    }),
    'GET /admin/members/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetEmployers',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployers.handler',
      responseModel: apiGatewayModelGenerator.generateModel(EmployerModel),
    }),
    'GET /admin/members/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetEmployer',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployer.handler',
      responseModel: apiGatewayModelGenerator.generateModel(EmployerModel),
    }),
  };
}
