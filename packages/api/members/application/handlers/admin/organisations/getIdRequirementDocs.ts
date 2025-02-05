import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { middleware } from '../../../middleware';
import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';

const orgService = new OrganisationService();

const unwrappedHandler = async (): Promise<GetIdRequirementDocsModel[]> => {
  return await orgService.getIdRequirementDocs();
};

export const handler = middleware(unwrappedHandler);
