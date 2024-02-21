import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';

import { WELL_KNOWN_PORTS_SCHEMA } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvOrDefaultValidated } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { DEFAULT_POSTGRES_PORT } from './database';

/**
 * These keys may be provided to AWS resources to configure the database connection.
 * They're not meant to be used for configuring the SST stack. For environment variables
 * used to configure the SST stack, see [`EnvironmentKeys`](../constants/environment.ts).
 */
export enum DatabaseConnectionEnvironmentKeys {
  REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME = 'REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME',
  REDEMPTIONS_DATABASE_CREDENTIALS_TYPE = 'REDEMPTIONS_DATABASE_CREDENTIALS_TYPE',
  REDEMPTIONS_DATABASE_PASSWORD = 'REDEMPTIONS_DATABASE_PASSWORD',
  REDEMPTIONS_DATABASE_PORT = 'REDEMPTIONS_DATABASE_PORT',
  REDEMPTIONS_DATABASE_READ_ONLY_HOST = 'REDEMPTIONS_DATABASE_READ_ONLY_HOST',
  REDEMPTIONS_DATABASE_READ_WRITE_HOST = 'REDEMPTIONS_DATABASE_READ_WRITE_HOST',
  REDEMPTIONS_DATABASE_USER = 'REDEMPTIONS_DATABASE_USER',
}

export enum DatabaseCredentialsType {
  /**
   * This is the default. It will use AWS Secrets Manager to retrieve the database credentials.
   */
  SECRETS_MANAGER = 'SECRETS_MANAGER',
  /**
   * This is only used for local development. It should never be used in production because database
   * credentials will be stored in plaintext and accessible to anyone with access to the AWS console.
   */
  RAW = 'RAW',
}

export interface IDatabaseCredentials {
  toEnvironmentVariables(): Record<string, string>;
  toRaw(): Promise<RawDatabaseCredentials>;
}

export class RawDatabaseCredentials implements IDatabaseCredentials {
  constructor(public readonly password: string, public readonly username: string) {}

  public static fromRaw(username: string, password: string) {
    return new RawDatabaseCredentials(password, username);
  }

  public toEnvironmentVariables(): Record<string, string> {
    return {
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_CREDENTIALS_TYPE]: DatabaseCredentialsType.RAW,
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_PASSWORD]: this.password,
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_USER]: this.username,
    };
  }

  public async toRaw(): Promise<RawDatabaseCredentials> {
    return this;
  }
}

export class SecretsManagerDatabaseCredentials implements IDatabaseCredentials {
  constructor(public readonly secretName: string) {}

  public static fromSecretName(secretName: string) {
    return new SecretsManagerDatabaseCredentials(secretName);
  }

  public toEnvironmentVariables(): Record<string, string> {
    return {
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_CREDENTIALS_TYPE]:
        DatabaseCredentialsType.SECRETS_MANAGER,
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME]: this.secretName,
    };
  }

  public async toRaw(secretsManagerClient = new SecretsManagerClient()): Promise<RawDatabaseCredentials> {
    const command = new GetSecretValueCommand({
      SecretId: this.secretName,
    });
    const response = await secretsManagerClient.send(command);
    const secretString = response.SecretString;

    if (!secretString) {
      throw new Error(`Secret string not found for secret name: ${this.secretName}`);
    }

    let secret: unknown;
    try {
      secret = JSON.parse(secretString);
    } catch (error) {
      throw new Error(`Failed to parse secret (invalid JSON): ${this.secretName}`);
    }

    const parsedSecret = z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .parse(secret);

    return RawDatabaseCredentials.fromRaw(parsedSecret.username, parsedSecret.password);
  }
}

export class DatabaseCredentialsResolver {
  public static fromEnvironmentVariables(): IDatabaseCredentials {
    const credentialsType = getEnv(DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_CREDENTIALS_TYPE);

    if (credentialsType === DatabaseCredentialsType.RAW) {
      return RawDatabaseCredentials.fromRaw(
        getEnv(DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_USER),
        getEnv(DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_PASSWORD),
      );
    } else if (credentialsType === DatabaseCredentialsType.SECRETS_MANAGER) {
      return SecretsManagerDatabaseCredentials.fromSecretName(
        getEnv(DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME),
      );
    } else {
      throw new Error(`Invalid database credentials type: ${credentialsType}`);
    }
  }
}

