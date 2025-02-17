import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { z } from 'zod';

const orgService = new OrganisationService();

const RedactedOrganisationModel = OrganisationModel.omit({ trustedDomains: true });
type RedactedOrganisationModel = z.infer<typeof RedactedOrganisationModel>;

const unwrappedHandler = async (): Promise<RedactedOrganisationModel[]> => {
  const organisations = await orgService.getOrganisations();
  return organisations.map((organisation) => {
    return RedactedOrganisationModel.parse(organisation);
  });
};

export const handler = middleware(unwrappedHandler);
