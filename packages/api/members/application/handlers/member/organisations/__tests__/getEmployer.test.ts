import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('getEmployer handler', () => {
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const employer: EmployerModel = {
    employerId,
    name: 'Employer1',
    active: false,
    volunteers: false,
    retired: false,
    trustedDomains: [],
  };
  const event = {
    pathParameters: { organisationId, employerId },
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    OrganisationService.prototype.getEmployer = jest.fn().mockResolvedValue(employer);
  });

  it('should return 400 if organisationId or employerId is missing', async () => {
    const event = { pathParameters: { organisationId } } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with employer details', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(employer);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../getEmployer')).handler(event, context);
}
