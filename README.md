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

To start the backend run the following (this will deploy the backend to your aws account):
```
npm run dev
```

To teardown this environment run (this will remove everything except data storage services like S3 buckets and DynamoDB):
```
npm run remove
```

## Test

```
npm run test -w packages/api/{package folder name}
```

To run tests with watch