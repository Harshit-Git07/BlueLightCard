import { APIGatewayProxyEvent } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { UpdateOrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/organisation/organisationService');

describe('updateOrganisation handler', () => {
  const organisationId = uuidv4();
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
  const organisation: UpdateOrganisationModel = {
    name: 'Org1',
    active: true,
    employmentStatus: [EmploymentStatus.EMPLOYED],
    employedIdRequirements: idRequirements,
    retiredIdRequirements: idRequirements,
    volunteerIdRequirements: idRequirements,
    trustedDomains: [],
  };
  const event = {
    pathParameters: { organisationId },
    body: JSON.stringify(organisation),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    OrganisationService.prototype.updateOrganisation = jest.fn().mockResolvedValue(organisation);
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

  it('should return 204 on successful organisation update', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../updateOrganisation')).handler(event, emptyContextStub);
}
