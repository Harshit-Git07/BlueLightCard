# Members

The Members package contains all API's related to member admin functionality. It is built using API Gateway,
Lambda, Opensearch and DynamoDB. Primary language is Typescript and SST is used for defining infrastructure.

## Running locally

```shell
npm run dev
```

## Testing

```shell
npm run test
```

## Linting

```shell
npm run lint
```

## Formatting

```shell
npm run format
```

## OpenSearch

OpenSearch is used for storing member data to allow searching from the admin panel via multiple filters.

There is a pipeline in place for ingesting changes from the Member Profile DynamoDB table into OpenSearch. The diagram below details the pipeline:

![members-opensearch-diagram.png](docs/members-opensearch-diagram.png)
