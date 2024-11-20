import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@blc-mono/members/application/services/organisationService');

describe('getOrganisations handler', () => {
  const organisationId = uuidv4();
  const organisations: OrganisationModel[] = [
    {
      organisationId,
      name: 'Org1',
      active: false,
      volunteers: false,
      retired: false,
      idRequirements: [],
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
