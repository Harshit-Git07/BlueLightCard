import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import {
  CreateEmployerModel,
  CreateEmployerResponseModel,
} from '@blc-mono/shared/models/members/employerModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const orgService = new OrganisationService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateEmployerResponseModel> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const employer = CreateEmployerModel.parse(JSON.parse(event.body));
  const employerId = await orgService.createEmployer(organisationId, employer);

  return CreateEmployerResponseModel.parse({
    organisationId,
    employerId,
  });
};

export const handler = middleware(unwrappedHandler);
