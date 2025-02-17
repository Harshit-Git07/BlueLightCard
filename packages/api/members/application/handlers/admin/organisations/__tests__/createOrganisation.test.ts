import { APIGatewayProxyEvent } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { CreateOrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/organisation/organisationService');

describe('createOrganisation handler', () => {
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
  const organisation: CreateOrganisationModel = {
    name: 'Org1',
    active: true,
    employmentStatus: [EmploymentStatus.EMPLOYED],
    employedIdRequirements: idRequirements,
    retiredIdRequirements: idRequirements,
    volunteerIdRequirements: idRequirements,
    trustedDomains: [],
  };
  const responseModel = { organisationId };
  const event = {
    body: JSON.stringify(organisation),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    OrganisationService.prototype.createOrganisation = jest.fn().mockResolvedValue(organisationId);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with created organisation ID', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(responseModel);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../createOrganisation')).handler(event, emptyContextStub);
}
