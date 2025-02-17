import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<EmployerModel> => {
  const { organisationId, employerId } = event.pathParameters || {};
  if (!organisationId || !employerId) {
    throw new ValidationError('Organisation ID and Employer ID are required');
  }

  const employer = await service.getEmployer(organisationId, employerId);
  // TODO: Ideally we should have a new model for this for customer facing API, but for now we are just removing the trusted domains
  employer.trustedDomains = [];
  return employer;
};

export const handler = middleware(unwrappedHandler);
