import { APIGatewayEvent } from 'aws-lambda';
import { faker } from '@faker-js/faker';

export function mockLambdaEvent(
  path: string,
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
  overrides: Record<string, unknown> = {},
): APIGatewayEvent {
  const stage = faker.helpers.arrayElement(['dev', 'stage', 'prod']);
  return {
    ...overrides,
    body: '',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${faker.string.alphanumeric(20)}`,
    },
    multiValueHeaders: {},
    httpMethod: method,
    isBase64Encoded: faker.datatype.boolean(),
    path,
    pathParameters: {},
    queryStringParameters: {},
    multiValueQueryStringParameters: null,
    stageVariables: {
      stage,
    },
    requestContext: {
      accountId: faker.string.numeric(10),
      resourceId: faker.string.numeric(10),
      stage,
      requestId: faker.string.uuid(),
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: null,
        sourceIp: faker.internet.ip(),
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: faker.internet.userAgent(),
        user: null,
        accessKey: null,
        apiKeyId: null,
        clientCert: null,
        principalOrgId: null,
      },
      resourcePath: '',
      httpMethod: method,
      apiId: faker.string.numeric(10),
      authorizer: null,
      protocol: '',
      path,
      requestTimeEpoch: faker.number.int({ min: 1, max: 10 }),
    },
    resource: path,
  };
}
