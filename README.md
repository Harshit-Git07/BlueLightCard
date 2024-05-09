# BLC Monorepo

## Stack Specific Documentation

- [Redemptions](packages/api/redemptions/README.md)

## Components

```
-> SST - runs a personal dev environment on AWS with the web client run locally
-> API - REST API run on an environment tagged with your personal 'sst:stage'
-> Web Client - NextJS frontend runs locally
```

## Getting started

Install dependencies by running:

```sh
npm i
```

Setup your aws access key by running:

```sh
aws configure
```

Alternatively, use Leapp - this tool can help you to assume roles.

To start the backend run the following (this will deploy the backend to your aws account)

```sh
npm run dev
```

### Seeding

To seed your local environment run the seed command (in another terminal)

> Note: Make sure to swap `[dev name]` with your developer name you deployed using sst with

```sh
npm run seed -- [dev name]
```

If successful you will see that the above command starts a mock server, this is mainly for mocking the search endpoint since this endpoint isn't deployed with SST at current, meaning there is no localised service for search, so this is a temporary solution to allow developers to access the search page until this search service is brought into the modernised stack.

Configure the brand using brand flag

```sh
npm run seed -- [dev name] --brand='blc-au'
```

### Web

To start the front end run (in another terminal)

```sh
npm run dev -w packages/web
```

### Remove Stacks

To teardown this environment run (this will remove everything except data storage services like S3 buckets and DynamoDB):

```sh
npm run remove
```

## Test

```sh
npm run test -w packages/api/{package folder name}
```

### Redemptions

By default, the above command will run both unit and end-to-end tests. To run
either in isolation, use the following commands:

```sh
npm run test:unit -w packages/api/redemptions
npm run test:e2e -w packages/api/redemptions
```

Note that you may need to [install the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
if you intend to run tests against a DB hosted in AWS. This is not required when
running a local DB instance.

## Errors

Sometimes you might get an error like this:

```
> @bluelightcard/app@1.0.0 dev
> sst dev

Error: Socket connection timeout

Trace: Error [ERR_SOCKET_CONNECTION_TIMEOUT]: Socket connection timeout
    at __node_internal_captureLargerStackTrace (node:internal/errors:490:5)
    at new NodeError (node:internal/errors:399:5)
    at internalConnectMultiple (node:net:1099:20)
    at Timeout.internalConnectMultipleTimeout (node:net:1638:3)
    at listOnTimeout (node:internal/timers:575:11)
    at process.processTimers (node:internal/timers:514:7)
    at process.<anonymous> (file:///Users/joshghent/Projects/blc-new-test/node_modules/sst/cli/sst.js:58:17)
    at process.emit (node:events:523:35)
    at process.emit (node:domain:489:12)
    at process._fatalException (node:internal/process/execution:159:25)

Need help with this error? Post it in #help on the SST Discord https://sst.dev/discord
```

The solution is to retry the command - it will work eventually 🫣

## Stack

- SST - for managing Infrastructure-as-code
- Hono - for API routing + middleware
- NextJS - for the web application
