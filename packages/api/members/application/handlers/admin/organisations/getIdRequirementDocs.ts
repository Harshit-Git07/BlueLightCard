import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';

const service = new OrganisationService();

const unwrappedHandler = async (): Promise<GetIdRequirementDocsModel[]> => {
  return await service.getIdRequirementDocs();
};

export const handler = middleware(unwrappedHandler);
