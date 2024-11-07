import { ApiGatewayV1Api } from 'sst/node/api';

import { buildDummyCompany } from '@blc-mono/discovery/application/handlers/companies/getCompanies';
import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

describe('GET /companies', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenCompaniesIsCalledWith = async (headers: Record<string, string>) => {
    const companiesEndpoint = `${ApiGatewayV1Api.discovery.url}companies`;
    return fetch(companiesEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };

  it.each([
    [200, 'A valid request is sent', { Authorization: `Bearer ${testUserTokens.idToken}` }],
    [401, 'No authorization header is provided', {}],
    [401, 'Invalid authorization header is provided', { Authorization: `Bearer invalidToken` }],
  ])('should return with response code %s when %s', async (statusCode, _description, headers) => {
    const result = await whenCompaniesIsCalledWith(headers);
    expect(result.status).toBe(statusCode);
  });

  it('should return the expected companies', async () => {
    const expectedCompanies = [
      buildDummyCompany(1),
      buildDummyCompany(2),
      buildDummyCompany(3),
      buildDummyCompany(4),
      buildDummyCompany(5),
    ];
    const result = await whenCompaniesIsCalledWith({ Authorization: `Bearer ${testUserTokens.idToken}` });
    const resultBody = (await result.json()) as { data: CompanySummary[] };

    expect(resultBody.data).toStrictEqual({ data: expectedCompanies });
  });
});
