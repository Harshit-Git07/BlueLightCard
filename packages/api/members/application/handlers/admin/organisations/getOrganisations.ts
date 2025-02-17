import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';

const orgService = new OrganisationService();

const unwrappedHandler = async (): Promise<OrganisationModel[]> => {
  return await orgService.getOrganisations();
};

export const handler = middleware(unwrappedHandler);
