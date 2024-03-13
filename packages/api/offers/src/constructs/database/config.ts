import { DatabaseInstanceType, DatabaseConfig, DatabaseResource, DatabaseType, Host } from './type';
import { DatabaseCluster, DatabaseInstance, DatabaseProxy } from 'aws-cdk-lib/aws-rds';
import { EnvironmentVariablesKeys } from '../../utils/environment-variables';
import { getEnv } from '../../../../core/src/utils/getEnv';

export class DatabaseConfigurator {
  private readonly _config: DatabaseConfig;

  constructor(private databaseResource: DatabaseResource) {
    switch (true) {
      case this.isDBCluster():
        this._config = this.createServerlessConfig();
        break;
      case this.isDBInstance():
        this._config = this.createDatabaseInstanceConfig();
        break;
      default:
        this._config = this.readFromEnvironmentVariables();
    }
  }

  public get config(): DatabaseConfig {
    return this._config;
  }

  private createServerlessConfig(): DatabaseConfig {
    const database = this.databaseResource as DatabaseCluster;
    return {
      type: DatabaseType.CLUSTER,
      secretName: database.secret!.secretName,
      host: this.getEndPointByClusterType(DatabaseInstanceType.WRITER, database),
      clusterReaderHost: this.getEndPointByClusterType(DatabaseInstanceType.READER, database),
    };
  }

  private getEndPointByClusterType(clusterInstanceType: DatabaseInstanceType, database: DatabaseCluster): Host {
    if (clusterInstanceType === DatabaseInstanceType.READER) {
      return {
        host: database.clusterReadEndpoint.hostname,
        port: database.clusterEndpoint.port,
        type: clusterInstanceType,
      };
    }
    return {
      host: database.clusterEndpoint.hostname,
      port: database.clusterEndpoint.port,
      type: clusterInstanceType,
    };
  }

  private createDatabaseInstanceConfig(): DatabaseConfig {
    const database = this.databaseResource as DatabaseInstance;
    return {
      type: DatabaseType.INSTANCE,
      secretName: database.secret!.secretName,
      host: {
        host: database.dbInstanceEndpointAddress,
      },
    };
  }

  private readFromEnvironmentVariables(): DatabaseConfig {
    console.log('Reading from environment variables');
    return {
      type: DatabaseType.LOCAL,
      host: {
        host: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_HOST),
        port: Number(getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_PORT)),
      },
      credentials: {
        username: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_USER),
        password: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_ROOT_PASSWORD),
      },
    };
  }

  private isDBCluster(): boolean {
    return this.databaseResource instanceof DatabaseCluster;
  }

  private isDBInstance(): boolean {
    return this.databaseResource instanceof DatabaseInstance;
  }

  private isDBProxy(): boolean {
    return this.databaseResource instanceof DatabaseProxy;
  }
}
