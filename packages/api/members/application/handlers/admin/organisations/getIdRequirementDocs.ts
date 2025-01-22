import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { middleware } from '../../../middleware';
import { IdRequirementModel } from '@blc-mono/shared/models/members/idRequirementsModel';

const orgService = new OrganisationService();

const unwrappedHandler = async (): Promise<IdRequirementModel[]> => {
  return await orgService.getIdRequirementDocs();
};

export const handler = middleware(unwrappedHandler);
