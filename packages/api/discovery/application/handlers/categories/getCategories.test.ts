import { handler } from '../../../application/handlers/categories/getCategories';

describe('getCategories Handler', () => {
  it('should return a list of categories', async () => {
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
    const expectedResponse = {
      body: JSON.stringify({ message: 'Success', data: expectedCategories }),
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };

    const result = await handler();

    expect(result).toStrictEqual(expectedResponse);
  });
});
