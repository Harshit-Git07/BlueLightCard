import { DatabaseConfig } from './type';
import { Stack } from 'sst/constructs';
import { Database } from '../constructs/database';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { SecretManager } from '../constructs/secret-manager';
import { SecurityGroupManager } from '../constructs/security-group-manager';
import { EC2Manager } from '../constructs/ec2-manager';
import { DatabaseConfigurator } from './config';

export class DatabaseAdapter {
  private readonly _config: DatabaseConfig;
  private readonly _database: Database;

  constructor(
    private stack: Stack,
    private iVpc: IVpc,
    private secretManager: SecretManager,
    private securityGroupManager: SecurityGroupManager,
    private ec2Manager: EC2Manager,
  ) {
    this._database = this.initDB();
    this._config = this.initConfig();
  }

  private initDB(): Database {
    return new Database(this.stack, this.iVpc, this.secretManager, this.securityGroupManager, this.ec2Manager);
  }

  private initConfig(): DatabaseConfig {
    return new DatabaseConfigurator(this._database.database).config;
  }

  public get database(): Database {
    return this._database;
  }

  public get config(): DatabaseConfig {
    return this._config;
  }
}
