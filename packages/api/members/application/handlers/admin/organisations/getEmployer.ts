import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<EmployerModel> => {
  const { organisationId, employerId } = event.pathParameters || {};
  if (!organisationId || !employerId) {
    throw new ValidationError('Organisation ID and Employer ID are required');
  }

  return await service.getEmployer(organisationId, employerId);
};

export const handler = middleware(unwrappedHandler);
