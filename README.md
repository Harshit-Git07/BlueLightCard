# BLC Monorepo

## Documentation

- [Redemptions Stack](packages/api/redemptions/README.md)
- [Storybook deployments](docs/StorybookDeployments.md)

## Components

```
-> SST - runs a personal dev environment on AWS with the web client run locally
-> API - REST API run on an environment tagged with your personal 'sst:stage'
-> Web Client - NextJS frontend runs locally
```

## Getting started
Take a copy of the .env.example file and save it as .env in the same directory.

Install dependencies by running:

```sh
npm i
```

Setup your aws access key by running:

```sh
aws configure sso
```

Alternatively, use Leapp - this tool can help you to assume roles.

Make sure you have Docker up and running before trying to run the backend code.

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
You need an AWS token and also WARP ( VPN ) turned on
You also need values in your web .env file ( please ask a coworker )

Go to : http://localhost:3000/mock-login

Log in with your STAGING credentials

### Remove Stacks

To teardown this environment run (this will remove everything except data storage services like S3 buckets and DynamoDB):

```sh
npm run remove
```

## Test

```sh
npm run test -w packages/api/{package folder name}
```

## Database

### Accessing the DB via the Bastion Host

#### Architecture

For security reasons, our database is deployed to a private subnet in our VPC. This means it is not directly accessible via the public internet. To access databases deployed in a private subnet, there are two commonly used strategies:

- Deploying a bastion host to a public subnet and connecting via SSH
- Deploying a bastion host to a private subnet and connecting via AWS SSM Session Manager

Connecting via AWS SSM Session Manager has the following benefits over SSH:

- Our bastion host does not need to be publicly accessible
- We can limit access via IAM
- We do not need to handle SSH keys (which could easily be leaked)

In order to connect via SSM, we can use the AWS CLI to set up a port forwarding session to the remote database host. This will expose the DB connection on local host via a user specified port. We can then connect to the database via localhost, using any PostgreSQL compatible database client.

![SSM Bastion Host Architecture](./.assets/SSM-bastion-host-architecture.png)

#### Getting Started

Pre-requisites:

- [AWS CLI](https://aws.amazon.com/cli/)
- [Session Manager Plugin for AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)

Connecting to the database:

1. Locate the Instance ID of the bastion host
   1. Open the AWS Console
   2. Navigate to EC2 / Instances
   3. Locate the bastion host instance (in staging this is called `staging-bastion-host-redemptions`)
   4. Take note of the Instance ID
2. Locate the RDS endpoint and port you wish to connect to
   1. Open the AWS Console
   2. Navigate to RDS / Databases
   3. Locate the DB instance (in staging this will be one of the instances in `redemptions-db-cluster-staging`)
   4. Click on the instance (to avoid disasters in production, please **only use the reader instance** unless you require write access)
   5. Take note of the database instance endpoint and port (shown under the "Connectivity & security / Endpoint & port" heading)
3. Establish a port forwarding session:
   ```sh
    aws ssm start-session \
      --target "<bastion-host-instance-id>" \
      --document-name AWS-StartPortForwardingSessionToRemoteHost \
      --parameters '
        {
          "portNumber": ["<database-port>"],
          "localPortNumber": ["<some-local-port>"],
          "host": ["<database-host>"]
        }' \
      --reason <reason-for-session>
   ```
4. Locate the database credentials
   1. Open the AWS Console
   2. Navigate to Secrets Manager
   3. Locate the database credentials secret (in staging this is called `RedemptionsDatabaseSecret`)
   4. Click on the secret and select "Retrieve secret value"
   5. Take a note of the username and password
5. Connect to the database
   1. Use host and port `localhost:<some-local-port>`
   2. Use the username and password from the database credentials secret

#### Accessing the Production Database

The production database can be accessed via the bastion host. If your user SSO
user has sufficient privileges to access the database via the bastion host, use
the method defined above. If not, there is a shared Access Key which can be used
if absolutely necessary. This will be accessible via Secrets Manager. If using
these credential, please handle them with care.

IMPORTANT: DO NOT send the Access Key via Teams; users who don't have access to
Secrets Manager in production, also should not have access to the Access Key for
the bastion host.

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

## Architecture and API contracts

### Postman collection
[Postman collection](docs/api/BlueLightCard2.0.postman_collection.json)

### Contracts
- Redemptions ( members ) : https://bluelightcard.atlassian.net/wiki/spaces/TR/pages/2556231774/API+Contracts
- Redemptions ( admin ) : https://bluelightcard.atlassian.net/wiki/spaces/TR/pages/2559115446/Redemptions+Admin+API

Architecture
- https://miro.com/app/board/uXjVKXQLWLc=/
