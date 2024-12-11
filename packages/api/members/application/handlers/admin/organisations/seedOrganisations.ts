import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { middleware } from '../../../middleware';

const orgService = new OrganisationService();

const unwrappedHandler = async (): Promise<void> => {
  await orgService.loadOrganisationsAndEmployers();
};

export const handler = middleware(unwrappedHandler);
