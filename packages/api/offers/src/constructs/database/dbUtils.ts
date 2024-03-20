import { ConnectionDetails, DatabaseConfig, DatabaseInstanceType, DatabaseType, Secret } from './type';
import { getEnv } from '../../../../core/src/utils/getEnv';
import { EnvironmentVariablesKeys } from '../../utils/environment-variables';
import { Connection as MySQlConnection, createConnection as createMySQLConnection } from 'mysql2/promise';
import { IDatabaseConnection } from './iDatabseConnection';
import { drizzle } from 'drizzle-orm/mysql2';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { DATABASE_PROPS } from '../../utils/global-constants';

export class DbUtils {
  constructor() {}

  public static async createConnection(connectionDetails: ConnectionDetails): Promise<IDatabaseConnection> {
    try {
      const mysqlConnection: MySQlConnection = await createMySQLConnection({
        host: connectionDetails.host,
        user: connectionDetails.username,
        database: connectionDetails.dbname,
        password: connectionDetails.password,
        port: connectionDetails.port,
      });
      const client: MySql2Database<Record<string, never>> = drizzle(mysqlConnection);
      return { drizzleClient: client, directConnection: mysqlConnection };
    } catch (error) {
      throw new Error(`Error creating database connection`);
    }
  }

  public static fromLocalEnvironmentVariables(): ConnectionDetails {
    return {
      host: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_HOST),
      port: parseInt(getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_PORT)),
      username: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_USER),
      password: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_ROOT_PASSWORD),
      dbname: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_NAME),
    };
  }

  public static fromLambdaEnvironmentVariables(
    dbConfig: DatabaseConfig,
    dbSecret?: Secret,
    instanceType: DatabaseInstanceType = DatabaseInstanceType.READER,
  ): ConnectionDetails {
    return {
      username: this.isLocalInstance(dbConfig.type!) ? dbConfig.credentials!.username : dbSecret!.username,
      password: this.isLocalInstance(dbConfig.type!) ? dbConfig.credentials!.password : dbSecret!.password,
      dbname: this.isLocalInstance(dbConfig.type!) ? DATABASE_PROPS.NAME : dbSecret!.dbname,
      host: this.isReaderInstanceNotLocal(instanceType, dbConfig.type!)
        ? dbConfig.clusterReaderHost!.host
        : dbConfig.host.host,
      port: this.normalizePort(
        instanceType,
        dbConfig.type!,
        dbConfig.clusterReaderHost?.port,
        dbConfig.host?.port,
        dbSecret?.port,
      ),
    };
  }

  private static isReaderInstance(instanceType: DatabaseInstanceType): boolean {
    return instanceType === DatabaseInstanceType.READER;
  }

  private static isLocalInstance(databaseType: DatabaseType): boolean {
    return databaseType === DatabaseType.LOCAL;
  }

  private static isReaderInstanceNotLocal(instanceType: DatabaseInstanceType, databaseType: DatabaseType): boolean {
    return this.isReaderInstance(instanceType) && !this.isLocalInstance(databaseType);
  }

  private static normalizePort(
    instanceType: DatabaseInstanceType,
    databaseType: DatabaseType,
    readerPort?: number,
    hostPort?: number,
    secretPort?: number,
  ): number {
    if (this.isReaderInstanceNotLocal(instanceType, databaseType)) {
      return readerPort!;
    } else if (this.isLocalInstance(databaseType)) {
      return hostPort!;
    } else {
      return secretPort!;
    }
  }
}
