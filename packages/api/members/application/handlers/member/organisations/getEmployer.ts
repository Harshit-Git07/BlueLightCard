import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<EmployerModel> => {
  const { organisationId, employerId } = event.pathParameters || {};
  if (!organisationId || !employerId) {
    throw new ValidationError('Organisation ID and Employer ID are required');
  }

  const redactedSchema = EmployerModel.omit({ trustedDomains: true });
  const employer = await service.getEmployer(organisationId, employerId);
  return redactedSchema.parse(employer);
};

export const handler = middleware(unwrappedHandler);
