import { randomUUID } from 'node:crypto';

import { Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { ApiGatewayV1Api } from 'sst/node/api';

import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

describe('GET /companies', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenCompaniesIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
    const urlParams = new URLSearchParams(params);
    const companiesEndpoint = `${ApiGatewayV1Api.discovery.url}companies?${urlParams.toString()}`;
    return fetch(companiesEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };

  it.each([
    [
      200,
      'A valid request is sent',
      { dob: '2001-01-01', organisation: 'blc', skipCache: 'true' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [
      400,
      'No organisation param provided',
      { dob: '2001-01-01', organisation: '', skipCache: 'true' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [
      400,
      'No dob param provided',
      { dob: '', organisation: 'blc', skipCache: 'true' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [401, 'No authorization header is provided', {}, {}],
    [401, 'Invalid authorization header is provided', {}, { Authorization: `Bearer invalidToken` }],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenCompaniesIsCalledWith(params, headers);
    expect(result.status).toBe(statusCode);
  });

  describe('Event Handling', () => {
    const generatedOfferUUID = `test-${randomUUID().toString()}`;
    const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;

    const offers: SanityOffer[] = [
      buildTestSanityOffer({ _id: generatedOfferUUID, company: buildTestSanityCompany({ _id: generatedCompanyUUID }) }),
    ];

    afterAll(async () => {
      await sendTestEvents({
        source: Events.OFFER_DELETED,
        events: offers.map((offer) => ({ ...offer, _updatedAt: new Date(Date.now()).toISOString() })),
      });
    });

    beforeAll(async () => {
      await sendTestEvents({ source: Events.OFFER_CREATED, events: offers });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await sendTestEvents({ source: Events.OPENSEARCH_POPULATE_INDEX, events: offers });
      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    it('should return all companies as a list', async () => {
      const expectedCompanyResult = {
        companyID: offers[0].company?._id,
        companyName: offers[0].company?.brandCompanyDetails?.[0].companyName,
        legacyCompanyID: offers[0].company?.companyId,
      };

      const result = await whenCompaniesIsCalledWith(
        { dob: '2001-01-01', organisation: 'blc', skipCache: 'true' },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const resultBody = (await result.json()) as { data: CompanySummary[] };
      const companyResult = resultBody.data.find((company) => company.companyID === generatedCompanyUUID);
      expect(companyResult).toStrictEqual(expectedCompanyResult);
    });
  });
});
