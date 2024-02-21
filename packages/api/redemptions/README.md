# Redemptions

## Database

### Granting Resources DB Access

The exact requirements for granting resources such as Lambda functions access to the database vary by environment/configuration. For this reason, access should be configured using the database adapter, which exposes utility methods which will correctly configure the function across all environments and configurations.

```ts
// The database adapter is created in `packages/api/redemptions/infrastructure/stack.ts`.
const database = await new RedemptionsDatabase(app, stack, vpc).setup();

// The `SSTFunction` construct can be easily configured to allow DB connections.
// packages/api/redemptions/infrastructure/constructs/SSTFunction.ts
const exampleFunction = new SSTFunction(
  stack,
  '<function-id>',
  // When the `database` prop is included in the function props, database access
  // will be automatically configured.
  //
  // This includes configuration of:
  //   - VPC & Subnet
  //   - Security groups
  //   - Enabling/disabling live lambda (as required by the database type)
  //   - Environment variables
  {
    // Any of the usual function props may be passed as required.
    // For example:
    handler: '<path-to-handler>.<handler>',
    functionName: '<function-name>',
    // Additionaly, the database may be included to grant DB access to the
    // Lambda function:
    database,
  },
);
```

### Testing

At times, it may be necessary or desirable to write tests which interact with the database. For instance, this may be preferable over mocking when asserting that certain data is written to the database. In such cases, it is possible to create a test database running in docker. This can be reset between tests, to avoid cross contamination, and destroyed after all tests have completed.

```ts
describe('Database Tests', () => {
  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  // Before running our tests, spin up the database.
  beforeAll(async () => {
    // The `RedemptionsTestDatabase` helper sets up the database for us,
    // ensuring that it is configured correctly, and migrations are run.
    database = await RedemptionsTestDatabase.start();
    // We can obtain a connection from the returned database handle.
    connection = await database.getConnection();
    // The default timeout is 5 seconds. Usually the DB will take only around 2
    // to 3 seconds to start, but in CI it can take longer. Therefore, we
    // override the timeout to a generous value, to ensure that the DB always
    // has enough time to start.
  }, 60_000);

  // Reset the database between tests. This avoids cross-contamination between
  // test cases.
  afterEach(async () => {
    // Note that we use the optional chaining operator, to ensure this doesn't
    // throw if there was an exception during database startup. This help avoid
    // confusing errors.
    await database?.reset();
  });

  // Tead down the database after all tests have finished running.
  afterAll(async () => {
    // Note that we use the optional chaining operator, to ensure this doesn't
    // throw if there was an exception during database startup. This help avoid
    // confusing errors.
    await database?.down();
  });
});
```

### Schema Updates & Migrations

From time to time we may need to update the schema. This requires the following steps:

1. Update the schema
2. Generate migrations
3. Run the migrations

The schema is located in [`packages/api/redemptions/libs/database/schema.ts`](src/database/schema.ts). It is defined using [Drizzle ORM](https://orm.drizzle.team/). To update the schema simply update the table definitions in [`schema.ts`](src/database/schema.ts).

Once the schema has been updated, the migrations need to be updated. These are managed with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview). To update the schema, simply run:

```sh
npm run -w packages/api/redemptions drizzle:generate
```

This will generate a new migration and update some files used by Drizzle Kit to apply migrations.

The updated migrations are run automatically in CI/CD. To update your local database schema, simply restart SST and the migrations should be run automatically.

Note that Drizzle Kit does not currently support automatic rollbacks. It is often necessary to rollback the database schema when working locally, particularly when working across multiple branches. The simplest way to achieve this is simply to destroy the docker container running the database and allow the migrations and seed scripts to run from a blank slate.

### Inspecting the Database

It's possible to inspect the database locally by running:

```sh
npm run -w packages/api/redemptions drizzle:studio
```
