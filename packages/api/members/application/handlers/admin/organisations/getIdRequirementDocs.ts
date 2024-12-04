import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '../../../middleware';
import { IdRequirementModel } from '@blc-mono/members/application/models/idRequirementsModel';

const orgService = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<IdRequirementModel[]> => {
  return await orgService.getIdRequirementDocs();
};

export const handler = middleware(unwrappedHandler);
