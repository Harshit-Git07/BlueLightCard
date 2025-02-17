import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';

const orgService = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<OrganisationModel> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  return await orgService.getOrganisation(organisationId);
};

export const handler = middleware(unwrappedHandler);
