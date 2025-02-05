import { CategoryResponse } from '@blc-mono/discovery/application/models/CategoryResponse';
import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

import { whenCategoriesIsCalledWith, whenCategoryIsCalledWith } from '../helpers';

describe('GET /categories', async () => {
  const testUserTokens = await TestUser.authenticate();
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
        id: '13',
        name: 'Health and Beauty',
      },
      {
        id: '16',
        name: 'Children and Toys',
      },
      {
        id: '8',
        name: 'Electrical',
      },
      {
        id: '4',
        name: 'Fashion',
      },
      {
        id: '7',
        name: 'Financial and Insurance',
      },
      {
        id: '12',
        name: 'Food and Drink',
      },
      {
        id: '17',
        name: 'Gifts and Flowers',
      },
      {
        id: '15',
        name: 'Holiday and Travel',
      },
      {
        id: '1',
        name: 'Home',
      },
      {
        id: '6',
        name: 'Jewellery and Watches',
      },
      {
        id: '11',
        name: 'Leisure and Entertainment',
      },
      {
        id: '18',
        name: 'Motor',
      },
      {
        id: '3',
        name: 'Pets',
      },
      {
        id: '9',
        name: 'Phones',
      },
      {
        id: '14',
        name: 'Sports and Fitness',
      },
      {
        id: '19',
        name: 'Events',
      },
    ];
    const result = await whenCategoriesIsCalledWith({ Authorization: `Bearer ${testUserTokens.idToken}` });
    const resultBody = (await result.json()) as { data: SimpleCategory[] };

    expect(resultBody.data).toStrictEqual(expectedCategories);
  });
});

describe('GET /categories/${id}', async () => {
  const testUserTokens = await TestUser.authenticate();

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
    const result = await whenCategoryIsCalledWith({ Authorization: `Bearer ${testUserTokens.idToken}` }, '1');
    const resultBody = (await result.json()) as { data: CategoryResponse };
    expect(resultBody.data.id).toStrictEqual('1');
    expect(resultBody.data.name).toStrictEqual('Home');
  });
});
