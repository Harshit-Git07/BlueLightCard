import { APIGatewayProxyEvent } from 'aws-lambda';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/organisation/organisationService');

describe('getEmployer handler', () => {
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
  const employer: EmployerModel = {
    organisationId,
    employerId,
    name: 'Employer1',
    active: false,
    employmentStatus: [EmploymentStatus.EMPLOYED],
    employedIdRequirements: idRequirements,
    retiredIdRequirements: idRequirements,
    volunteerIdRequirements: idRequirements,
    trustedDomains: [],
  };
  const event = {
    pathParameters: { organisationId, employerId },
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    OrganisationService.prototype.getEmployer = jest.fn().mockResolvedValue(employer);
  });

  it('should return 400 if organisationId or employerId is missing', async () => {
    const event = { pathParameters: { organisationId } } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with employer details', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(employer);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../getEmployer')).handler(event, emptyContextStub);
}
