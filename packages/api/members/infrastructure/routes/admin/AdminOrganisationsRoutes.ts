import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  CreateEmployerModel,
  CreateEmployerResponseModel,
  EmployerModel,
  UpdateEmployerModel,
} from '@blc-mono/members/application/models/employerModel';
import {
  CreateOrganisationModel,
  CreateOrganisationResponseModel,
  OrganisationModel,
  UpdateOrganisationModel,
} from '@blc-mono/members/application/models/organisationModel';
import { IdRequirementModel } from '@blc-mono/members/application/models/idRequirementsModel';

export function adminOrganisationsRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'GET /admin/id-requirement-docs': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetIdRequirementDocs',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getIdRequirementDocs.handler',
      responseModelType: IdRequirementModel,
    }),
    'POST /admin/orgs': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createOrganisation.handler',
      requestModelType: CreateOrganisationModel,
      responseModelType: CreateOrganisationResponseModel,
    }),
    'PUT /admin/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateOrganisation.handler',
      requestModelType: UpdateOrganisationModel,
    }),
    'GET /admin/orgs': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetOrganisations',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisations.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /admin/orgs/{organisationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisation.handler',
      responseModelType: OrganisationModel,
    }),
    'POST /admin/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createEmployer.handler',
      requestModelType: CreateEmployerModel,
      responseModelType: CreateEmployerResponseModel,
    }),
    'PUT /admin/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateEmployer.handler',
      requestModelType: UpdateEmployerModel,
    }),
    'GET /admin/orgs/{organisationId}/employers': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetEmployers',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployers.handler',
      responseModelType: EmployerModel,
    }),
    'GET /admin/orgs/{organisationId}/employers/{employerId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetEmployer',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployer.handler',
      responseModelType: EmployerModel,
    }),
  };
}
