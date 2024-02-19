import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ConnectionDetails, DatabaseConfig, DatabaseInstanceType, DatabaseType, Secret } from './type';
import { EnvironmentVariablesKeys } from '../utils/environment-variables';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { ILogger } from '../../../core/src/utils/logger/logger';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { DATABASE_PROPS } from '../utils/global-constants';

export class DatabaseConnectionManager {
  private static logger: ILogger;

  public static async connect(instanceType: DatabaseInstanceType, logger: ILogger) {
    return await this.getConnection(instanceType, logger);
  }

  private static async getConnection(instanceType: DatabaseInstanceType, logger: ILogger) {
    this.logger = logger;
    const dbConfig: DatabaseConfig = JSON.parse(getEnv(EnvironmentVariablesKeys.DATABASE_CONFIG));
    logger.info({ message: `Database config: ${JSON.stringify(dbConfig)}` });
    const region = getEnv(EnvironmentVariablesKeys.AWS_REGION);
    let connectionDetails: ConnectionDetails;

    if (dbConfig.type === DatabaseType.CLUSTER) {
      const secret: Secret = await this.getCredentialsFromSecretsBySecretName(dbConfig.secretName!, region);
      if (DatabaseInstanceType.READER === instanceType) {
        connectionDetails = {
          username: secret.username,
          password: secret.password,
          host: dbConfig.clusterReaderHost!.host,
          dbname: secret.dbname,
          port: dbConfig.clusterReaderHost!.port!,
        };
      } else {
        connectionDetails = {
          username: secret.username,
          password: secret.password,
          host: dbConfig.host.host,
          dbname: secret.dbname,
          port: secret.port,
        };
      }
    } else if (dbConfig.type === DatabaseType.INSTANCE) {
      const secret: Secret = await this.getCredentialsFromSecretsBySecretName(dbConfig.secretName!, region);
      connectionDetails = {
        username: secret.username,
        password: secret.password,
        host: dbConfig.host.host,
        dbname: secret.dbname,
        port: secret.port,
      };
    } else if (dbConfig.type === DatabaseType.LOCAL) {
      connectionDetails = {
        username: dbConfig.credentials!.username,
        password: dbConfig.credentials!.password,
        host: dbConfig.host.host,
        dbname: DATABASE_PROPS.NAME.valueOf(),
        port: dbConfig.host.port!,
      };
    } else {
      throw new Error('Database type not supported');
    }
    logger.info({ message: `Database connection details: ${JSON.stringify(connectionDetails)}` });
    return this.createConnection(connectionDetails);
  }

  private static async createConnection(connectionDetails: ConnectionDetails) {
    try {
      const sql = await mysql.createConnection({
        host: connectionDetails.host,
        user: connectionDetails.username,
        database: connectionDetails.dbname,
        password: connectionDetails.password,
        port: connectionDetails.port,
      });
      const db = drizzle(sql);
      return { db, sql };
    } catch (error) {
      this.logger.error({ message: `Error creating database connection ${error}` });
      throw new Error(`Error creating database connection`);
    }
  }

  private static async getCredentialsFromSecretsBySecretName(secretName: string, region: string) {
    const client = new SecretsManagerClient({ region });
    const command = new GetSecretValueCommand({ SecretId: secretName });
    try {
      const { SecretString } = await client.send(command);
      const secret: Secret = JSON.parse(SecretString!);
      return secret;
    } catch (error) {
      this.logger.error({ message: `Error getting secrets from secrets manager ${error}` });
      throw new Error(`Error getting secrets from secrets manager`);
    }
  }
}
