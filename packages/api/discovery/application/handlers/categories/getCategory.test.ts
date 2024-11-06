import { APIGatewayEvent } from 'aws-lambda';

import { buildDummyOffer, handler } from '../../../application/handlers/categories/getCategory';

describe('getCategory Handler', () => {
  const expectedOffers = [
    buildDummyOffer(1),
    buildDummyOffer(2),
    buildDummyOffer(3),
    buildDummyOffer(4),
    buildDummyOffer(5),
  ];

  it('should return a list of offers for a category', async () => {
    const result = await givenGetCategoryCalledWithCategory('1');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: {
          id: '1',
          name: 'Electrical and phones',
          data: expectedOffers,
        },
      }),
      200,
    );
  });

  it('should return an error if invalid category id present', async () => {
    const result = await givenGetCategoryCalledWithCategory('invalid');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Invalid category ID',
        data: {},
      }),
      400,
    );
  });

  const givenGetCategoryCalledWithCategory = async (categoryId: string) => {
    const event: Partial<APIGatewayEvent> = {
      headers: {
        Authorization: 'idToken',
      },
      pathParameters: {
        id: categoryId,
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
