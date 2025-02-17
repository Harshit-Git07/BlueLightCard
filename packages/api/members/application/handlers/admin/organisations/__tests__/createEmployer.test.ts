import { APIGatewayProxyEvent } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { CreateEmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/organisation/organisationService');

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
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    OrganisationService.prototype.createEmployer = jest.fn().mockResolvedValue(employerId);
  });

  it('should return 400 if organisationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { organisationId } } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with created employer ID', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(responseModel);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../createEmployer')).handler(event, emptyContextStub);
}
