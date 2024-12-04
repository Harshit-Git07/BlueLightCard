import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';
import { UpdateOrganisationModel } from '@blc-mono/members/application/models/organisationModel';
import { IdType } from '@blc-mono/members/application/models/enums/IdType';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('updateOrganisation handler', () => {
  const organisationId = uuidv4();
  const organisation: UpdateOrganisationModel = {
    name: 'Org1',
    active: true,
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
  };
  const event = {
    pathParameters: { organisationId },
    body: JSON.stringify(organisation),
  } as any as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    OrganisationService.prototype.updateOrganisation = jest.fn().mockResolvedValue(organisation);
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

  it('should return 204 on successful organisation update', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../updateOrganisation')).handler(event, context);
}