export enum DatabaseConnectionType {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE',
}

export class DatabaseEndpoint {
  constructor(
    public readonly readOnlyHost: string,
    public readonly readWriteHost: string,
    public readonly port: number,
  ) {}

  public static fromHostsAndPort(readOnlyHost: string, readWriteHost: string, port: number) {
    return new DatabaseEndpoint(readOnlyHost, readWriteHost, port);
  }

  public static fromHostAndPort(host: string, port: number) {
    return new DatabaseEndpoint(host, host, port);
  }

  public static fromEnvironmentVariables(): DatabaseEndpoint {
    return DatabaseEndpoint.fromHostsAndPort(
      getEnv(DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_READ_ONLY_HOST),
      getEnv(DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_READ_WRITE_HOST),
      getEnvOrDefaultValidated(
        DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_PORT,
        DEFAULT_POSTGRES_PORT,
        WELL_KNOWN_PORTS_SCHEMA,
      ),
    );
  }

  public toEnvironmentVariables(): Record<string, string> {
    return {
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_PORT]: this.port.toString(),
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_READ_ONLY_HOST]: this.readOnlyHost,
      [DatabaseConnectionEnvironmentKeys.REDEMPTIONS_DATABASE_READ_WRITE_HOST]: this.readWriteHost,
    };
  }

  public getHost(connectionType: DatabaseConnectionType): string {
    switch (connectionType) {
      case DatabaseConnectionType.READ_ONLY:
        return this.readOnlyHost;
      case DatabaseConnectionType.READ_WRITE:
        return this.readWriteHost;
      default:
        throw new Error(`Invalid database connection type: ${connectionType}`);
    }
  }
}

export class DatabaseConnectionConfig {
  constructor(
    public readonly credentials: IDatabaseCredentials,
    public readonly endpoint: DatabaseEndpoint,
    public readonly databaseName: string,
  ) {}

  public static fromCredentialsAndEndpoint(
    credentials: IDatabaseCredentials,
    endpoint: DatabaseEndpoint,
    databaseName: string,
  ): DatabaseConnectionConfig {
    return new DatabaseConnectionConfig(credentials, endpoint, databaseName);
  }

  public static fromEnvironmentVariables(): DatabaseConnectionConfig {
    const credentials = DatabaseCredentialsResolver.fromEnvironmentVariables();
    const endpoint = DatabaseEndpoint.fromEnvironmentVariables();
    const databaseName = getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_NAME);
    return new DatabaseConnectionConfig(credentials, endpoint, databaseName);
  }

  public toEnvironmentVariables(): Record<string, string> {
    return {
      ...this.credentials.toEnvironmentVariables(),
      ...this.endpoint.toEnvironmentVariables(),
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_NAME]: this.databaseName,
    };
  }

  public async toConnection(connectionType: DatabaseConnectionType): Promise<DatabaseConnection> {
    return DatabaseConnection.connect(this, connectionType);
  }
}

export interface IDatabaseConnection {
  readonly db: PostgresJsDatabase<Record<string, never>>;
  readonly sql: postgres.Sql;

  close(): Promise<void>;
}

export class DatabaseConnection implements IDatabaseConnection {
  static readonly key = 'DatabaseConnection' as const;
  constructor(public readonly db: PostgresJsDatabase<Record<string, never>>, public readonly sql: postgres.Sql) {}

  public static async connect(
    config: DatabaseConnectionConfig,
    connectionType: DatabaseConnectionType,
  ): Promise<DatabaseConnection> {
    const rawCredentials = await config.credentials.toRaw();

    const sql: postgres.Sql = postgres({
      host: config.endpoint.getHost(connectionType),
      port: config.endpoint.port,
      database: config.databaseName,
      username: rawCredentials.username,
      password: rawCredentials.password,
    });
    const db = drizzle(sql);
    return new DatabaseConnection(db, sql);
  }

  public static async fromEnvironmentVariables(connectionType: DatabaseConnectionType): Promise<DatabaseConnection> {
    const config = DatabaseConnectionConfig.fromEnvironmentVariables();
    return DatabaseConnection.connect(config, connectionType);
  }

  public async close(): Promise<void> {
    await this.sql.end();
  }
}
