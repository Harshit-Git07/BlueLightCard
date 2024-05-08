# Discovery

Initial skeleton for the search API.

## Endpoints

### GET /search

## Environment Variables

```
SEARCH_LAMBDA_SCRIPTS_HOST - host for the lambda scripts hosted search service
SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT - develop | production
SEARCH_BRAND - 1 | 2 (UK or DDS)
SEARCH_AUTH_TOKEN_OVERRIDE - override the auth token for the search service, useful if running stack outside of staging
or production environments (format is "Bearer abc123")
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
