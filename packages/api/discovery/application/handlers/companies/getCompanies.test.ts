import { APIGatewayEvent } from 'aws-lambda';

import { buildDummyCompany } from '@blc-mono/discovery/application/handlers/companies/getCompanies';

import { handler } from './getCompanies';

describe('getCompanies Handler', () => {
  const expectedCompanies = [
    buildDummyCompany(1),
    buildDummyCompany(2),
    buildDummyCompany(3),
    buildDummyCompany(4),
    buildDummyCompany(5),
  ];

  it('should return a list of companies', async () => {
    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: {
          data: expectedCompanies,
        },
      }),
      200,
    );
  });

  const givenGetCompaniesCalledWithDobAndOrganisation = async (dob: string, organisation: string) => {
    const event: Partial<APIGatewayEvent> = {
      headers: {
        Authorization: 'idToken',
      },
      queryStringParameters: {
        dob,
        organisation,
      },
    };

    return handler(event);
  };

  const thenResponseShouldEqual = (result: unknown, expectedBody: string, expectedStatusCode: number) => {
    const expectedResponse = {
      body: expectedBody,
      statusCode: expectedStatusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
    expect(result).toStrictEqual(expectedResponse);
  };
});
