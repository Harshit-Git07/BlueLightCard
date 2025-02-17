import {
  DefaultRouteProps,
  createRoute,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { MemberRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/types/memberRoutes';

export function memberOrganisationsRoutes(defaultRouteProps: DefaultRouteProps): MemberRoutes {
  return {
    'GET /orgs': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetOrganisations',
      handler:
        'packages/api/members/application/handlers/member/organisations/getOrganisations.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /orgs/{organisationId}': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetOrganisation',
      handler:
        'packages/api/members/application/handlers/member/organisations/getOrganisation.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /orgs/{organisationId}/employers': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetEmployers',
      handler:
        'packages/api/members/application/handlers/member/organisations/getEmployers.handler',
      responseModelType: EmployerModel,
    }),
    'GET /orgs/{organisationId}/employers/{employerId}': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetEmployer',
      handler: 'packages/api/members/application/handlers/member/organisations/getEmployer.handler',
      responseModelType: EmployerModel,
    }),
  };
}
