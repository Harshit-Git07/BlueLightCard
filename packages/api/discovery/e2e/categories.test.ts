import { ApiGatewayV1Api } from 'sst/node/api';

import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
import { TestUser } from '@blc-mono/redemptions/libs/test/helpers/identity';

describe('GET /categories', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenCategoriesIsCalledWith = async (headers: Record<string, string>) => {
    const categoriesEndpoint = `${ApiGatewayV1Api.discovery.url}categories`;
    return fetch(categoriesEndpoint, {
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
    const result = await whenCategoriesIsCalledWith(headers);
    expect(result.status).toBe(statusCode);
  });

  it('should return the expected categories', async () => {
    const expectedCategories = [
      {
        id: '11',
        name: 'Children and toys',
      },
      {
        id: '3',
        name: 'Days out',
      },
      {
        id: '1',
        name: 'Electrical and phones',
      },
      {
        id: '6',
        name: 'Entertainment',
      },
      {
        id: '8',
        name: 'Fashion',
      },
      {
        id: '16',
        name: 'Featured',
      },
      {
        id: '9',
        name: 'Financial and insurance',
      },
      {
        id: '15',
        name: 'Food and drink',
      },
      {
        id: '5',
        name: 'Gifts',
      },
      {
        id: '4',
        name: 'Health and beauty',
      },
      {
        id: '2',
        name: 'Holiday and travel',
      },
      {
        id: '10',
        name: 'Home and garden',
      },
      {
        id: '7',
        name: 'Motoring',
      },
      {
        id: '17',
        name: 'Popular',
      },
      {
        id: '14',
        name: 'Seasonal',
      },
      {
        id: '13',
        name: 'Shoes and accessories',
      },
      {
        id: '12',
        name: 'Sport and leisure',
      },
    ];
    const result = await whenCategoriesIsCalledWith({ Authorization: `Bearer ${testUserTokens.idToken}` });
    const resultBody = (await result.json()) as { data: SimpleCategory[] };

    expect(resultBody.data).toStrictEqual(expectedCategories);
  });
});
