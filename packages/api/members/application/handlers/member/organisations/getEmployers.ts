import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<EmployerModel[]> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  const redactedSchema = EmployerModel.omit({ trustedDomains: true });
  const employers = await service.getEmployers(organisationId);
  return employers.map((employer) => {
    return redactedSchema.parse(employer);
  });
};

export const handler = middleware(unwrappedHandler);
