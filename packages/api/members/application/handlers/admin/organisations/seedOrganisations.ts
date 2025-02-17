import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const orgService = new OrganisationService();

const unwrappedHandler = async (): Promise<void> => {
  await orgService.loadOrganisationsAndEmployers();
};

export const handler = middleware(unwrappedHandler);
