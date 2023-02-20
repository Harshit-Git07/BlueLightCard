# BLC Monorepo

## Components
```
-> API (packages/api) - contains the REST API
-> Localstack - runs a local version of AWS
-> Client (packages/client) - runs the NextJS frontend
```

## Getting started
Install the dependencies by running:
```
npm i
```
To start the backend and the database, first rename the `.env.example` file to `.env`.
Then run the following:
```
docker compose up -d
```

You should be able to connect to MySQL with the following URL.
```
mysql://:example@127.0.0.1/blc
```
To start the frontend app, run the following:
```
npm run dev -w packages/client
```


## Installing dependencies
As this project uses npm workspaces, if you need to install dependencies for a particular application (like the frontend) you need to specify the workspace to use.
For example, if you want to install typescript for the frontend you would run `npm i -s typescript -w packages/client`.
A full list of workspaces can be found in the `package.json` file.

## Commit linting
This monorepo uses commitlint to make sure commit messages meet the conventional commit format across the repo, read more about [commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint).