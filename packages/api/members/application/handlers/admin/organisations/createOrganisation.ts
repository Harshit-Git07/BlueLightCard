import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '../../../middleware';
import {
  CreateOrganisationModel,
  CreateOrganisationResponseModel,
} from '@blc-mono/shared/models/members/organisationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const orgService = new OrganisationService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateOrganisationResponseModel> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const organisation = CreateOrganisationModel.parse(JSON.parse(event.body));
  const organisationId = await orgService.createOrganisation(organisation);

  return CreateOrganisationResponseModel.parse({ organisationId });
};

export const handler = middleware(unwrappedHandler);
