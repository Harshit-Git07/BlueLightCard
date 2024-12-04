import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<EmployerModel[]> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  const redactedSchema = EmployerModel.omit({ trustedDomains: true });
  return (await service.getEmployers(organisationId)).map((employer) =>
    redactedSchema.parse(employer),
  );
};

export const handler = middleware(unwrappedHandler);
