import fs from 'fs';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Discovery API',
    description: 'Discovery API to discover offers and companies',
  },
  host: process.argv[2] === 'production' ? 'discovery.blcshine.io' : 'staging-discovery.blcshine.io',
  basePath: '/',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Member',
      description: 'Member facing endpoints',
    },
  ],
  components: {
    securitySchemes: {
      OAuth2: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://staging-blc-mono.auth.eu-west-2.amazoncognito.com/oauth2/authorize',
            tokenUrl: 'https://staging-blc-mono.auth.eu-west-2.amazoncognito.com/oauth2/token',
            scopes: {},
          },
        },
      },
    },
  },
};

const outputFile = './swagger.json';
const routes = fs.readdirSync('./application/documentation/').map((file) => `./application/documentation/${file}`);

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
