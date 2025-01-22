import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '../../../middleware';
import { UpdateOrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const orgService = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const organisation = UpdateOrganisationModel.parse(JSON.parse(event.body));
  await orgService.updateOrganisation(organisationId, organisation);
};

export const handler = middleware(unwrappedHandler);
