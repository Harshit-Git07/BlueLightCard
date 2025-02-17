import { APIGatewayProxyEvent } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/organisation/organisationService');

describe('getOrganisations handler', () => {
  const organisationId = uuidv4();
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

  beforeEach(() => {
    OrganisationService.prototype.getOrganisations = jest.fn().mockResolvedValue(organisations);
  });

  it('should return 200 with list of organisations', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual([
      {
        ...organisations[0],
        trustedDomains: undefined,
      },
    ]);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../getOrganisations')).handler(event, emptyContextStub);
}
