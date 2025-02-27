import { APIGatewayProxyEvent } from 'aws-lambda';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';

jest.mock('@blc-mono/members/application/services/organisation/organisationService');

describe('getEmployers handler', () => {
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const supportedDocument: NonNullable<
    OrganisationModel['employedIdRequirements']
  >['supportedDocuments'][number] = {
    idKey: 'passport',
    title: 'Passport',
    description: 'Passport Document',
    type: IdType.IMAGE_UPLOAD,
    guidelines: 'Upload your passport',
    required: false,
  };
  const idRequirements: OrganisationModel['employedIdRequirements'] = {
    minimumRequired: 1,
    supportedDocuments: [supportedDocument],
  };
  const employers: EmployerModel[] = [
    {
      organisationId,
      employerId,
      name: 'Employer1',
      active: false,
      employmentStatus: [EmploymentStatus.EMPLOYED],
      employedIdRequirements: idRequirements,
      retiredIdRequirements: idRequirements,
      volunteerIdRequirements: idRequirements,
      trustedDomains: [],
    },
  ];
  const event = { pathParameters: { organisationId } } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    OrganisationService.prototype.getEmployers = jest.fn().mockResolvedValue(employers);
  });

  it('should return 400 if organisationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with list of employers', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(employers);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../getEmployers')).handler(event, emptyContextStub);
}
