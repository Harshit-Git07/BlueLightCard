import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { CreateEmployerModel } from '@blc-mono/members/application/models/employerModel';
import { IdType } from '@blc-mono/members/application/models/enums/IdType';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('createEmployer handler', () => {
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const supportedDocument = {
    idKey: 'passport',
    title: 'Passport',
    description: 'Passport Document',
    type: IdType.IMAGE_UPLOAD,
    guidelines: 'Upload your passport',
    required: false,
  };
  const idRequirements = {
    minimumRequired: 1,
    supportedDocuments: [supportedDocument],
  };
  const employer: CreateEmployerModel = {
    name: 'Employer1',
    active: true,
    employmentStatus: [EmploymentStatus.EMPLOYED],
    employedIdRequirements: idRequirements,
    retiredIdRequirements: idRequirements,
    volunteerIdRequirements: idRequirements,
    trustedDomains: [],
  };
  const responseModel = { organisationId, employerId };
  const event = {
    pathParameters: { organisationId },
    body: JSON.stringify(employer),
  } as any as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    OrganisationService.prototype.createEmployer = jest.fn().mockResolvedValue(employerId);
  });

  it('should return 400 if organisationId is missing', async () => {
    const event = { pathParameters: {} } as any as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { organisationId } } as any as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with created employer ID', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(responseModel);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../createEmployer')).handler(event, context);
}
