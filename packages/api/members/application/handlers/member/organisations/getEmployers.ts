import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { z } from 'zod';

const service = new OrganisationService();

const RedactedEmployerModel = EmployerModel.omit({ trustedDomains: true });
type RedactedEmployerModel = z.infer<typeof RedactedEmployerModel>;

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<Partial<RedactedEmployerModel>[]> => {
  const { organisationId } = event.pathParameters || {};
  if (!organisationId) {
    throw new ValidationError('Organisation ID is required');
  }

  const employers = await service.getEmployers(organisationId);
  return employers.map((employer) => {
    return RedactedEmployerModel.parse(employer);
  });
};

export const handler = middleware(unwrappedHandler);
