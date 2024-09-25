# Discovery

The Discovery package contains all API's related to homepage and search functionality. It is built using API Gateway,
Lambda, OpenSearch and DynamoDB. Primary language is Typescript and SST is used for defining infrastructure.

OpenSearch indexes are created sourcing data from DynamoDB and are used to provide search functionality to users.

Data updates are triggered via EventBridge - Offer changes, company changes etc.

## Endpoints

### GET /search

## Environment Variables

```
SEARCH_LAMBDA_SCRIPTS_HOST - host for the lambda scripts hosted search service
SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT - develop | production
SEARCH_BRAND - 1 | 2 (UK or DDS)
SEARCH_AUTH_TOKEN_OVERRIDE - override the auth token for the search service, useful if running stack outside of staging
or production environments (format is "Bearer abc123")

#open search
OPENSEARCH_DOMAIN_ENDPOINT=
OPENSEARCH_CREATE_NEW_DOMAIN=false
OPENSEARCH_INITIAL_ADMIN_PASSWORD=
```

### Running against Local OpenSearch

When you run `npm run dev` (from the root), it will start a local OpenSearch container using Docker.
This allows you to work with OpenSearch on your machine. You'll be able to access this on port: 5601.
http://localhost:5601/

After it's running, you can test the createSearchIndex Lambda function.
To do this, go to the AWS Lambda Console, search createSearchIndex lambda for your stack, and use the Test tab to run
it.
If everything is set up correctly, the Lambda will create a search index and return a
success message. This lets you test how your code interacts with OpenSearch locally before
deploying it.

### Running against Custom OpenSearch

NOTE: OpenSearch is expensive, so only do this if you are working directly on OpenSearch config & please
ensure you tear it down as soon as you are done with it.

If you want to use a new opensearch that is specific to your branch in the .env file find the variable
OPENSEARCH_CREATE_NEW_DOMAIN and set this to true. When running the code will ready this value and create for you a new
domain.
This can be found in the AWS OpenSearch Service. Once a search has been created you can change this value back to false
and
grab the domain endpoint value and update the OPENSEARCH_DOMAIN_ENDPOINT variable.

### Running against Staging/Ephemeral OpenSearch

When running in Prod/Ephemeral there is a check in OpenSearchDomain.ts that checks what environment that you are running
in.
This is in the same location as the check for OPENSEARCH_CREATE_NEW_DOMAIN. As it stands the current set up at the time
of writing
Prod/Ephemeral will create new domains and staging and normally local will use the URL set in the
OPENSEARCH_DOMAIN_ENDPOINT variable.

### Remove Docker

To teardown the docker environment run the following :

```sh
docker compose down
```

or go into the docker desktop and stop then remove the environments

## Testing

```shell
npm run test
```

## E2E Tests

- From the top level directory run:

```shell
npm npm run dev
```

- In a separate terminal navigate to `packages/api/discovery` and run:

```shell
npm run e2e:discovery
```

## Linting

```shell
npm run lint
```

## Formatting

```shell
npm run format
```

<!-- trigger release TODO: Remove ( 1.3.0 ) -->
