import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { CreateOrganisationModel } from '@blc-mono/members/application/models/organisationModel';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';
import { IdType } from '@blc-mono/members/application/models/enums/IdType';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('createOrganisation handler', () => {
  const organisationId = uuidv4();
  const organisation: CreateOrganisationModel = {
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
  const responseModel = { organisationId };
  const event = {
    body: JSON.stringify(organisation),
  } as any as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    OrganisationService.prototype.createOrganisation = jest.fn().mockResolvedValue(organisationId);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as any as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with created organisation ID', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(responseModel);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../createOrganisation')).handler(event, context);
}
