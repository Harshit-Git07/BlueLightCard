import { APIGatewayProxyResult } from 'aws-lambda';
import { isAPIGatewayProxyResult } from '@blc-mono/members/application/types/apiGatewayProxyResult';

it('should return true', () => {
  const input: APIGatewayProxyResult = {
    statusCode: 302,
    headers: {
      Location: 'https://www.bluelightcard.co.uk/',
      'content-type': 'text/html',
    },
    body: '',
  };

  const result = isAPIGatewayProxyResult(input);

  expect(result).toBe(true);
});
