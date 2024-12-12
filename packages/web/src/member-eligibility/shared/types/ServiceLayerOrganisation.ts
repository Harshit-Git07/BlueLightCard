import { components } from '@bluelightcard/shared-ui/generated/MembersApi';

export type ServiceLayerOrganisation = components['schemas']['OrganisationModel'];
export type ServiceLayerIdRequirements = NonNullable<
  ServiceLayerOrganisation['employedIdRequirements']
>;
