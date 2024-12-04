import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { EmployerModel } from '@blc-mono/members/application/models/employerModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';
import { IdType } from '@blc-mono/members/application/models/enums/IdType';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('getEmployers handler', () => {
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const employers: EmployerModel[] = [
    {
      organisationId,
      employerId,
      name: 'Employer1',
      active: false,
      employmentStatus: [EmploymentStatus.EMPLOYED],
      employedIdRequirements: {
        minimumRequired: 1,
        supportedDocuments: [
          { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
        ],
      },
      retiredIdRequirements: {
        minimumRequired: 1,
        supportedDocuments: [
          { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
        ],
      },
      volunteerIdRequirements: {
        minimumRequired: 1,
        supportedDocuments: [
          { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
        ],
      },
      trustedDomains: [],
    },
  ];
  const event = { pathParameters: { organisationId } } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    OrganisationService.prototype.getEmployers = jest.fn().mockResolvedValue(employers);
  });

  it('should return 400 if organisationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with list of employers', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(employers);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../getEmployers')).handler(event, context);
}
