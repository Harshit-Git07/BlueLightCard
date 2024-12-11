import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';
import { IdType } from '@blc-mono/members/application/models/enums/IdType';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('getOrganisations handler', () => {
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
  const organisations: OrganisationModel[] = [
    {
      organisationId,
      name: 'Org1',
      active: false,
      employmentStatus: [EmploymentStatus.EMPLOYED],
      employedIdRequirements: idRequirements,
      retiredIdRequirements: idRequirements,
      volunteerIdRequirements: idRequirements,
      trustedDomains: [],
    },
  ];
  const event = {} as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    OrganisationService.prototype.getOrganisations = jest.fn().mockResolvedValue(organisations);
  });

  it('should return 200 with list of organisations', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(organisations);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../getOrganisations')).handler(event, context);
}
