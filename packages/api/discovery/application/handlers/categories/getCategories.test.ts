import { handler } from '../../../application/handlers/categories/getCategories';

describe('getCategories Handler', () => {
  it('should return a list of categories', async () => {
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
