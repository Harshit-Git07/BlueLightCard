# BLC Monorepo

## Documentation

- [Redemptions Stack](packages/api/redemptions/README.md)
- [Storybook deployments](docs/StorybookDeployments.md)
- [Scaffolding](docs/Scaffolding.md)

## Components

```
-> SST - runs a personal dev environment on AWS with the web client run locally
-> API - REST API run on an environment tagged with your personal 'sst:stage'
-> Web Client - NextJS frontend runs locally
```

## Getting started

### Node version manager (nvm)
Makes sure everyone and everything is using the same version of node.
We recommend sticking with `nvm` rather than other tools as it is what github actions etc use as well.

https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

### Add Github package registry auth token

If you don't have an `.npmrc` file in your user home directory, create one.
Add the following line:

```
//npm.pkg.github.com/:_authToken=<auth_token>
```

Replace `<auth_token>` with a [GitHub Personal Token (classic)](https://github.com/settings/tokens) with permissions set only to `read:packages`.
Then authorise the token with the bluelightcard GitHub organisation.

See the [GitHub documentation on package authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token) for more information.
[config](..%2F..%2F.aws%2Fconfig)
### Install dependencies

Take a copy of the .env.example file and save it as .env in the same directory, however be aware it might be out of date as things are moving quickly so ask your colleagues for an update to date file.
Install dependencies by running:

```sh
npm i
```

### Setup AWS

Setup your aws access key by running:

```sh
aws configure sso
```
Your answers might be different depending on your aws-cli version, but roughly:
1. SSO session name (Recommended): `Bluelight`
2. SSO start URL [https://d-9c6773d39c.awsapps.com/start/#/]: `https://d-9c6773d39c.awsapps.com/start/#/`
3. SSO region [eu-west-1]: `eu-west-2`
4. SSO registration scopes [sso:account:access]: `Just press <enter>`
5. Select `Blue Light Card - DEVELOPMENT` (or whichever environment you need)
6. CLI default client Region [us-east-1]: `eu-west-2`
7. CLI default output format [None]: `Just press <enter>`
8. CLI profile name [AdministratorAccess-361769569967]: `default`

Alternatively, use [Leapp](https://www.leapp.cloud/) - this tool can help you to assume roles.

### Backend development

#### (First time run) Install sst providers

Remember the sst name you used

```sh
sst install
```

### Start up backend

Make sure you have Docker up and running before trying to run the backend code.
Then, to start the backend run the following (this will deploy the backend to the aws account you have configured previously)

```sh
npm run dev
```

#### Troubleshooting
A general fix is to check the docker logs to see if any of the containers aren't starting up properly.
If any of them have errors perhaps consider just deleting the container and recreating it.

If you get an error like
```sh
[INFO] Waiting for local database to be ready...
✖  Checking for changes
   Error: Error creating database connection
       at DbUtils.createConnection (file:///Users/neilarmstrong/Development/bluelight-webapp/.sst.config.1729776766799.mjs:874812:13)
       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
       at async DatabaseAdapter.runMigration (file:///Users/neilarmstrong/Development/bluelight-webapp/.sst.config.1729776766799.mjs:874926:26)
       at async DatabaseAdapter.init (file:///Users/neilarmstrong/Development/bluelight-webapp/.sst.config.1729776766799.mjs:874919:7)
       at async EmptyStack.Offers (file:///Users/neilarmstrong/Development/bluelight-webapp/.sst.config.1729776766799.mjs:874988:17)
       at async Promise.all (index 1)
       at async Object.stacks [as fn] (file:///Users/neilarmstrong/Development/bluelight-webapp/.sst.config.1729776766799.mjs:879310:5)
       at async synthInRoot (file:///Users/neilarmstrong/Development/bluelight-webapp/node_modules/sst/stacks/synth.js:56:13)
       at async Module.synth (file:///Users/neilarmstrong/Development/bluelight-webapp/node_modules/sst/stacks/synth.js:19:16)
       at async build (file:///Users/neilarmstrong/Development/bluelight-webapp/node_modules/sst/cli/commands/dev.js:162:38)
       at async file:///Users/neilarmstrong/Development/bluelight-webapp/node_modules/sst/cli/commands/dev.js:300:13
       at async Promise.all (index 0)
       at async Object.handler (file:///Users/neilarmstrong/Development/bluelight-webapp/node_modules/sst/cli/commands/dev.js:327:9)
[INFO] Waiting for local database to be ready...
[INFO] Waiting for local database to be ready...
[INFO] Waiting for local database to be ready...
[INFO] Waiting for local database to be ready...
[INFO] Waiting for local database to be ready...
```
Then you are probably out of resources on Docker.
I would suggest clearing out some of the old unused images, and restarting all the containers

If you are getting an error about AWS_SDK_LOAD_CONFIG then make sure to export the environment variable `AWS_SDK_LOAD_CONFIG=1`

### Seeding

To seed your local environment run the seed command (in another terminal)
You can set an environment variable SEED_ACCOUNT_ID to configure which account it will seed, by default it will be the shared DEVELOPMENT account `361769569967`

> Note: Make sure to swap `[sst name]` with your sst name you installed sst with

```sh
npm run seed -- [sst name]
```

If successful you will see that the above command starts a mock server, this is mainly for mocking the search endpoint since this endpoint isn't deployed with SST at current, meaning there is no localised service for search, so this is a temporary solution to allow developers to access the search page until this search service is brought into the modernised stack.

Configure the brand using brand flag

```sh
npm run seed -- [sst name] --brand='blc-au'
```

### Start web frontend

To start the front end run (in another terminal):
Make sure your AWS token is setup locally
You will also need values in your web .env file (please ask a coworker for these details)

```sh
npm run dev -w packages/web
```

Go to: http://localhost:3000/mock-login

Log in with your STAGING credentials

### Remove backend deployment

To teardown this environment run (this will remove everything except data storage services like S3 buckets and DynamoDB):

```sh
npm run remove
```

### Ensure you have setup commit signing to push to github
https://bluelightcard.atlassian.net/wiki/spaces/Platform1/pages/2791505924/Commit+Signing

Also make sure that you have verified your bluelight email address on github https://github.com/settings/emails

## Testing

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

## Environments

We have 4 AWS accounts:
- Production
- Staging
- PR
- Development

Production and Staging are entire environments with their own AWS accounts.

Dev environments (personal environments e.g. `rstiff`) and PR enviroments
(ephemeral environments deployed temporariliy for a given PR, e.g. `pr-1801`), are only partial environments.

Due to VPC per-account limits in AWS, Dev and PR environments use a per-aws-account shared `global` stack, specifically it's single VPC.
These two environments have a singleton `global` deployment in their own name.

e.g.
- Dev environment `rstiff`, deployed to `development` aws account, uses the global stack as deployed to the `development` stage.
- PR environment `pr-1801` deployed to `PR` aws account, uses the global stack as deployed to the `pr` stage.

## Architecture and API contracts

### Postman collection

[Postman collection](docs/api/BlueLightCard2.0.postman_collection.json)

### Contracts

- Redemptions ( members ) : https://bluelightcard.atlassian.net/wiki/spaces/TR/pages/2556231774/API+Contracts
- Redemptions ( admin ) : https://bluelightcard.atlassian.net/wiki/spaces/TR/pages/2559115446/Redemptions+Admin+API

Architecture

- https://miro.com/app/board/uXjVKXQLWLc=/
