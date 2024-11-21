import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';
import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';

export function adminOrganisationsRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'POST /admin/members/orgs': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createOrganisation.handler',
      requestModelType: OrganisationModel,
    }),
    'PUT /admin/members/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateOrganisation.handler',
      requestModelType: OrganisationModel,
    }),
    'GET /admin/members/orgs': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetOrganisations',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisations.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /admin/members/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisation.handler',
      responseModelType: OrganisationModel,
    }),
    'POST /admin/members/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createEmployer.handler',
      requestModelType: EmployerModel,
    }),
    'PUT /admin/members/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateEmployer.handler',
      requestModelType: EmployerModel,
    }),
    'GET /admin/members/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetEmployers',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployers.handler',
      responseModelType: EmployerModel,
    }),
    'GET /admin/members/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetEmployer',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployer.handler',
      responseModelType: EmployerModel,
    }),
  };
}
