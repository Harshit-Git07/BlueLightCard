import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '../../../middleware';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const orgService = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<OrganisationModel> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  const redactedSchema = OrganisationModel.omit({ trustedDomains: true });
  const organisation = await orgService.getOrganisation(organisationId);
  return redactedSchema.parse(organisation);
};

export const handler = middleware(unwrappedHandler);
