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
import { inject, singleton } from 'tsyringe';
import { Logger } from '@blc-mono/core/utils/logger/logger';

export interface IDatabaseConnectionService {
  connect(instanceType?: DatabaseInstanceType): Promise<IDatabaseConnection>;
}

@singleton()
export class DatabaseConnectionService implements IDatabaseConnectionService {
  static readonly key: string = 'DatabaseConnectionService';
  private readonly dbConfig: DatabaseConfig;
  private readonly iSecretService: ISecretService;
  private dbSecret: Secret | undefined;
  private connection: IDatabaseConnection | null = null;

  constructor(@inject(Logger.key) private readonly logger: LambdaLogger) {
    this.logger.info({ message: `Database connection service initiated` });
    this.dbConfig = JSON.parse(getEnv(EnvironmentVariablesKeys.DATABASE_CONFIG));
    if (!this.dbConfig) {
      this.logger.error({ message: `Database config not found` });
      throw new Error('Database config not found');
    }
    this.iSecretService = new SecretService();
  }

  public async connect(instanceType: DatabaseInstanceType): Promise<IDatabaseConnection> {
    if (!this.connection) {
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
      this.connection = await DbUtils.createConnection(connectionDetails);
    }
    return this.connection;
  }
}
