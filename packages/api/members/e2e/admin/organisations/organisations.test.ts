import { ApiGatewayV1Api } from 'sst/node/api';

import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';

describe('GET /categories', async () => {
  const apiKey = 'temp';

  const whenGetOrganisationsIsCalledWith = async (headers: Record<string, string>) => {
    const orgsEndpoint = `${ApiGatewayV1Api['members-admin-api'].url}admin/orgs`;
    return fetch(orgsEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };

  it.each([[200, 'A valid request is sent', { 'x-api-key': `${apiKey}` }]])(
    'should return with response code %s when %s',
    async (statusCode, _description, headers) => {
      const result = await whenGetOrganisationsIsCalledWith(headers);
      expect(result.status).toBe(statusCode);
    },
  );

  it('should return a valid list of organisations', async () => {
    const result = await whenGetOrganisationsIsCalledWith({ 'x-api-key': `${apiKey}` });
    const results = (await result.json()) as OrganisationModel[];

    expect(results.length > 0).toBe(true);
    expect(
      results.find((result) => result.employmentStatus?.includes(EmploymentStatus.EMPLOYED)),
    ).toBeDefined();
  });
});
