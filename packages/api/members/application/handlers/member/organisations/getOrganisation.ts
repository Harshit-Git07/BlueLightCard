import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const orgService = new OrganisationService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<Partial<OrganisationModel>> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  const organisation = await orgService.getOrganisation(organisationId);
  // TODO: Ideally we should have a new model for this for customer facing API, but for now we are just removing the trusted domains
  organisation.trustedDomains = [];
  return organisation;
};

export const handler = middleware(unwrappedHandler);
