import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';

const service = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<EmployerModel[]> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  return await service.getEmployers(organisationId);
};

export const handler = middleware(unwrappedHandler);
