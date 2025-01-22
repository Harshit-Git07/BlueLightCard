import { ApiGatewayV1Api } from 'sst/node/api';

import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { getTestUserBearerToken } from '@blc-mono/members/e2e/TestUser';

describe('GET /categories', () => {
  let bearerToken: string;

  beforeEach(async () => {
    bearerToken = await getTestUserBearerToken();
  });

  it('should return 200 when valid token is provided', async () => {
    const result = await whenGetOrganisationsIsCalledWith({
      Authorization: `Bearer ${bearerToken}`,
    });

    expect(result.status).toBe(200);
  });

  it('should return 401 when invalid token is provided', async () => {
    const result = await whenGetOrganisationsIsCalledWith({ Authorization: 'Bearer invalid' });

    expect(result.status).toBe(401);
  });

  it('should return a valid list of organisations', async () => {
    const result = await whenGetOrganisationsIsCalledWith({
      Authorization: `Bearer ${bearerToken}`,
    });
    const results = (await result.json()) as OrganisationModel[];

    expect(results.length > 0).toBe(true);
    expect(
      results.find((result) => result.employmentStatus?.includes(EmploymentStatus.EMPLOYED)),
    ).toBeDefined();
  });

  const whenGetOrganisationsIsCalledWith = async (headers: Record<string, string>) => {
    const orgsEndpoint = `${ApiGatewayV1Api['members-admin-api'].url}admin/orgs`;
    return await fetch(orgsEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };
});
