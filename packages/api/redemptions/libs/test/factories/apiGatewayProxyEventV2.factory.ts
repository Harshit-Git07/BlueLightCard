import { faker } from '@faker-js/faker';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Factory } from 'fishery';

export const apiGatewayProxyEventV2Factory = Factory.define<APIGatewayProxyEventV2>(() => ({
  headers: {
    'content-type': 'application/json',
  },
  isBase64Encoded: false,
  rawPath: '/test',
  rawQueryString: '',
  requestContext: {
    accountId: faker.string.numeric(12),
    apiId: faker.string.numeric(8),
    domainName: faker.internet.domainName(),
    domainPrefix: faker.internet.domainWord(),
    http: {
      method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
      path: '/test',
      protocol: faker.internet.protocol(),
      sourceIp: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
    },
    requestId: faker.string.numeric(8),
    routeKey: '/test',
    stage: 'test',
    time: faker.date.recent().toISOString(),
    timeEpoch: faker.date.recent().getTime(),
    authentication: {
      clientCert: {
        clientCertPem: faker.string.alphanumeric(10),
        subjectDN: faker.internet.domainName(),
        issuerDN: faker.internet.domainName(),
        serialNumber: faker.string.numeric(10),
        validity: {
          notAfter: faker.date.recent().toISOString(),
          notBefore: faker.date.recent().toISOString(),
        },
      },
    },
  },
  routeKey: '/test',
  version: faker.string.numeric(1),
  body: undefined,
  cookies: [],
  pathParameters: undefined,
  queryStringParameters: undefined,
  stageVariables: undefined,
}));
