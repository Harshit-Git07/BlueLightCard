import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

export type ServiceLayerOrganisation = OrganisationModel;
export type ServiceLayerIdRequirements = NonNullable<
  ServiceLayerOrganisation['employedIdRequirements']
>;
export const ServiceLayerEmploymentStatus = EmploymentStatus;
