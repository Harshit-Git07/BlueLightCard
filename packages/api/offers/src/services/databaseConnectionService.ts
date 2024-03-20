import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IDatabaseConnection } from '../constructs/database/iDatabseConnection';
import {
  ConnectionDetails,
  DatabaseConfig,
  DatabaseInstanceType,
  DatabaseType,
  Secret,
} from '../constructs/database/type';
import { ISecretService, SecretResponse, SecretService } from './sdk/secretService';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { EnvironmentVariablesKeys } from '../utils/environment-variables';
import { DbUtils } from '../constructs/database/dbUtils';

export interface IDatabaseConnectionService {
  connect(instanceType?: DatabaseInstanceType): Promise<IDatabaseConnection>;
}

export class DatabaseConnectionService implements IDatabaseConnectionService {
  private readonly dbConfig: DatabaseConfig;
  private readonly iSecretService: ISecretService;
  private dbSecret: Secret | undefined;

  constructor(private readonly logger: LambdaLogger) {
    this.logger.info({ message: `Database connection service initiated` });
    this.dbConfig = JSON.parse(getEnv(EnvironmentVariablesKeys.DATABASE_CONFIG));
    if (!this.dbConfig) {
      this.logger.error({ message: `Database config not found` });
      throw new Error('Database config not found');
    }
    this.iSecretService = new SecretService();
  }

  public async connect(instanceType: DatabaseInstanceType): Promise<IDatabaseConnection> {
    if (this.dbConfig.type !== DatabaseType.LOCAL) {
      const secret: SecretResponse = await this.iSecretService.secretReader(this.dbConfig.secretName!);
      if (secret && typeof secret === 'string') {
        this.dbSecret = JSON.parse(secret);
      }
    }
    const connectionDetails: ConnectionDetails = DbUtils.fromLambdaEnvironmentVariables(
      this.dbConfig,
      this.dbSecret,
      instanceType,
    );
    return await DbUtils.createConnection(connectionDetails);
  }
}

export class SafeFailDatabaseConnectionService {
  private static instance: SafeFailDatabaseConnectionService;
  private static connection: DatabaseSafeFailConnectionType | null = null;
  private serviceInstance: IDatabaseConnectionService | null = null;
  private readonly error: Error | null = null;

  private constructor(private readonly logger: LambdaLogger) {
    this.logger.info({ message: `SafeFail Database connection service initiated` });
    try {
      this.serviceInstance = new DatabaseConnectionService(logger);
    } catch (error) {
      this.error = error as Error;
    }
  }

  public static async getConnection(
    logger: LambdaLogger,
    instanceType?: DatabaseInstanceType,
  ): Promise<DatabaseSafeFailConnectionType | null> {
    if (!SafeFailDatabaseConnectionService.instance) {
      SafeFailDatabaseConnectionService.instance = new SafeFailDatabaseConnectionService(logger);
    }
    if (!SafeFailDatabaseConnectionService.connection) {
      SafeFailDatabaseConnectionService.connection = await SafeFailDatabaseConnectionService.instance.connect(
        instanceType,
      );
    }
    return SafeFailDatabaseConnectionService.connection;
  }

  private async connect(instanceType?: DatabaseInstanceType): Promise<DatabaseSafeFailConnectionType> {
    if (this.error) {
      return { success: false, message: this.error.message };
    }
    try {
      const connection: IDatabaseConnection = await this.serviceInstance!.connect(instanceType);
      return { success: true, connection };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

export type DatabaseSafeFailConnectionType = {
  success: boolean;
  message?: string;
  error?: Error;
  connection?: IDatabaseConnection;
};
