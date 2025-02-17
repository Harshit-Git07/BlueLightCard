import {
  CreateEmployerModel,
  CreateEmployerResponseModel,
  EmployerModel,
  UpdateEmployerModel,
} from '@blc-mono/shared/models/members/employerModel';
import {
  CreateOrganisationModel,
  CreateOrganisationResponseModel,
  OrganisationModel,
  UpdateOrganisationModel,
} from '@blc-mono/shared/models/members/organisationModel';
import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function adminOrganisationsRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  return {
    'GET /admin/orgs': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetOrganisations',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisations.handler',
      responseModelType: OrganisationModel,
    }),
    'GET /admin/orgs/{organisationId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getOrganisation.handler',
      responseModelType: OrganisationModel,
    }),
    'POST /admin/orgs': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createOrganisation.handler',
      requestModelType: CreateOrganisationModel,
      responseModelType: CreateOrganisationResponseModel,
    }),
    'PUT /admin/orgs/{organisationId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateOrganisation',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateOrganisation.handler',
      requestModelType: UpdateOrganisationModel,
    }),
    'GET /admin/orgs/{organisationId}/employers': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetEmployers',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployers.handler',
      responseModelType: EmployerModel,
    }),
    'GET /admin/orgs/{organisationId}/employers/{employerId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetEmployer',
      handler: 'packages/api/members/application/handlers/admin/organisations/getEmployer.handler',
      responseModelType: EmployerModel,
    }),
    'POST /admin/orgs/{organisationId}/employers': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/createEmployer.handler',
      requestModelType: CreateEmployerModel,
      responseModelType: CreateEmployerResponseModel,
    }),
    'PUT /admin/orgs/{organisationId}/employers/{employerId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateEmployer',
      handler:
        'packages/api/members/application/handlers/admin/organisations/updateEmployer.handler',
      requestModelType: UpdateEmployerModel,
    }),
    'GET /admin/id-requirement-docs': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetIdRequirementDocs',
      handler:
        'packages/api/members/application/handlers/admin/organisations/getIdRequirementDocs.handler',
      responseModelType: GetIdRequirementDocsModel,
    }),
  };
}
