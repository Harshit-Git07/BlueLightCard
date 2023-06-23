# BLC Monorepo


## Components
```
-> SST - runs a personal dev environment on AWS with the web client run locally
-> API - REST API run on an environment tagged with your personal 'sst:stage'
-> Web Client - NextJS frontend runs locally
```

## Getting started

Install dependencies by running:
```
npm i
```

Setup your aws access key by running:
```
aws configure
```

Alternatively, use Leapp - this tool can help you to assume roles.

To start the backend run the following (this will deploy the backend to your aws account):
```
npm run dev
```

To start the front end run (in another terminal)
```
npm run dev -w packages/web
```

To teardown this environment run (this will remove everything except data storage services like S3 buckets and DynamoDB):
```
npm run remove
```

## Test

```
npm run test -w packages/api/{package folder name}
```

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
* SST - for managing Infrastructure-as-code
* Hono - for API routing + middleware
* NextJS - for the web application
