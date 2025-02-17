import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { UpdateEmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const orgService = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { organisationId, employerId } = event.pathParameters || {};
  if (!organisationId || !employerId) {
    throw new ValidationError('Organisation ID and Employer ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const employer = UpdateEmployerModel.parse(JSON.parse(event.body));
  await orgService.updateEmployer(organisationId, employerId, employer);
};

export const handler = middleware(unwrappedHandler);
