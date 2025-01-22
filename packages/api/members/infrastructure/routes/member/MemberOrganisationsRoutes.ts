import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';

export function memberOrganisationsRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'GET /orgs': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetOrganisations',
      handler:
        'packages/api/members/application/handlers/member/organisations/getOrganisations.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /orgs/{organisationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetOrganisation',
      handler:
        'packages/api/members/application/handlers/member/organisations/getOrganisation.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetEmployers',
      handler:
        'packages/api/members/application/handlers/member/organisations/getEmployers.handler',
      responseModelType: EmployerModel,
    }),
    'GET /orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetEmployer',
      handler: 'packages/api/members/application/handlers/member/organisations/getEmployer.handler',
      responseModelType: EmployerModel,
    }),
  };
}
