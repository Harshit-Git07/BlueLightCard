import * as target from '../apiGatewayProxyResult';
import { APIGatewayProxyResult } from 'aws-lambda';

it('should return true', () => {
  const input: APIGatewayProxyResult = {
    statusCode: 302,
    headers: {
      Location: 'https://www.bluelightcard.co.uk/',
      'content-type': 'text/html',
    },
    body: '',
  };

  const result = target.isAPIGatewayProxyResult(input);

  expect(result).toBe(true);
});
