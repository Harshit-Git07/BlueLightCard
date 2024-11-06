import { ApiGatewayV1Api } from 'sst/node/api';

import { buildDummyOffer } from '@blc-mono/discovery/application/handlers/categories/getCategory';
import { CategoryResponse } from '@blc-mono/discovery/application/models/CategoryResponse';
import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

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

describe('GET /categories/${id}', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenCategoryIsCalledWith = async (headers: Record<string, string>, categoryId: string) => {
    const categoriesEndpoint = `${ApiGatewayV1Api.discovery.url}categories/${categoryId}`;
    return fetch(categoriesEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };

  it.each([
    [200, 'A valid request is sent', { Authorization: `Bearer ${testUserTokens.idToken}` }, '1'],
    [401, 'No authorization header is provided', {}, '1'],
    [401, 'Invalid authorization header is provided', { Authorization: `Bearer invalidToken` }, '1'],
    [400, 'Invalid category ID is provided', { Authorization: `Bearer ${testUserTokens.idToken}` }, 'Invalid'],
  ])('should return with response code %s when %s', async (statusCode, _description, headers, categoryId) => {
    const result = await whenCategoryIsCalledWith(headers, categoryId);
    expect(result.status).toBe(statusCode);
  });

  it('should return the expected category', async () => {
    const expectedCategories = [
      buildDummyOffer(1),
      buildDummyOffer(2),
      buildDummyOffer(3),
      buildDummyOffer(4),
      buildDummyOffer(5),
    ];

    const result = await whenCategoryIsCalledWith({ Authorization: `Bearer ${testUserTokens.idToken}` }, '1');
    const resultBody = (await result.json()) as { data: CategoryResponse };

    expect(resultBody.data.id).toStrictEqual('1');
    expect(resultBody.data.name).toStrictEqual('Electrical and phones');
    expect(resultBody.data.data).toStrictEqual(expectedCategories);
  });
});
